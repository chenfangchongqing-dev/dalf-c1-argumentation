(function(){
  const data = window.DALF_DATA || {dossiers:[],written:[],oral:[],matrix:[]};
  const methodData = window.DALF_METHODES || {books:[],resources:[],toolboxes:[]};
  const byId = Object.fromEntries(data.dossiers.map(d=>[d.ID,d]));
  const bookById = Object.fromEntries((methodData.books||[]).map(b=>[b.id,b]));

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

  function methodResourceCard(r, compact){
    const book=bookById[r.bookId]||{};
    return `<article class="method-resource ${compact?'compact':''}">
      <div class="method-resource-top"><span class="tag">${esc(book.title||r.bookId)}</span><span class="tag green">${esc(r.priority||'')}</span></div>
      <h3>${esc(r.location)}${r.title?` — <em>${esc(r.title)}</em>`:''}</h3>
      <p class="method-pages">${esc(r.pages||'')}</p>
      <p><strong>À travailler pour :</strong> ${esc(r.focus||'')}</p>
      <p class="small"><strong>À relever :</strong> ${esc(r.collect||'')}</p>
      ${compact?'':`<a class="arrow-link" href="methode-livre.html?id=${encodeURIComponent(r.bookId)}">Voir cette méthode →</a>`}
    </article>`;
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
    const methodResources=(methodData.resources||[]).filter(x=>x.dossierId===id);
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
          <section class="block" id="methodes"><div class="section-intro method-heading"><div><div class="kicker">Ressources complémentaires</div><h2>À consulter dans les méthodes</h2></div><a class="arrow-link" href="methodes.html">Voir toutes les méthodes →</a></div>
            <p class="small">利用原版法语教材补充表达、论据、例子和反驳方式。不是“看完一个单元”，而是带着提取任务去读。</p>
            ${methodResources.length?`<div class="method-resource-list">${methodResources.map(r=>methodResourceCard(r,false)).join('')}</div>`:'<p class="small">Aucune ressource de méthode n’est encore indexée pour ce dossier.</p>'}
          </section>
          <section class="block" id="sujets"><h2>Sujets associés</h2>
            <h3>Écrit</h3>${written.length?`<ul class="list-clean">${written.map(x=>`<li><strong>${esc(x.Date)} · ${esc(x.Zone)}</strong> — ${esc(x.Thème)}<br><span class="small">${esc(x['Consigne (résumée fidèlement)'])}</span></li>`).join('')}</ul>`:'<p class="small">Aucun sujet écrit rattaché.</p>'}
            <h3>Oral</h3>${oral.length?`<ul class="list-clean">${oral.slice(0,20).map(x=>`<li>${esc(x["Thème de l’exposé"])} <span class="small">· ${esc(x['Pertinence pour le corpus croisé']||'')}</span></li>`).join('')}</ul>${oral.length>20?`<p class="small">+ ${oral.length-20} autres sujets dans la banque complète.</p>`:''}`:'<p class="small">Aucun sujet oral rattaché.</p>'}
          </section>
        </main>
        <aside class="sidebar"><nav class="side-menu"><a href="#problematiques">Problématiques</a><a href="#axes">Axes</a><a href="#lexique">Lexique</a><a href="#exemples">Exemples</a><a href="#objections">Objections</a><a href="#transformation">Essai ↔ exposé</a><a href="#methodes">À consulter</a><a href="#sujets">Sujets associés</a></nav></aside>
      </div></section>`;
  }

  function renderMethodIndex(){
    const root=document.getElementById('method-books'); if(!root) return;
    const books=methodData.books||[];
    root.innerHTML=books.map(b=>{
      const count=(methodData.resources||[]).filter(r=>r.bookId===b.id).length;
      return `<article class="card book-card"><div class="card-id">${esc(b.level)} · ${esc(b.publisher)}</div><h3>${esc(b.title)}</h3><p>${esc(b.summary)}</p><div class="meta-row">${(b.strengths||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div><p class="small">${count} repère${count>1?'s':''} actuellement indexé${count>1?'s':''} dans les dossiers.</p><a class="arrow-link" href="methode-livre.html?id=${encodeURIComponent(b.id)}">Explorer la méthode →</a></article>`;
    }).join('') || '<div class="empty">Aucune méthode n’est encore indexée.</div>';
  }

  function renderMethodBook(){
    const root=document.getElementById('method-book-detail'); if(!root) return;
    const id=new URLSearchParams(location.search).get('id')||(methodData.books[0]&&methodData.books[0].id);
    const b=bookById[id];
    if(!b){root.innerHTML='<div class="empty">Méthode introuvable.</div>';return;}
    const resources=(methodData.resources||[]).filter(r=>r.bookId===id);
    const tools=(methodData.toolboxes||[]).filter(t=>t.bookId===id);
    document.title=`${b.title} — À consulter dans les méthodes | DALF C1`;
    root.innerHTML=`
      <section class="page-head"><div class="container"><div class="breadcrumb"><a href="methodes.html">À consulter dans les méthodes</a> / ${esc(b.title)}</div><div class="kicker">${esc(b.level)} · ${esc(b.publisher)}</div><h1>${esc(b.title)}</h1><p class="lede">${esc(b.summary)}</p><div class="meta-row">${(b.strengths||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div></div></section>
      <section class="section"><div class="container detail-grid"><main>
        <section class="block" id="ou-chercher"><h2>Où chercher ?</h2><p>从 DALF C1 的主题出发反查教材。下面不是完整目录，而是与我们的 10 个 argumentation dossiers 最有迁移价值的单元。</p><div class="method-resource-list">${resources.map(r=>{
          const d=byId[r.dossierId];
          return `<div>${methodResourceCard(r,true)}<a class="arrow-link method-dossier-link" href="dossier.html?id=${encodeURIComponent(r.dossierId)}">${esc(r.dossierId)} — ${esc(d?d['Dossier / 主题包']:'Dossier')} →</a></div>`;
        }).join('')}</div></section>
        <section class="block" id="boite"><div class="kicker">Stratégies transversales</div><h2>Boîte à outils — ${esc(b.title)}</h2><p class="small">这些页面不属于某一个单独主题，可以跨 dossier 反复使用。</p><div class="tool-grid">${tools.map(t=>`<article class="tool-card"><div class="card-id">${esc(t.page)}</div><h3>${esc(t.title)}</h3><p><strong>${esc(t.focus)}</strong></p><p class="small">${esc(t.use)}</p></article>`).join('')}</div></section>
        <section class="block" id="exploiter"><h2>Comment exploiter cette méthode ?</h2><p>每次选择一个相关单元，不要求“把这一课看完”。阅读后完成一张固定的 <strong>récolte</strong>，把教材资源转入自己的 DALF argumentation dossier。</p><div class="harvest-grid"><div><span>01</span><strong>8 expressions utiles</strong><small>搭配、动词结构、论证表达，不只摘孤立单词。</small></div><div><span>02</span><strong>2 arguments transférables</strong><small>能够迁移到相邻真题，而不是原文观点的照搬。</small></div><div><span>03</span><strong>2 exemples</strong><small>事实、数据、案例或个人经验均可。</small></div><div><span>04</span><strong>1 objection / réserve</strong><small>找出一个能限制或复杂化主张的反方观点。</small></div><div><span>05</span><strong>2 formulations de nuance</strong><small>concession、restriction、réfutation 等表达。</small></div></div></section>
      </main><aside class="sidebar"><nav class="side-menu"><a href="#ou-chercher">Où chercher ?</a><a href="#boite">Boîte à outils</a><a href="#exploiter">Comment l’exploiter ?</a><a href="methodes.html">Toutes les méthodes</a></nav></aside></div></section>`;
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
    document.querySelectorAll('.nav-links a').forEach(a=>{
      const href=(a.getAttribute('href')||'').split('?')[0].toLowerCase();
      if(href===page || (page==='dossier.html'&&href==='dossiers.html') || (page==='methode-livre.html'&&href==='methodes.html')) a.classList.add('active');
    });
  }
  renderDossierCards('home-dossiers');
  renderDossierCards('all-dossiers');
  renderDossierDetail();
  renderMethodIndex();
  renderMethodBook();
  renderSubjects();
  renderMatrix();
  setActiveNav();
})();