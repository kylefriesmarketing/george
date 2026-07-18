/* =====================================================================
   G FOR GEORGE — audio.js
   All-synth leitmotifs (no files, all melodies original):
   - register pads: lark (warm air), ache (a music box that detunes as
     the war grinds on), dread (earth drone + slow pulse), elegy (amber)
   - George's theme: the crew's four-bar whistled tune
   - the appell snare on chapter stamps
   - THE SILENCE: region 'list' stops everything. The loudest thing this
     engine does is nothing.
   ===================================================================== */
const AUDIO = (() => {
  let ctx=null, master=null, padNodes=[], padReg=null, silence=false, themeTimer=null;
  let muted = localStorage.getItem('gg_mute') === '1';
  let detune = 0; /* grows with chapters — the music box going out of true */

  function boot(){
    if(ctx) return true;
    try{
      ctx=new (window.AudioContext||window.webkitAudioContext)();
      master=ctx.createGain(); master.gain.value=muted?0:0.5; master.connect(ctx.destination);
    }catch(e){ return false; }
    return true;
  }
  document.addEventListener('pointerdown',()=>{ if(boot()&&ctx.state==='suspended') ctx.resume(); },{passive:true});
  document.addEventListener('keydown',()=>{ if(boot()&&ctx.state==='suspended') ctx.resume(); });

  function killPad(){ padNodes.forEach(n=>{ try{ n.g.gain.setTargetAtTime(0,ctx.currentTime,.6);
    setTimeout(()=>{try{n.o.stop();}catch(e){}},2500); }catch(e){} }); padNodes=[]; padReg=null;
    if(themeTimer){ clearInterval(themeTimer); themeTimer=null; } }

  function osc(freq,type,gain,det){ const o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type; o.frequency.value=freq; if(det) o.detune.value=det;
    g.gain.value=0; o.connect(g); g.connect(master); o.start();
    g.gain.setTargetAtTime(gain,ctx.currentTime,1.8);
    padNodes.push({o,g}); return {o,g}; }

  function blip(freq,t0,dur,gain,type='triangle',det=0){ const o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type; o.frequency.value=freq; o.detune.value=det;
    o.connect(g); g.connect(master);
    g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(gain,t0+.02);
    g.gain.setTargetAtTime(0,t0+dur*.65,dur*.22);
    o.start(t0); o.stop(t0+dur+1); }

  /* George's theme — four bars, whistled register. Original melody. */
  const THEME=[ [329.6,.5],[392,.5],[440,1],[523.3,1.5],[440,.5],[392,1],[329.6,1.5],
                [293.7,.5],[329.6,.5],[392,1],[440,1.5],[329.6,.5],[293.7,1],[261.6,2] ];
  function playTheme(vol=.16, rate=1){ if(!ctx||silence) return;
    let t=ctx.currentTime+.1;
    THEME.forEach(([f,d])=>{ blip(f,t,d*.42/rate,vol,'triangle',detune*.5); t+=d*.45/rate; }); }

  function snare(t0,gain=.25){ const len=.09, buf=ctx.createBuffer(1,ctx.sampleRate*len,ctx.sampleRate);
    const d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length);
    const src=ctx.createBufferSource(); src.buffer=buf;
    const g=ctx.createGain(); g.gain.value=gain;
    const f=ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=1800; f.Q.value=.8;
    src.connect(f); f.connect(g); g.connect(master); src.start(t0); }

  function pad(reg){
    if(!ctx||padReg===reg||silence) return;
    killPad(); padReg=reg;
    if(reg==='lark'){ osc(220,'sine',.05); osc(277.2,'sine',.035,detune); osc(110,'sine',.045);
      themeTimer=setInterval(()=>{ if(!silence&&Math.random()<.30) playTheme(.05,1.3); },26000); }
    else if(reg==='ache'){ osc(110,'sine',.05);
      const notes=[440,523.3,659.3,523.3,392,440]; let i=0;
      themeTimer=setInterval(()=>{ if(silence||!ctx) return;
        blip(notes[i%notes.length],ctx.currentTime+.05,1.6,.05,'sine',detune); i++; },3400); }
    else if(reg==='dread'){ const d=osc(55,'sine',.09); osc(58,'sine',.05);
      const lfo=ctx.createOscillator(), lg=ctx.createGain();
      lfo.frequency.value=.85; lg.gain.value=.04; lfo.connect(lg); lg.connect(d.g.gain); lfo.start();
      padNodes.push({o:lfo,g:lg}); }
    else { /* elegy */ osc(110,'sine',.06); osc(164.8,'sine',.04); osc(220,'sine',.02,detune*.4); }
  }

  return {
    setScene(regionId, reg, ch){
      if(!boot()) return;
      detune=Math.min(28,(ch||0)*3.5);
      const wantSilence = regionId==='list';
      if(wantSilence && !silence){ silence=true; killPad(); return; }
      if(!wantSilence && silence){ silence=false; }
      if(!silence) pad(reg||'ache');
      if(regionId==='title'){ pad('elegy'); playTheme(.11,1); }
    },
    stamp(){ if(!boot()||silence||!ctx) return; const t=ctx.currentTime;
      snare(t+.02,.18); snare(t+.16,.12); },
    sting(kind){ if(!boot()||!ctx) return;
      if(kind==='true'||kind==='home'){ silence=false; playTheme(.2,.9); }
      else if(kind==='dark'){ blip(98,ctx.currentTime+.05,2.4,.12,'sine'); blip(103.8,ctx.currentTime+.05,2.4,.09,'sine'); }
      else if(kind==='survive'){ blip(220,ctx.currentTime+.05,1.6,.1,'sine'); blip(277.2,ctx.currentTime+.35,1.6,.09,'sine'); blip(329.6,ctx.currentTime+.65,2,.09,'sine'); }
      else { blip(329.6,ctx.currentTime+.05,1.2,.08,'sine'); } },
    toggleMute(){ muted=!muted; localStorage.setItem('gg_mute',muted?'1':'0');
      if(master) master.gain.setTargetAtTime(muted?0:0.5, ctx.currentTime,.1); return muted; },
    get muted(){ return muted; },
  };
})();
