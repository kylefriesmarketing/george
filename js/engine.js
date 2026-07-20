/* =====================================================================
   G FOR GEORGE — engine.js
   The telling, the ledger, and the soak. Built on the SOUTH skeleton:
   one render loop, choices as data, endings as pages. The meters are a
   war ledger: TUNNEL (feet, the shelf's first constructive meter),
   HEAT (0–10), KIT (0–100), THE CREW (0–6), NERVE (named states).
   ===================================================================== */
(() => {
const NODES=STORY.nodes, ENDINGS=STORY.endings, REGIONS=STORY.regions, GOAL=STORY.TUNNEL_GOAL;
const K_P='gg_persist', K_R='gg_run';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------------- persistence: the retellings ---------------- */
function defP(){ return { runs:0, endings:{}, log:{}, mentions:{}, frame:null,
  names:{ hero:'Kit', friend:'Freddie' }, lastTitle:null, journal:[],
  opts:{ size:'normal', reveal:'unfurl', contrast:0, cold:0 } }; }
function loadP(){ try{ const p=JSON.parse(localStorage.getItem(K_P));
  if(p){ const d=defP(); const m=Object.assign(d,p);
    m.names=Object.assign({hero:'Kit',friend:'Freddie'}, p.names||{});
    m.opts=Object.assign({size:'normal',reveal:'unfurl',contrast:0,cold:0}, p.opts||{});
    return m; } }catch(e){}
  return defP(); }
let P=loadP();
Object.defineProperty(P,'__live',{value:true,enumerable:false,configurable:true});
function saveP(){ localStorage.setItem(K_P, JSON.stringify(P)); }

/* the data layer calls these; they must work on WHATEVER P they are
   handed (the soak passes throwaways) and only toast/save on the real one */
function award(p,id){ if(p.mentions[id]) return; p.mentions[id]=1;
  if(p.__live){ saveP(); toast('MENTIONED IN DISPATCHES — '+(STORY.mentions[id]?STORY.mentions[id].t:id)); } }
function logSee(p,id,stage){ const cur=p.log[id]||0; if(stage<=cur) return;
  p.log[id]=stage; if(p.__live) saveP(); }
STORY.bindHelpers(award, logSee);
STORY.bindP(()=>P.names);

/* ---------------- run state ---------------- */
function newRun(){ return { node:STORY.START, feet:0, heat:0, kit:0, crew:3,
  nv:{hero:0,friend:0}, contrib:0, cooler:0, role:null, tun:'harry',
  streak:0, nell:0, num:0, fnum:0, flags:{} }; }
let S=null;
function saveRun(){ if(S) localStorage.setItem(K_R, JSON.stringify(S)); }
function clearRun(){ localStorage.removeItem(K_R); }
function loadRun(){ try{ return JSON.parse(localStorage.getItem(K_R)); }catch(e){ return null; } }

/* ---------------- text ---------------- */
function fmt(t){ let s=String(typeof t==='function'?t(S,P):t);
  return s.replace(/\{HERO\}/g,P.names.hero).replace(/\{FRIEND\}/g,P.names.friend); }

function show(id){ ['title-screen','game-screen','ending-screen','gallery']
  .forEach(s=>$(s).classList.toggle('hidden', s!==id));
  /* a11y: when the gallery overlay opens, move focus into it so keyboard
     and screen-reader users are placed on the panel, not left behind it */
  if(id==='gallery'){ const c=$('gallery-close'); if(c) setTimeout(()=>c.focus(),0); }
}

/* ---------------- options (B): size, reveal, contrast, cold ----------- */
function applyOpts(){
  document.body.classList.toggle('text-lg', P.opts.size==='large');
  document.body.classList.toggle('contrast', !!P.opts.contrast);
  document.body.classList.toggle('cold-hud', !!P.opts.cold);
  if(S && !P.opts.cold) {} /* turning cold ON mid-run doesn't grant; OFF revokes: */
  if(S && !P.opts.cold && S.flags) S.flags.coldRun=0;
}
function optionsPanel(){
  const o=P.opts;
  $('gallery-title').textContent='Options';
  $('gallery-body').innerHTML=`<div class="gallery-sub">Set the table to your liking. The telling is the telling either way.</div>
    <div class="opt-row"><span class="opt-name">text size</span>
      ${['normal','large'].map(v=>`<button class="opt-btn ${o.size===v?'on':''}" data-k="size" data-v="${v}">${v}</button>`).join('')}</div>
    <div class="opt-row"><span class="opt-name">the prose arrives</span>
      ${['instant','unfurl','type'].map(v=>`<button class="opt-btn ${o.reveal===v?'on':''}" data-k="reveal" data-v="${v}">${v==='type'?'typewriter':v}</button>`).join('')}</div>
    <div class="opt-row"><span class="opt-name">high contrast</span>
      ${['0','1'].map(v=>`<button class="opt-btn ${String(o.contrast)===v?'on':''}" data-k="contrast" data-v="${v}">${v==='1'?'on':'off'}</button>`).join('')}</div>
    <div class="opt-row"><span class="opt-name">cold telling</span>
      ${['0','1'].map(v=>`<button class="opt-btn ${String(o.cold)===v?'on':''}" data-k="cold" data-v="${v}">${v==='1'?'ledger hidden':'ledger shown'}</button>`).join('')}
      <div class="opt-note">He never saw the meters either. Tell Book One cold, start to finish, and it is Mentioned.</div></div>`;
  $('gallery-body').querySelectorAll('.opt-btn').forEach(b=>{
    b.onclick=()=>{ const k=b.dataset.k, v=b.dataset.v;
      P.opts[k]=(k==='contrast'||k==='cold')?+v:v; saveP(); applyOpts(); optionsPanel(); };
  });
  show('gallery');
}

/* ---------------- typewriter (B): HTML-safe, click completes ---------- */
let typeTimer=null, typeDone=null;
function typeInto(el, html){
  if(typeTimer){ clearInterval(typeTimer); typeTimer=null; if(typeDone) typeDone(); }
  const tokens=[]; let i=0;
  while(i<html.length){
    if(html[i]==='<'){ const j=html.indexOf('>',i); tokens.push(html.slice(i,j+1)); i=j+1; }
    else { tokens.push(html[i]); i++; }
  }
  let pos=0, out='';
  el.innerHTML='';
  typeDone=()=>{ el.innerHTML=html; if(typeTimer){clearInterval(typeTimer); typeTimer=null;} typeDone=null; };
  typeTimer=setInterval(()=>{
    let burst=3;
    while(burst-- && pos<tokens.length){ out+=tokens[pos++];
      while(pos<tokens.length && tokens[pos][0]==='<'){ out+=tokens[pos++]; } }
    el.innerHTML=out;
    if(pos>=tokens.length){ clearInterval(typeTimer); typeTimer=null; typeDone=null; }
  },16);
}
document.addEventListener('click',e=>{
  if(typeTimer && e.target.closest('#text-panel')) { if(typeDone) typeDone(); }
});

function toast(msg){ const t=document.createElement('div'); t.className='gg-toast';
  t.textContent=msg; document.body.appendChild(t);
  setTimeout(()=>t.classList.add('on'),20); setTimeout(()=>{t.classList.remove('on');
  setTimeout(()=>t.remove(),600);},3600); }

/* ---------------- the pure step (shared with the soak) ---------------- */
function applyChoice(s,p,c){
  if(c.heat!==undefined) s.heat=clamp(s.heat+c.heat,0,10);
  if(c.kit!==undefined)  s.kit=clamp(s.kit+c.kit,0,100);
  if(c.crew!==undefined) s.crew=clamp(s.crew+c.crew,0,6);
  if(c.feet!==undefined) s.feet=clamp(s.feet+c.feet,0,GOAL);
  if(c.fx) c.fx(s,p);
  const endId=typeof c.end==='function'?c.end(s,p):c.end;
  if(endId) return {end:endId};
  return {go: typeof c.go==='function'?c.go(s,p):c.go};
}

/* ---------------- juice: deltas + chapter stamps ---------------- */
let pendingDeltas=[], lastCh=0;
const DK={feet:'feet',heat:'heat',kit:'kit',crew:'the crew'};
function juice(reg){
  if(pendingDeltas.length){
    const host=$('hud');
    pendingDeltas.forEach((d,i)=>{
      const el=document.createElement('div');
      el.className='delta-float '+(d.good?'gain':'loss');
      el.textContent=(d.v>0?'+':'')+d.v+' '+d.k;
      el.style.animationDelay=(i*140)+'ms';
      host.appendChild(el);
      setTimeout(()=>el.remove(), 2300+i*140);
    });
    pendingDeltas=[];
  }
  if(reg.ch!==lastCh){
    lastCh=reg.ch;
    const st=$('day-stamp');
    st.textContent=STORY.CHAPTERS[reg.ch-1].toUpperCase();
    st.classList.remove('show'); void st.offsetWidth; st.classList.add('show');
    AUDIO.stamp();
    const pt=$('page-turn');
    if(pt){ pt.classList.remove('go'); void pt.offsetWidth; pt.classList.add('go'); }
  }
}

/* ---------------- scene painter: image first, SVG fallback ------------ */
function paintScene(el, key, seed){
  if (typeof IMAGES!=='undefined' && IMAGES.has(key)){
    const cur=el.querySelector('img.scene-img');
    if(cur && cur.dataset.key===key) return;
    const img=document.createElement('img');
    img.className='scene-img'; img.dataset.key=key; img.alt='';
    img.style.opacity='0';
    img.onerror=()=>ART.paint(el,key,seed);
    const reveal=()=>{ setTimeout(()=>{img.style.opacity='1';},30);
      // only the still-current image may clean house — stale timers must not delete newer scenes
      setTimeout(()=>{ if(el.lastElementChild===img)
        [...el.children].forEach(c=>{if(c!==img)c.remove();}); },1000); };
    img.onload=reveal; img.src=IMAGES.url(key); el.appendChild(img);
    if(img.complete&&img.naturalWidth>0) reveal();
  } else ART.paint(el, key, seed);
}

/* ---------------- title ---------------- */
function titleScreen(){
  show('title-screen');
  $('app').dataset.reg='elegy';
  paintScene($('title-art'),'title','r'+P.runs);
  AUDIO.setScene('title','elegy',0);
  $('btn-continue').classList.toggle('hidden', !loadRun());
  $('name-hero').value=P.names.hero; $('name-friend').value=P.names.friend;
  $('title-residue').innerHTML = P.runs
    ? `You have told it ${P.runs===1?'once':P.runs+' times'} now. It comes out different every time. That is not lying — that is the only way to tell all of it.`
      + (P.lastTitle?`<br>Last time it came out as <em>“${P.lastTitle}.”</em>`:'')
    : '';
  paintCompletion();
}

/* the three pillars → the Keeper. shows the completionist their path. */
function paintCompletion(){
  const el=$('title-completion'); if(!el) return;
  const e=P.endings||{};
  const bookOne = Object.keys(e).some(k=>!['e_horse','e_relay','e_keeper','e_pause'].includes(k));
  const pillars=[
    { on: bookOne,       lbl:'Book One — the tunnels' },
    { on: !!e.e_horse,   lbl:'Book Two — the horse' },
    { on: !!e.e_relay,   lbl:'Book Three — the relay' },
    { on: !!e.e_roll,    lbl:'the roll answered' },
  ];
  const done=pillars.every(p=>p.on), keeper=!!e.e_keeper;
  if(!P.runs){ el.innerHTML=''; return; }
  el.innerHTML=`<div class="comp-pillars" role="img" aria-label="Progress: ${pillars.filter(p=>p.on).length} of 4 toward the Keeper${keeper?', the Keeper told':''}">`
    + pillars.map(p=>`<span class="comp-dot ${p.on?'on':''}" title="${p.lbl}"></span>`).join('')
    + `</span></div>`
    + (keeper?`<div class="comp-note keeper">✦ The Keeper — the last page is read. The light does not go out.</div>`
       : done?`<div class="comp-note ready">All three books told, the roll answered. Sit down one more time; she has a last page for you.</div>`
       : `<div class="comp-note">${pillars.filter(p=>p.on).length} of four, on the way to the last page.</div>`);
}
function readNames(){
  const h=$('name-hero').value.trim(), f=$('name-friend').value.trim();
  P.names.hero=(h||'Kit').slice(0,18); P.names.friend=(f||'Freddie').slice(0,18); saveP();
}
$('btn-begin').onclick=()=>{ readNames(); S=newRun(); lastCh=0; pendingDeltas=[];
  S.flags.coldRun = P.opts.cold?1:0;
  show('game-screen'); render(S.node); };
$('btn-options').onclick=optionsPanel;
$('btn-continue').onclick=()=>{ const r=loadRun(); if(!r) return titleScreen();
  readNames(); S=r; lastCh=REGIONS[NODES[r.node].region].ch; pendingDeltas=[];
  show('game-screen'); render(S.node); };

/* ---------------- galleries ---------------- */
$('gallery-close').onclick=titleScreen;
$('btn-log').onclick=()=>{
  const seen=Object.keys(P.log).length;
  $('gallery-title').textContent='The Log';
  $('gallery-body').innerHTML=`<div class="gallery-sub">${seen} of ${Object.keys(STORY.cast).length} names entered. She is collecting his dead for him, and he is grateful and pretending not to be.</div>`
    +Object.entries(STORY.cast).map(([id,c])=>{
      const st=P.log[id]||0;
      const nm=typeof c.name==='function'?c.name():c.name;
      return st? `<div class="crew-entry"><img class="log-face" src="assets/cast/${id}.jpg" alt="" loading="lazy" onerror="this.remove()"><div class="crew-name">${nm}${st>=3?' <span class="log-fate">— his story is told</span>':''}</div>
        <div class="crew-role">${c.role}</div><div class="crew-note">${st>=2?c.note:'<em>You have met him. The rest of him is still to witness.</em>'}</div></div>`
      : `<div class="crew-entry locked"><div class="crew-name">— a name not yet entered —</div></div>`; }).join('');
  show('gallery');
};
$('btn-mentions').onclick=()=>{
  const ids=Object.keys(STORY.mentions), got=ids.filter(i=>P.mentions[i]).length;
  $('gallery-title').textContent='Mentions in Dispatches';
  $('gallery-body').innerHTML=`<div class="gallery-sub">${got} of ${ids.length} mentions earned. The registry grows as the telling does.</div>
    <div class="grid-cells">`+ids.map(i=>{ const m=STORY.mentions[i];
      return P.mentions[i]
        ? `<div class="cell k-got"><span class="ek">mentioned</span>${m.t}</div>`
        : `<div class="cell locked" title="${m.hint}">— ${m.hint} —</div>`; }).join('')+`</div>`;
  show('gallery');
};
$('btn-glossary').onclick=()=>{
  $('gallery-title').textContent='The Kriegie Glossary';
  $('gallery-body').innerHTML=`<div class="gallery-sub">The vocabulary of the place ran to jokes or nothing.</div>`
    +STORY.glossary.map(([w,d])=>`<div class="crew-entry"><div class="crew-name">${w}</div><div class="crew-note">${d}</div></div>`).join('');
  show('gallery');
};
$('btn-afterword').onclick=()=>{
  $('gallery-title').textContent='The Last Page';
  $('gallery-body').innerHTML=`<div class="afterword">${STORY.afterword}</div>`;
  show('gallery');
};
$('btn-tellings').onclick=()=>{
  const ids=Object.keys(ENDINGS).filter(i=>i!=='e_pause'||P.endings[i]);
  const journal=(P.journal||[]).slice().reverse();
  $('gallery-title').textContent='The Tellings';
  $('gallery-body').innerHTML=`<div class="gallery-sub">How it has come out so far. The real endings arrive as the telling reaches them.</div>
    <div class="grid-cells">`+ids.map(i=>{ const e=ENDINGS[i];
      return P.endings[i]
        ? `<div class="cell k-${e.kind}"><span class="ek">${e.kind==='pause'?'bookmark':e.kind}</span>${e.title}${P.endings[i]>1?` ×${P.endings[i]}`:''}</div>`
        : `<div class="cell locked">— untold —</div>`; }).join('')+`</div>`
    +(journal.length?`<div class="j-head">Her notebook</div>
      <div class="gallery-sub">She writes them down now. Click a title to give a telling its own name.</div>
      <div id="journal">`+journal.map(j=>{
        const idx=P.journal.indexOf(j);
        return `<div class="j-entry"><span class="j-n">№ ${j.n}</span>
          <span class="j-title" data-idx="${idx}" title="name this telling">${j.name?`“${j.name}”`:j.t}</span>
          ${j.name?`<span class="j-was">— it came out as ${j.t}</span>`:''}</div>`; }).join('')+`</div>`:'');
  $('gallery-body').querySelectorAll('.j-title').forEach(el=>{
    el.onclick=()=>{
      const idx=+el.dataset.idx, j=P.journal[idx]; if(!j) return;
      const inp=document.createElement('input');
      inp.className='j-input'; inp.maxLength=48; inp.value=j.name||'';
      inp.placeholder='the one where…';
      el.replaceWith(inp); inp.focus();
      const save=()=>{ const v=inp.value.trim(); if(v) j.name=v; else delete j.name;
        saveP(); $('btn-tellings').onclick(); };
      inp.onblur=save;
      inp.onkeydown=e=>{ if(e.key==='Enter') inp.blur(); if(e.key==='Escape'){ inp.value=j.name||''; inp.blur(); } };
    };
  });
  show('gallery');
};

/* ---------------- rail: the chapters ---------------- */
function paintRail(){
  const reg=REGIONS[NODES[S.node].region];
  let s=`<svg viewBox="0 0 42 500" preserveAspectRatio="xMidYMin meet">`;
  s+=`<text x="21" y="24" text-anchor="middle" font-size="8" fill="#8a8266" font-family="Courier New,monospace" letter-spacing="2">CH</text>`;
  STORY.CHAPTERS.forEach((c,i)=>{
    const y=48+i*48, on=i+1===reg.ch, done=i+1<reg.ch && reg.ch!==9;
    s+=`<circle cx="21" cy="${y}" r="${on?6:4}" fill="${on?'#8c2f24':done?'#8a8266':'none'}" stroke="${on?'#8c2f24':'#b3ab8f'}" stroke-width="1.4"/>`;
    if(i<STORY.CHAPTERS.length-1) s+=`<line x1="21" y1="${y+8}" x2="21" y2="${y+40}" stroke="#c9c1a4" stroke-width="1.2"/>`;
    if(on) s+=`<circle cx="21" cy="${y}" r="10" fill="none" stroke="#8c2f24" stroke-width="1" opacity=".4"><animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite"/></circle>`;
  });
  $('clock-rail').innerHTML=s+`</svg>`;
}

/* ---------------- HUD: the war ledger ---------------- */
const NVLBL=['steady','quiet','fevered'];
function tunnelSVG(){
  const w=300, gx=18, gw=w-2*gx;
  const george = S.tun==='george', horse = S.tun==='horse';
  const goal = horse ? 100 : GOAL;
  const px = george ? clamp(gx+S.feet*1.6, gx, gx+gw) : gx+gw*(S.feet/goal);
  let s=`<svg viewBox="0 0 ${w} 56" class="tun-svg" aria-label="the tunnel: ${S.feet}${george?' feet, no end mark':' of '+goal+' feet'}">`;
  s+=`<line x1="6" y1="18" x2="${w-6}" y2="18" stroke="#6d675a" stroke-width="2"/>`;      /* surface */
  for(let x=gx;x<w-6;x+=17) s+=`<line x1="${x}" y1="14" x2="${x}" y2="18" stroke="#8a8266" stroke-width="1"/>`; /* wire posts stylized */
  s+=`<rect x="8" y="8" width="14" height="10" fill="#6d675a"/>`;                          /* hut 104 / the theater */
  s+=`<path d="M6 8 L15 2 L24 8 Z" fill="#4c463a"/>`;
  s+=`<line x1="15" y1="18" x2="15" y2="40" stroke="#4c463a" stroke-width="3"/>`;          /* shaft */
  s+=`<line x1="15" y1="40" x2="${px}" y2="40" stroke="#8c6f1d" stroke-width="4" stroke-linecap="round"/>`; /* the bore */
  if(!george){
    s+=`<line x1="${px}" y1="40" x2="${gx+gw}" y2="40" stroke="#c9c1a4" stroke-width="1.4" stroke-dasharray="3 4"/>`;
    s+=`<path d="M${w-16} 18 L${w-10} 6 L${w-4} 18 Z" fill="#3c4c38"/>`;                  /* the trees */
    s+=`<path d="M${w-26} 18 L${w-21} 9 L${w-16} 18 Z" fill="#3c4c38" opacity=".8"/>`;
    s+=`<text x="${w-6}" y="52" text-anchor="end" font-size="9" font-family="Courier New,monospace" fill="#8a8266">of ${goal}${horse?' — from the horse':''}</text>`;
  } else {
    s+=`<text x="${w-6}" y="52" text-anchor="end" font-size="9" font-family="Courier New,monospace" fill="#8a8266">GEORGE — no end mark</text>`;
  }
  s+=`<text x="${clamp(px,30,w-96)}" y="52" font-size="10" font-family="Courier New,monospace" fill="#5a4a10" font-weight="bold">${S.feet} ft</text>`;
  return s+`</svg>`;
}
function paintHUD(){
  let h='<div class="hud-panel">';
  if(S.flags.tunnelRevealed) h+=`<div class="hud-tunnel" title="The ledger the whole compound is secretly farming: feet dug.">${tunnelSVG()}</div>`;
  h+=`<div class="hud-row">`;
  h+=`<div class="meter heatm" title="The ferrets' interest. It is managed, never zeroed.">
        <span class="m-name">heat</span><div class="m-dots">${Array.from({length:10},(_,i)=>
        `<i class="${i<S.heat?'on':''}"></i>`).join('')}</div></div>`;
  h+=`<div class="meter crewm" title="The crew: you and ${P.names.friend}. All that is left of G-George.">
        <span class="m-name">the crew</span><div class="m-segs">${Array.from({length:6},(_,i)=>
        `<i class="${i<S.crew?'on':''}"></i>`).join('')}</div></div>`;
  if(S.role) h+=`<div class="meter kitm" title="Escape readiness: papers, clothes, compass, maps, German, cover story.">
        <span class="m-name">kit</span><span class="m-val">${S.kit}%</span></div>`;
  h+=`<div class="meter nervem" title="The men's weather. A fevered man left alone drifts toward the wire.">
        <span class="m-name">nerve</span><span class="nv ${'nv'+S.nv.hero}">you: ${NVLBL[S.nv.hero]}</span>
        <span class="nv ${'nv'+S.nv.friend}">${P.names.friend.toLowerCase()}: ${NVLBL[S.nv.friend]}</span></div>`;
  if(S.chain && S.chain.length) h+=`<div class="meter chainm" title="The relay: the hands that have passed him so far. ${S.chain.join(' → ')}">
        <span class="m-name">the chain</span><span class="m-val">${S.chain.length} hands</span></div>`;
  h+=`</div></div>`;
  $('hud').innerHTML=h;
}

/* ---------------- render ---------------- */
function render(nodeId){
  const n=NODES[nodeId];
  if(!n){ console.error('missing node',nodeId); return titleScreen(); }
  S.node=nodeId;
  const reg=REGIONS[n.region];
  $('app').dataset.reg=n.reg||'ache';
  paintScene($('scene-art'), reg.art, nodeId+P.runs);
  AUDIO.setScene(n.region, n.reg, reg.ch);
  paintRail(); paintHUD(); juice(reg);
  $('region-name').textContent=reg.name;
  $('node-title').textContent=fmt(n.title);
  const paras=fmt(n.text).split('\n\n');
  if(P.opts.reveal==='type'){
    typeInto($('node-text'), paras.map(p=>`<p>${p}</p>`).join(''));
  } else if(P.opts.reveal==='instant'){
    $('node-text').innerHTML=paras.map(p=>`<p>${p}</p>`).join('');
  } else {
    $('node-text').innerHTML=paras.map((p,i)=>`<p class="unfurl" style="animation-delay:${Math.min(i*170,900)}ms">${p}</p>`).join('');
  }
  const box=$('choices'); box.innerHTML='';
  let idx=0;
  n.choices.forEach(c=>{
    if(c.req && !c.req(S,P)) return;
    const b=document.createElement('button'); b.className='choice';
    idx++;
    b.setAttribute('aria-label', `Choice ${idx}: ${fmt(c.t).replace(/<[^>]+>/g,'')}`);
    b.innerHTML=(c.pre?`<span class="c-pre">${c.pre}</span>`:'')+fmt(c.t);
    b.onclick=()=>choose(c);
    box.appendChild(b);
  });
  $('text-panel').scrollTop=0;
  /* a11y: move focus to the fresh passage so screen readers announce it and
     keyboard users land in the new node, not on the last button they clicked */
  const nt=$('node-title'); if(nt){ nt.setAttribute('tabindex','-1'); nt.focus({preventScroll:true}); }
  saveRun();
}

function choose(c){
  const before={feet:S.feet,heat:S.heat,kit:S.kit,crew:S.crew};
  const r=applyChoice(S,P,c);
  [['feet',true],['kit',true],['crew',true],['heat',false]].forEach(([k,goodUp])=>{
    const d=S[k]-before[k]; if(d) pendingDeltas.push({k:DK[k],v:d,good:goodUp?d>0:d<0});
  });
  if(r.end) return ending(r.end);
  if(r.go) render(r.go);
  else titleScreen();
}

/* ---------------- endings ---------------- */
function ending(id){
  const e=ENDINGS[id];
  if(!e){ console.error('missing ending',id); return titleScreen(); }
  $('choices').innerHTML=''; /* stale buttons must not re-fire the ending (double-click guard) */
  P.runs++; P.endings[id]=(P.endings[id]||0)+1;
  P.lastTitle=fmt(e.title);
  P.journal=P.journal||[];
  P.journal.push({ e:id, n:P.runs, t:fmt(e.title) });
  if(P.journal.length>60) P.journal.shift();
  if(S && S.flags.coldRun && P.opts.cold && !['e_horse','e_relay','e_pause','e_roll'].includes(id))
    award(P,'cold');
  lastEnd={ id, art:e.art, title:fmt(e.title), kind:e.kind, n:P.runs+0 };
  saveP(); clearRun();
  AUDIO.setScene('ending','elegy',9);
  AUDIO.sting(e.kind);
  $('app').dataset.reg='elegy';
  paintScene($('ending-art'), e.art, id+P.runs);
  $('ending-kind').textContent = e.kind==='pause'?'a bookmark, not an ending':e.kind;
  $('ending-kind').className='k-'+e.kind;
  $('ending-title').textContent=fmt(e.title);
  $('ending-text').innerHTML=fmt(e.text).split('\n\n').map(p=>`<p>${p}</p>`).join('');
  $('ending-meta').textContent = S && S.flags.tunnelRevealed ? `${S.feet} feet on the ledger` : '';
  $('ending-her').innerHTML = STORY.her[id] ? fmt(STORY.her[id]) : '';
  $('ending-caption').textContent = `Telling № ${P.runs} — pasted into her notebook`;
  $('btn-lastpage').classList.toggle('urgent', id==='e_roll');
  show('ending-screen');
}
let lastEnd=null;

/* ---------------- share cards (D): Keep This Page ---------------- */
$('btn-keep').onclick=()=>{
  if(!lastEnd) return;
  const cv=document.createElement('canvas'); cv.width=1200; cv.height=630;
  const c=cv.getContext('2d');
  const finish=()=>{
    /* airmail border */
    for(let i=0,x=0;x<1200;i++,x+=44){ c.fillStyle=i%2?'#33507a':'#8c2f24'; c.fillRect(x,0,30,10); c.fillRect(1200-x-30,620,30,10); }
    c.fillStyle='#efe6cf'; c.fillRect(0,400,1200,220);
    c.fillStyle='#8a8266'; c.font='16px Courier New'; c.textAlign='left';
    c.fillText('G FOR GEORGE — THE TUNNELS OF STALAG LUFT III', 48, 448);
    c.fillStyle='#2c2a22'; c.font='bold 52px Courier New';
    c.fillText(lastEnd.title, 44, 510);
    c.fillStyle='#5a5340'; c.font='italic 22px Georgia';
    c.fillText(`Telling № ${lastEnd.n} · ${lastEnd.kind==='pause'?'a bookmark':lastEnd.kind} · one of 14 tellings`, 48, 552);
    c.fillStyle='#8a8266'; c.font='16px Courier New';
    c.fillText('kylefriesmarketing.github.io/george — part of THE SHELF', 48, 592);
    const a=document.createElement('a');
    a.download=`george-telling-${lastEnd.n}.png`;
    a.href=cv.toDataURL('image/png');
    document.body.appendChild(a); a.click(); a.remove();
    toast('THE PAGE IS KEPT — saved to your downloads');
  };
  c.fillStyle='#efe6cf'; c.fillRect(0,0,1200,630);
  if(typeof IMAGES!=='undefined' && IMAGES.has(lastEnd.art)){
    const img=new Image();
    img.onload=()=>{ const iw=img.width, ih=img.height, s=Math.max(1200/iw, 400/ih);
      c.drawImage(img,(1200-iw*s)/2,(400-ih*s)/2,iw*s,ih*s);
      const gr=c.createLinearGradient(0,260,0,400); gr.addColorStop(0,'rgba(20,16,10,0)'); gr.addColorStop(1,'rgba(20,16,10,.45)');
      c.fillStyle=gr; c.fillRect(0,260,1200,140); finish(); };
    img.onerror=finish;
    img.src=IMAGES.url(lastEnd.art);
  } else finish();
};
$('btn-again').onclick=titleScreen;
$('btn-lastpage').onclick=()=>{
  $('gallery-title').textContent='The Last Page';
  $('gallery-body').innerHTML=`<div class="afterword">${STORY.afterword}</div>`;
  $('gallery').classList.remove('hidden');
};

/* ---------------- debug (~) & keys ---------------- */
document.addEventListener('keydown',e=>{
  const inField=e.target&&e.target.matches&&e.target.matches('input,select,textarea');
  /* Escape closes the gallery overlay from anywhere */
  if(e.key==='Escape' && !$('gallery').classList.contains('hidden')){
    return $('gallery-close').click();
  }
  if(!inField){
    if(!$('gallery').classList.contains('hidden')) return; /* overlay owns keys while open */
    if(!$('game-screen').classList.contains('hidden') && /^[1-9]$/.test(e.key)){
      const b=[...document.querySelectorAll('#choices .choice')][+e.key-1];
      if(b){ b.focus(); b.click(); return; }
    } else if(!$('ending-screen').classList.contains('hidden') && e.key==='Enter'){
      return $('btn-again').click();
    }
    if(e.key==='m') AUDIO.toggleMute();
  }
  if(e.key==='`'||e.key==='~'){
    const d=$('debug-panel'); d.classList.toggle('hidden');
    if(d.classList.contains('hidden')) return;
    d.innerHTML=`<b>~ the lantern</b>
      <div class="dbg-row">node <select id="dbg-node">${Object.keys(NODES).map(k=>`<option ${S&&S.node===k?'selected':''}>${k}</option>`).join('')}</select>
      <button id="dbg-go">go</button></div>
      <div class="dbg-row">feet <input id="dbg-feet" size="3" value="${S?S.feet:0}">
      heat <input id="dbg-heat" size="2" value="${S?S.heat:0}">
      kit <input id="dbg-kit" size="3" value="${S?S.kit:0}">
      crew <input id="dbg-crew" size="1" value="${S?S.crew:3}">
      <button id="dbg-apply">apply</button></div>
      <div class="dbg-row"><button id="dbg-soak">soak 200</button> <span id="dbg-out"></span></div>`;
    $('dbg-go').onclick=()=>{ if(!S){S=newRun();show('game-screen');} render($('dbg-node').value); };
    $('dbg-apply').onclick=()=>{ if(!S)return;
      S.feet=clamp(+$('dbg-feet').value||0,0,GOAL); S.heat=clamp(+$('dbg-heat').value||0,0,10);
      S.kit=clamp(+$('dbg-kit').value||0,0,100); S.crew=clamp(+$('dbg-crew').value||0,0,6);
      render(S.node); };
    $('dbg-soak').onclick=()=>{ const r=window.__ggSoak(200);
      $('dbg-out').textContent=r.ok?`ok — ${r.runs} runs, ${Object.keys(r.endings).length} endings`:'PROBLEMS — see console'; };
  }
});

/* ---------------- the soak: __ggSoak(n, seed) ---------------- */
window.__ggSoak = function(n=200, seed=1944){
  let s=seed>>>0||1; const rand=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
  const out={ runs:n, endings:{}, deadEnds:[], missing:[], maxStepsHit:0, errors:[], ok:false };
  /* static pass: every string go/end must resolve */
  for(const [id,node] of Object.entries(NODES)){
    if(!node.choices||!node.choices.length){ out.deadEnds.push(id+' (no choices)'); continue; }
    node.choices.forEach((c,i)=>{
      if(typeof c.go==='string' && !NODES[c.go]) out.missing.push(`${id}[${i}] -> node ${c.go}`);
      if(typeof c.end==='string' && !ENDINGS[c.end]) out.missing.push(`${id}[${i}] -> ending ${c.end}`);
      if(c.go===undefined && c.end===undefined) out.missing.push(`${id}[${i}] has neither go nor end`);
    });
  }
  /* dynamic pass: n random walks on throwaway state */
  for(let run=0;run<n;run++){
    const sS=newRun();
    const sP=defP(); /* throwaway — no __live, so no toasts, no saves */
    if(run%2) sP.runs=1; /* half the walks are retellings, so Book Two gets soaked */
    if(run%4===3){ sP.runs=2; sP.endings={e_horse:1}; } /* and a quarter have told the horse, so Book Three gets soaked */
    let node=sS.node, steps=0, done=false;
    try{
      while(steps++<200){
        const nd=NODES[node]; if(!nd){ out.missing.push('walk hit missing node '+node); break; }
        if(typeof nd.text==='function') nd.text(sS,sP); /* text fns must not crash (and may lazy-init) */
        if(typeof nd.title==='function') nd.title(sS,sP);
        const opts=nd.choices.filter(c=>!c.req||c.req(sS,sP));
        if(!opts.length){ out.deadEnds.push(node+' (all choices gated)'); break; }
        const c=opts[Math.floor(rand()*opts.length)];
        const r=applyChoice(sS,sP,c);
        if(r.end){ if(!ENDINGS[r.end]){ out.missing.push('walk hit missing ending '+r.end); }
          else out.endings[r.end]=(out.endings[r.end]||0)+1; done=true; break; }
        if(!r.go){ out.deadEnds.push(node+' (choice led nowhere)'); break; }
        node=r.go;
      }
      if(!done && steps>=200) out.maxStepsHit++;
    }catch(err){ out.errors.push(node+': '+err.message); }
  }
  out.deadEnds=[...new Set(out.deadEnds)]; out.missing=[...new Set(out.missing)];
  out.ok = !out.deadEnds.length && !out.missing.length && !out.errors.length && !out.maxStepsHit;
  return out;
};

applyOpts();
titleScreen();
})();
