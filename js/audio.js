/* =====================================================================
   G FOR GEORGE — audio.js (v2)
   All-synth leitmotifs and ambience, no files, all melodies original.
   - registers: lark (warm air + camp life), ache (a REAL music box that
     detunes as the war grinds), dread (earth + pulse + creaks), elegy
     (amber pad + club room-tone)
   - ambience by place: camp wind, tunnel earth, club hush, harbor rumble
   - themes: George's whistled tune (Book One), a music-hall lilt (Book
     Two), and THE RELAY — one phrase passed instrument to instrument,
     never finished by the voice that started it (Book Three)
   - THE SILENCE: region 'list' stops everything. Still the loudest thing
     this engine does.
   ===================================================================== */
const AUDIO = (() => {
  let ctx=null, master=null, nodes=[], timers=[], sceneKey=null, silence=false;
  let muted = localStorage.getItem('gg_mute') === '1';
  let detune = 0;

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

  function stopAll(){
    nodes.forEach(n=>{ try{ n.g.gain.setTargetAtTime(0,ctx.currentTime,.7);
      setTimeout(()=>{try{n.o.stop();}catch(e){}},3000); }catch(e){} });
    nodes=[]; timers.forEach(clearInterval); timers=[]; sceneKey=null;
  }
  function keep(o,g){ nodes.push({o,g}); }
  function every(ms,fn){ timers.push(setInterval(fn,ms)); }

  function osc(freq,type,gain,det=0,attack=1.6){ const o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type; o.frequency.value=freq; o.detune.value=det;
    g.gain.value=0; o.connect(g); g.connect(master); o.start();
    g.gain.setTargetAtTime(gain,ctx.currentTime,attack); keep(o,g); return {o,g}; }

  function blip(freq,t0,dur,gain,type='triangle',det=0,dest=master){ const o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type; o.frequency.value=freq; o.detune.value=det;
    o.connect(g); g.connect(dest);
    g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(gain,t0+.015);
    g.gain.setTargetAtTime(0,t0+dur*.6,dur*.25);
    o.start(t0); o.stop(t0+dur+1.2); }

  /* music-box voice: fundamental + bright partial, fast decay */
  function box(freq,t0,gain){ blip(freq,t0,1.7,gain,'sine',detune);
    blip(freq*4,t0,0.5,gain*.28,'sine',detune*1.4); }

  function noiseSrc(len){ const buf=ctx.createBuffer(1,ctx.sampleRate*len,ctx.sampleRate);
    const d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    const src=ctx.createBufferSource(); src.buffer=buf; src.loop=true; return src; }

  function windLayer(gain){ const src=noiseSrc(2.7);
    const f=ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=420; f.Q.value=.55;
    const g=ctx.createGain(); g.gain.value=0;
    const lfo=ctx.createOscillator(), lg=ctx.createGain();
    lfo.frequency.value=.09; lg.gain.value=gain*.55; lfo.connect(lg); lg.connect(g.gain); lfo.start();
    src.connect(f); f.connect(g); g.connect(master); src.start();
    g.gain.setTargetAtTime(gain,ctx.currentTime,2.2);
    keep(src,g); keep(lfo,lg); }

  function rumbleLayer(gain,freq=90){ const src=noiseSrc(1.9);
    const f=ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=freq;
    const g=ctx.createGain(); g.gain.value=0;
    src.connect(f); f.connect(g); g.connect(master); src.start();
    g.gain.setTargetAtTime(gain,ctx.currentTime,2.5); keep(src,g); }

  function creak(t0,gain=.06){ const o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sawtooth'; o.frequency.setValueAtTime(70+Math.random()*40,t0);
    o.frequency.exponentialRampToValueAtTime(45,t0+.28);
    const f=ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=260;
    o.connect(f); f.connect(g); g.connect(master);
    g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(gain,t0+.05);
    g.gain.setTargetAtTime(0,t0+.2,.1); o.start(t0); o.stop(t0+1); }

  function snare(t0,gain=.22,freq=1800){ const len=.09, buf=ctx.createBuffer(1,ctx.sampleRate*len,ctx.sampleRate);
    const d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length);
    const src=ctx.createBufferSource(); src.buffer=buf;
    const g=ctx.createGain(); g.gain.value=gain;
    const f=ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=freq; f.Q.value=.8;
    src.connect(f); f.connect(g); g.connect(master); src.start(t0); }

  /* ---- THEMES (all original) ---- */
  const GEORGE=[[329.6,.5],[392,.5],[440,1],[523.3,1.5],[440,.5],[392,1],[329.6,1.5],
                [293.7,.5],[329.6,.5],[392,1],[440,1.5],[329.6,.5],[293.7,1],[261.6,2]];
  function playGeorge(vol=.15,rate=1){ if(!ctx||silence) return; let t=ctx.currentTime+.1;
    GEORGE.forEach(([f,d])=>{ blip(f,t,d*.42/rate,vol,'triangle',detune*.5); t+=d*.45/rate; }); }

  /* the ache music box — a small home lullaby, going out of true */
  const LULLABY=[523.3,659.3,783.99,659.3,523.3,587.3,659.3,440, 523.3,659.3,880,783.99,659.3,587.3,523.3,0];
  function playBoxPhrase(vol=.06){ if(!ctx||silence) return; let t=ctx.currentTime+.05;
    LULLABY.forEach(f=>{ if(f) box(f,t,vol); t+=.42; }); }

  /* the horse — a music-hall lilt in 6/8 */
  const LILT=[[392,.33],[440,.33],[493.9,.33],[523.3,.66],[493.9,.33],[440,.66],[392,.33],
              [349.2,.33],[392,.33],[440,.33],[392,.66],[329.6,.33],[392,1]];
  function playLilt(vol=.09){ if(!ctx||silence) return; let t=ctx.currentTime+.05;
    LILT.forEach(([f,d])=>{ blip(f,t,d*.5,vol,'square'); blip(f/2,t,d*.5,vol*.4,'sine'); t+=d*.52; }); }

  /* THE RELAY — one phrase in four hands; each voice starts where the
     last let go; the voice that begins it never gets to finish it */
  const RELAY=[
    { type:'sine',     seg:[[440,.7],[493.9,.7],[523.3,1.05]] },
    { type:'triangle', seg:[[523.3,.7],[587.3,.7],[659.3,1.05]] },
    { type:'square',   seg:[[659.3,.7],[587.3,.7],[698.5,1.05]] },
    { type:'sawtooth', seg:[[698.5,.7],[783.99,.7],[880,1.75]] },
  ];
  function playRelay(vol=.08){ if(!ctx||silence) return; let t=ctx.currentTime+.1;
    RELAY.forEach((hand,h)=>{ hand.seg.forEach(([f,d],i)=>{
      const soft = hand.type==='square'||hand.type==='sawtooth';
      const g = soft?vol*.55:vol;
      blip(f,t,d*.8,g,hand.type,detune*.3);
      if(soft) blip(f/2,t,d*.8,g*.5,'sine');
      t+=d*.82; }); t+=.12; /* the small silence of the handover */ });
  }

  /* ---- ambience selection ---- */
  const CAMP=new Set(['gate','compound','trade','winter','order','scheme','night','hole','sand','horse','marchw','walk','silk','pyrenees']);
  const EARTH=new Set(['tunnel','inhorse','garden']);
  const CLUB=new Set(['club','ending','title']);
  const TOWN=new Set(['station','docks','canal','safehouse','dulag','cooler','hut104','theater','agency','lottery','vault','home']);

  function scene(regionId, reg, ch){
    if(sceneKey===regionId+'|'+reg) return;
    stopAll(); sceneKey=regionId+'|'+reg;
    if(silence) return;
    /* base pad by register */
    if(reg==='lark'){ osc(220,'sine',.045); osc(277.2,'sine',.03,detune); osc(110,'sine',.04);
      every(24000,()=>{ if(silence) return; const r=Math.random();
        if(regionId==='horse'||regionId==='inhorse'){ if(r<.4) playLilt(.06); }
        else if(r<.28) playGeorge(.045,1.3); }); }
    else if(reg==='ache'){ osc(110,'sine',.045);
      every(9000,()=>{ if(!silence && Math.random()<.75) playBoxPhrase(.05); });
      setTimeout(()=>{ if(!silence && sceneKey===regionId+'|'+reg) playBoxPhrase(.05); },800); }
    else if(reg==='dread'){ const d=osc(55,'sine',.085); osc(58.3,'sine',.05);
      const lfo=ctx.createOscillator(), lg=ctx.createGain();
      lfo.frequency.value=.8; lg.gain.value=.038; lfo.connect(lg); lg.connect(d.g.gain); lfo.start(); keep(lfo,lg);
      if(EARTH.has(regionId)) every(7000,()=>{ if(!silence && Math.random()<.6) creak(ctx.currentTime+Math.random()*2); });
      if(CAMP.has(regionId)&&(regionId==='night'||regionId==='hole')) every(30000,()=>{});
      if(['canal','safehouse','pyrenees'].includes(regionId))
        every(26000,()=>{ if(!silence && Math.random()<.5) playRelay(.055); }); }
    else { /* elegy */ osc(110,'sine',.055); osc(164.8,'sine',.038); osc(220,'sine',.018,detune*.4);
      if(CLUB.has(regionId)){ rumbleLayer(.012,140);
        every(19000,()=>{ if(!silence && Math.random()<.3) blip(2093,ctx.currentTime+.05,.4,.02,'sine'); }); }
      if(['canal','safehouse','pyrenees','list','vault'].includes(regionId)===false && regionId==='home') windLayer(.02); }
    /* place layers */
    if(CAMP.has(regionId)) windLayer(reg==='dread'?.028:.035);
    if(EARTH.has(regionId)) rumbleLayer(.03,70);
    if(TOWN.has(regionId)&&(regionId==='docks'||regionId==='station'||regionId==='canal')) rumbleLayer(.02,110);
    if(regionId==='title'){ playGeorge(.1,1); }
  }

  return {
    setScene(regionId, reg, ch){
      if(!boot()) return;
      detune=Math.min(30,(ch||0)*3.6);
      const wantSilence = regionId==='list';
      if(wantSilence && !silence){ silence=true; stopAll(); sceneKey='SILENCE'; return; }
      if(!wantSilence && silence){ silence=false; sceneKey=null; }
      scene(regionId, reg||'ache', ch);
    },
    stamp(){ if(!boot()||silence||!ctx) return; const t=ctx.currentTime;
      snare(t+.02,.16); snare(t+.17,.1); },
    sting(kind){ if(!boot()||!ctx) return;
      if(kind==='true'){ silence=false; playGeorge(.2,.85); }
      else if(kind==='home'){ silence=false;
        if(sceneKey&&sceneKey.startsWith('SIL')) sceneKey=null;
        playRelay(.1); setTimeout(()=>playGeorge(.13,1),4200); }
      else if(kind==='dark'){ blip(98,ctx.currentTime+.05,2.6,.11,'sine'); blip(103.8,ctx.currentTime+.05,2.6,.085,'sine');
        blip(49,ctx.currentTime+.4,3,.07,'sine'); }
      else if(kind==='survive'){ blip(220,ctx.currentTime+.05,1.6,.09,'sine'); blip(277.2,ctx.currentTime+.35,1.6,.085,'sine');
        blip(329.6,ctx.currentTime+.65,2.2,.085,'sine'); blip(440,ctx.currentTime+1.05,2.6,.05,'sine'); }
      else { blip(329.6,ctx.currentTime+.05,1.2,.07,'sine'); } },
    toggleMute(){ muted=!muted; localStorage.setItem('gg_mute',muted?'1':'0');
      if(master&&ctx) master.gain.setTargetAtTime(muted?0:0.5, ctx.currentTime,.1); return muted; },
    get muted(){ return muted; },
  };
})();
