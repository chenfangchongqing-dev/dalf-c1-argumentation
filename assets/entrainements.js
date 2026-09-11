(function(){
  const pack = window.DALF_ENTRAINEMENTS || {items:[]};
  const items = pack.items || [];
  const methodData = window.DALF_METHODES || {books:[]};
  const core = window.DALF_DATA || {dossiers:[]};
  const books = Object.fromEntries((methodData.books||[]).map(b=>[b.id,b]));
  const dossiers = Object.fromEntries((core.dossiers||[]).map(d=>[d.ID,d]));

  function esc(v){return String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));}
  function dossierName(id){const d=dossiers[id];return d?`${id} — ${d['Dossier / 主题包']}`:id;}
  function skillTags(x){return (x.skills||[]).map(s=>`<span class="tag">${esc(s)}</span>`).join('');}
  function dossierTags(x){return (x.dossiers||[]).map(d=>`<a class="tag green" href="dossier.html?id=${encodeURIComponent(d)}">${esc(d)}</a>`).join('');}
  function trainingCard(x){
    const b=books[x.bookId]||{};
    return `<article class="training-card">
      <div class="card-id">${esc(b.title||x.bookId)} · ${esc(x.series)} · ${esc(x.level)}</div>
      <h3>${esc(x.title)}</h3>
      <p>${esc(x.summary)}</p>
      <div class="training-meta">${skillTags(x)}</div>
      <div class="training-meta">${dossierTags(x)}<span class="tag warm">${esc(x.priority||'')}</span></div>
      <div class="training-source"><strong>${esc(x.studentPages)}</strong><br>${esc(x.guidePages)}<br>Corrigé : ${esc(x.correctionType||'à vérifier')}</div>
      <a class="arrow-link" href="entrainement.html?id=${encodeURIComponent(x.id)}">Voir la fiche d’entraînement →</a>
    </article>`;
  }

  function renderIndex(){
    const root=document.getElementById('training-index'); if(!root) return;
    const q=document.getElementById('training-q');
    const skill=document.getElementById('training-skill');
    const did=document.getElementById('training-dossier');
    if(skill && skill.options.length===1){[...new Set(items.flatMap(x=>x.skills||[]))].sort().forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;skill.appendChild(o);});}
    if(did && did.options.length===1){Object.keys(dossiers).forEach(id=>{const o=document.createElement('option');o.value=id;o.textContent=dossierName(id);did.appendChild(o);});}
    function run(){
      const query=(q?.value||'').trim().toLowerCase();
      const sk=skill?.value||'all'; const di=did?.value||'all';
      const filtered=items.filter(x=>{
        const hay=[x.title,x.series,x.level,x.summary,x.studentPages,x.guidePages,(x.skills||[]).join(' '),(x.dossiers||[]).join(' ')].join(' ').toLowerCase();
        return (!query||hay.includes(query)) && (sk==='all'||(x.skills||[]).includes(sk)) && (di==='all'||(x.dossiers||[]).includes(di));
      });
      const complete=filtered.filter(x=>x.series.toLowerCase().includes('épreuve'));
      const targeted=filtered.filter(x=>!x.series.toLowerCase().includes('épreuve'));
      root.innerHTML=`<p class="training-count">${filtered.length} ressource${filtered.length>1?'s':''} affichée${filtered.length>1?'s':''}.</p>`+
        (targeted.length?`<h2>Entraînements ciblés dans le manuel</h2><div class="training-list">${targeted.map(trainingCard).join('')}</div>`:'')+
        (complete.length?`<h2 class="training-section-title">Épreuves complètes DALF C1</h2><div class="training-list">${complete.map(trainingCard).join('')}</div>`:'')+
        (!filtered.length?'<div class="empty">Aucune ressource ne correspond aux filtres.</div>':'');
    }
    [q,skill,did].forEach(el=>el&&el.addEventListener(el.tagName==='INPUT'?'input':'change',run)); run();
  }

  function renderCorrection(c){
    if(!c) return `<section class="block"><h2>Corrigé</h2><p>Le guide comporte un corrigé ou des propositions de plan. Cette fiche indique où le retrouver ; le contenu détaillé n’est pas encore transposé dans la plateforme.</p></section>`;
    function renderTask(t){
      if(!t) return '';
      const lead=t.situation?`<div class="correction-intro"><strong>Situation :</strong> ${esc(t.situation)}</div>`:'';
      const prob=t.problematic?`<div class="correction-intro"><strong>Problématique :</strong> ${esc(t.problematic)}</div>`:'';
      const intro=t.introduction?`<div class="correction-intro"><strong>Introduction — logique proposée :</strong> ${esc(t.introduction)}</div>`:'';
      const sections=(t.sections||[]).map(s=>`<div class="correction-part"><h3>${esc(s.title)}</h3><ul class="correction-points">${(s.points||[]).map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>`).join('');
      const concl=t.conclusion?`<div class="correction-conclusion"><strong>Conclusion — logique proposée :</strong> ${esc(t.conclusion)}</div>`:'';
      return `<section class="block"><div class="kicker">Corrigé</div><h2>${esc(t.label||'Proposition de correction')}</h2>${lead}${prob}${intro}${sections}${concl}</section>`;
    }
    return `<div class="correction-source">${esc(c.sourceNote||'')}</div>${renderTask(c.written)}${renderTask(c.oral)}${c.teachingNote?`<div class="teaching-note"><strong>À comparer en classe :</strong> ${esc(c.teachingNote)}</div>`:''}`;
  }

  function renderDetail(){
    const root=document.getElementById('training-detail'); if(!root) return;
    const id=new URLSearchParams(location.search).get('id');
    const x=items.find(i=>i.id===id)||items[0];
    if(!x){root.innerHTML='<div class="empty">Aucun entraînement indexé.</div>';return;}
    const b=books[x.bookId]||{};
    document.title=`${x.title} — Entraînements DALF | DALF C1`;
    root.innerHTML=`
      <section class="page-head"><div class="container">
        <div class="breadcrumb"><a href="entrainements.html">Entraînements DALF</a> / ${esc(x.series)}</div>
        <div class="kicker">${esc(b.title||x.bookId)} · ${esc(x.level)}</div>
        <h1>${esc(x.title)}</h1>
        <p class="lede">${esc(x.summary)}</p>
        <div class="training-meta">${skillTags(x)}${dossierTags(x)}</div>
      </div></section>
      <section class="section"><div class="container detail-grid"><main>
        <section class="block"><h2>Repères dans la méthode</h2><p><strong>${esc(x.studentPages)}</strong><br>${esc(x.guidePages)}</p><p><strong>Type de corrigé :</strong> ${esc(x.correctionType)}</p><p class="small">Cette plateforme sert d’index pédagogique : pour le sujet et les documents complets, se reporter à la méthode originale.</p></section>
        ${renderCorrection(x.correction)}
      </main><aside class="sidebar"><nav class="side-menu"><a href="entrainements.html">Tous les entraînements</a>${(x.dossiers||[]).map(d=>`<a href="dossier.html?id=${encodeURIComponent(d)}">${esc(dossierName(d))}</a>`).join('')}<a href="methode-livre.html?id=${encodeURIComponent(x.bookId)}">${esc(b.title||'Méthode')}</a></nav></aside></div></section>`;
  }

  function injectIntoDossier(){
    const root=document.getElementById('dossier-detail'); if(!root) return;
    const id=new URLSearchParams(location.search).get('id')||'D01';
    const matches=items.filter(x=>(x.dossiers||[]).includes(id) && ((x.skills||[]).some(s=>/Essai|Exposé|Entretien|Synthèse/.test(s))));
    const anchor=document.getElementById('sujets'); if(!anchor || !matches.length) return;
    const section=document.createElement('section'); section.className='block'; section.id='entrainements-dalf';
    section.innerHTML=`<div class="section-intro method-heading"><div><div class="kicker">Méthodes originales</div><h2>Entraînements DALF à faire</h2></div><a class="arrow-link" href="entrainements.html?dossier=${encodeURIComponent(id)}">Voir la banque →</a></div><p class="small">Exercices d’entraînement repérés dans les méthodes et reliés à ce dossier d’argumentation.</p><div class="training-inline">${matches.map(trainingCard).join('')}</div>`;
    anchor.parentNode.insertBefore(section,anchor);
    const menu=document.querySelector('.side-menu'); if(menu){const a=document.createElement('a');a.href='#entrainements-dalf';a.textContent='Entraînements DALF';const before=[...menu.querySelectorAll('a')].find(el=>el.getAttribute('href')==='#sujets');before?menu.insertBefore(a,before):menu.appendChild(a);}
  }

  function injectIntoMethodBook(){
    const root=document.getElementById('method-book-detail'); if(!root) return;
    const id=new URLSearchParams(location.search).get('id')||'';
    const matches=items.filter(x=>x.bookId===id);
    const boite=document.getElementById('boite'); if(!boite || !matches.length) return;
    const section=document.createElement('section'); section.className='block'; section.id='entrainements-methode';
    section.innerHTML=`<div class="section-intro method-heading"><div><div class="kicker">Préparation DALF</div><h2>Entraînements DALF dans cette méthode</h2></div><a class="arrow-link" href="entrainements.html">Voir tous les entraînements →</a></div><div class="training-inline">${matches.filter(x=>(x.skills||[]).some(s=>/Essai|Exposé|Entretien|Synthèse/.test(s))).map(trainingCard).join('')}</div><p class="small">Les activités centrées uniquement sur la compréhension restent visibles dans la banque générale.</p>`;
    boite.parentNode.insertBefore(section,boite);
    const menu=document.querySelector('.side-menu'); if(menu){const a=document.createElement('a');a.href='#entrainements-methode';a.textContent='Entraînements DALF';const ref=[...menu.querySelectorAll('a')].find(el=>el.getAttribute('href')==='#boite');ref?menu.insertBefore(a,ref):menu.appendChild(a);}
  }

  function applyQueryPreset(){
    const preset=new URLSearchParams(location.search).get('dossier');
    const sel=document.getElementById('training-dossier');
    if(preset&&sel){sel.value=preset;sel.dispatchEvent(new Event('change'));}
  }

  renderIndex();
  renderDetail();
  injectIntoDossier();
  injectIntoMethodBook();
  applyQueryPreset();
})();
