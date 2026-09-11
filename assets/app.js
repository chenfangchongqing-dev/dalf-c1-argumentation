(function(){
  const data = window.DALF_DATA || {dossiers:[],written:[],oral:[],matrix:[]};
  const byId = Object.fromEntries(data.dossiers.map(d=>[d.ID,d]));

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));
  }
  function splitLines(v){
    if(!v) return [];
    return String(v).split(/\n|\s*;\s*/).map(s=>s.trim()).filter(Boolean);
  }
  function splitNumbered(v){
    if(!v) return [];
    return String(v).split(/\n/).map(s=>s.replace(/^\d+[.)]\s*/, '').trim()).filter(Boolean);
  }
  function dossierCard(d){
    const w = Number(d['Sujets écrits associés']||0), o = Number(d['Sujets oraux associés']||0);
    return `<article class="card">
      <div class="card-id">${esc(d.ID)}</div>
      <h3>${esc(d['Dossier / 主题包'])}</h3>
      <p>${esc(d['Périmètre'])}</p>
      <div class="meta-row"><span class="tag">${w} écrit${w>1?'s':''}</span><span class="tag green">${o} oral${o>1?'s':''}</span><span class="tag warm">${esc(d['Priorité'])}</span></div>
      <a class="arrow-link" href="dossier.html?id=${encodeURIComponent(d.ID)}">Ouvrir le dossier →</a>
    </article>`;
  }
  function renderDossierCards(targetId, limit){
    const el=document.getElementById(targetId); if(!el) return;
    const ds=limit?data.dossiers.slice(0,limit):data.dossiers;
    el.innerHTML=ds.map(dossierCard).join('');
  }
  function renderDossierDetail(){
    const root=document.getElementById('dossier-detail'); if(!root) return;
    const id=new URLSearchParams(location.search).get('id')||'D01';
    const d=byId[id];
    if(!d){root.innerHTML='<div class="empty">Dossier introuvable.</div>';return;}
    const f=d.fiche||{};
    document.title=`${id} — ${d['Dossier / 主题包']} | DALF C1`;
    const written=data.written.filter(x=>x['ID dossier']===id);
    const oral=data.oral.filter(x=>x['ID dossier']===id);
    const problems=splitLines(f['Problématiques-types']);
    const axes=splitNumbered(f['Axes réutilisables']);
    const lex=splitLines(f['Lexique pivot']);
    const tensions=splitLines(f['Tensions structurantes']);
    const examples=splitLines(f["Types d’exemples à préparer"]);
    const objections=splitLines(f['Objections / contre-arguments à anticiper']);
    root.innerHTML=`
      <div class="page-head"><div class="container">
        <div class="breadcrumb"><a href="dossiers.html">Dossiers</a> / ${esc(id)}</div>
        <div class="kicker">${esc(id)} · ${esc(d['Priorité'])}</div>
        <h1>${esc(d['Dossier / 主题包'])}</h1>
        <p class="lede">${esc(f['Périmètre']||d['Périmètre'])}</p>
        <div class="tension-list">${tensions.map(x=>`<span class="tension">${esc(x)}</span>`).join('')}</div>
      </div></div>
      <section class="section"><div class="container detail-grid">
        <main>
          <section class="block" id="problematiques"><h2>Problématiques-types</h2><p class="small">不是背题，而是训练把 thème 转化成可以论证的问题。</p><ol class="numbered">${problems.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>
          <section class="block" id="axes"><h2>Axes réutilisables</h2><p class="small">同一组 axes 可以根据真题重新排序、收缩或改写。</p><ol class="numbered">${axes.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>
          <section class="block" id="lexique"><h2>Lexique pivot</h2><div class="meta-row">${lex.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div></section>
          <section class="block" id="exemples"><h2>Exemples à préparer</h2><ul class="list-clean">${examples.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>
          <section class="block" id="objections"><h2>Objections à anticiper</h2><p class="small">尤其用于 exposé 后的 entretien：objection → concession → réponse。</p><ul class="list-clean">${objections.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>
          <section class="block" id="transformation"><h2>Un dossier, deux tâches</h2>
            <div class="task-compare"><div class="task-box"><div class="task-title">ESSAI</div><p><strong>Convaincre un lecteur</strong> dans une situation d’écriture.</p><p class="small">Destinataire · genre · registre · paragraphes · densité argumentative.</p></div><div class="task-box"><div class="task-title">EXPOSÉ</div><p><strong>Conduire un auditeur</strong> dans un raisonnement à partir de documents.</p><p class="small">Problématique · appropriation des documents · oralité · transitions audibles · reformulation.</p></div></div>
          </section>
          <section class="block" id="sujets"><h2>Sujets associés</h2>
            <h3>Écrit</h3>${written.length?`<ul class="list-clean">${written.map(x=>`<li><strong>${esc(x.Date)} · ${esc(x.Zone)}</strong> — ${esc(x.Thème)}<br><span class="small">${esc(x['Consigne (résumée fidèlement)'])}</span></li>`).join('')}</ul>`:'<p class="small">Aucun sujet écrit rattaché.</p>'}
            <h3>Oral</h3>${oral.length?`<ul class="list-clean">${oral.slice(0,20).map(x=>`<li>${esc(x["Thème de l’exposé"])} <span class="small">· ${esc(x['Pertinence pour le corpus croisé']||'')}</span></li>`).join('')}</ul>${oral.length>20?`<p class="small">+ ${oral.length-20} autres sujets dans la banque complète.</p>`:''}`:'<p class="small">Aucun sujet oral rattaché.</p>'}
          </section>
        </main>
        <aside class="sidebar"><nav class="side-menu"><a href="#problematiques">Problématiques</a><a href="#axes">Axes</a><a href="#lexique">Lexique</a><a href="#exemples">Exemples</a><a href="#objections">Objections</a><a href="#transformation">Essai ↔ exposé</a><a href="#sujets">Sujets associés</a></nav></aside>
      </div></section>`;
  }
  function renderSubjects(){
    const tbody=document.getElementById('subjects-body'); if(!tbody) return;
    const q=document.getElementById('subject-q');
    const kind=document.getElementById('subject-kind');
    const dossier=document.getElementById('subject-dossier');
    if(dossier && dossier.options.length===1){data.dossiers.forEach(d=>{const o=document.createElement('option');o.value=d.ID;o.textContent=`${d.ID} — ${d['Dossier / 主题包']}`;dossier.appendChild(o);});}
    function run(){
      const query=(q?.value||'').toLowerCase().trim();
      const k=kind?.value||'all'; const did=dossier?.value||'all';
      const rows=[];
      if(k==='all'||k==='written') data.written.forEach(x=>rows.push({kind:'Écrit',date:x.Date,zone:x.Zone,title:x.Thème,angle:x['Sous-thème / angle'],did:x['ID dossier'],note:x['Consigne (résumée fidèlement)']}));
      if(k==='all'||k==='oral') data.oral.forEach(x=>rows.push({kind:'Oral',date:'—',zone:x.Catégorie,title:x["Thème de l’exposé"],angle:x['Mots-clés'],did:x['ID dossier'],note:[x['Document 1'],x['Document 2'],x['Document 3']].filter(Boolean).join(' · ')}));
      const filtered=rows.filter(r=>{if(did!=='all'&&r.did!==did) return false;if(!query) return true;return [r.kind,r.date,r.zone,r.title,r.angle,r.did,r.note].join(' ').toLowerCase().includes(query);});
      tbody.innerHTML=filtered.map(r=>`<tr><td><span class="tag ${r.kind==='Oral'?'green':'warm'}">${r.kind}</span></td><td>${esc(r.date)}</td><td>${esc(r.zone)}</td><td><strong>${esc(r.title)}</strong><br><span class="small">${esc(r.angle||'')}</span></td><td><a class="arrow-link" href="dossier.html?id=${encodeURIComponent(r.did||'')}">${esc(r.did||'Complément')}</a></td><td class="small">${esc(r.note||'')}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Aucun résultat.</td></tr>';
      const count=document.getElementById('subjects-count'); if(count) count.textContent=`${filtered.length} sujet${filtered.length>1?'s':''}`;
    }
    [q,kind,dossier].forEach(el=>el&&el.addEventListener(el===q?'input':'change',run)); run();
  }
  function renderMatrix(){
    const tbody=document.getElementById('matrix-body'); if(!tbody) return;
    tbody.innerHTML=data.matrix.map(x=>`<tr><td>${esc(x['Date / zone'])}</td><td><strong>${esc(x['Sujet écrit (noyau)'])}</strong></td><td><a class="arrow-link" href="dossier.html?id=${esc(x.ID)}">${esc(x.ID)}</a><br><span class="small">${esc(x.Dossier)}</span></td><td>${esc(x['Sujets oraux les plus proches']).replace(/\n/g,'<br>')}</td><td><span class="tag green">${esc(x.Chevauchement)}</span></td></tr>`).join('');
  }
  function setActiveNav(){
    const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(a=>{const href=(a.getAttribute('href')||'').split('?')[0].toLowerCase(); if(href===page || (page==='dossier.html'&&href==='dossiers.html')) a.classList.add('active');});
  }
  renderDossierCards('home-dossiers');renderDossierCards('all-dossiers');renderDossierDetail();renderSubjects();renderMatrix();setActiveNav();
})();