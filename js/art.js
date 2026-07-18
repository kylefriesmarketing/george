/* =====================================================================
   G FOR GEORGE — art.js
   Procedural scene painter: "gouache on airmail paper". Every scene is
   an SVG built from soft layered shapes + a seeded wobble, so the game
   is fully illustrated before (and beneath) the M4 art pass.
   Palette law (BIBLE §10): RAF blue-grey / pine / grey topsoil / cream;
   amber = memory & home ONLY; yellow = the sand, i.e. danger.
   ===================================================================== */
const ART = (() => {

function rng(seed){ let s=0; String(seed).split('').forEach(c=>s=(s*31+c.charCodeAt(0))>>>0);
  s=s||1; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }

const P = {
  paper:'#efe6cf', ink:'#2c2a22', raf:'#5a6b7d', rafd:'#3d4a58', pine:'#3c4c38',
  pined:'#2b382a', soil:'#8d8676', soild:'#6d675a', sand:'#d9b13b', sandd:'#c29a25',
  amber:'#d8a24a', amberd:'#a8742b', night:'#1d2430', nightd:'#12161f',
  fire:'#d96e2b', smoke:'#4a4640', snow:'#e8e4d6', wire:'#333a40',
};

/* helpers ------------------------------------------------------------ */
const E=(x,y,rx,ry,f,o=1)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" opacity="${o}"/>`;
const R=(x,y,w,h,f,o=1,rot=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" opacity="${o}"${rot?` transform="rotate(${rot} ${x+w/2} ${y+h/2})"`:''}/>`;
const L=(x1,y1,x2,y2,s,w,o=1)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${s}" stroke-width="${w}" opacity="${o}" stroke-linecap="round"/>`;

function wash(r,c1,c2){ /* sky/base wash with brush bands */
  let s=R(0,0,320,180,c1);
  for(let i=0;i<7;i++) s+=R(0,i*26+r()*8,320,20+r()*14,c2,.06+r()*.08);
  return s;
}
function pines(r,y,c,n=14){ let s='';
  for(let i=0;i<n;i++){ const x=8+i*(320/n)+r()*8, h=16+r()*18;
    s+=`<path d="M${x} ${y} L${x-6-r()*3} ${y+h} L${x+6+r()*3} ${y+h} Z" fill="${c}" opacity="${.75+r()*.25}"/>`
      + L(x,y+h,x,y+h+4,c,1.6,.8); }
  return s; }
function fence(r,y,h){ let s='';
  for(let x=6;x<320;x+=22) s+=L(x,y,x,y+h,P.wire,1.6,.85);
  for(let i=0;i<4;i++) s+=L(0,y+3+i*(h/4),320,y+3+i*(h/4),P.wire,.8,.8);
  for(let x=6;x<320;x+=7) s+=E(x,y+2+((x*7)%h),1.1,1.1,P.wire,.5);
  return s; }
function tower(x,y){ return R(x-2,y,4,26,P.rafd)+R(x-14,y-14,28,16,P.rafd)
  + R(x-17,y-20,34,7,P.nightd,.9) + L(x-14,y+2,x+14,y+2,P.nightd,2)
  + R(x-11,y-11,8,7,'#cfd6a6',.5); }
function huts(r,y,c=P.soild){ let s='';
  for(let i=0;i<5;i++){ const x=10+i*62+r()*6, w=48;
    s+=R(x,y,w,17,c,.95)+`<path d="M${x-3} ${y} L${x+w/2} ${y-9} L${x+w+3} ${y} Z" fill="${P.ink}" opacity=".55"/>`;
    for(let k=0;k<3;k++) s+=R(x+6+k*14,y+5,7,7,'#cfd0bd',.6); }
  return s; }
function figs(r,y,n,c=P.ink){ let s='';
  for(let i=0;i<n;i++){ const x=14+r()*292, yy=y+r()*10;
    s+=E(x,yy-7,2.2,2.6,c,.8)+R(x-2.4,yy-5,4.8,9,c,.8); }
  return s; }
function grain(r){ let s='';
  for(let i=0;i<46;i++) s+=E(r()*320,r()*180,.7+r()*1.2,.5+r()*.9,P.ink,.03+r()*.05);
  return s; }

/* scenes -------------------------------------------------------------- */
const scenes = {

title(r){ return wash(r,'#252d3a','#1c2330') + E(258,32,11,11,P.snow,.8)
  + pines(r,96,P.pined,17) + R(0,132,320,48,P.nightd)
  + fence(r,108,26) + tower(36,96) + tower(284,96)
  + R(0,150,320,30,'#20242c')
  + L(24,166,296,166,P.sand,2.4,.85) + L(24,166,24,160,P.sand,2.4,.85)
  + E(160,171,120,5,P.sandd,.25); },

club(r){ return wash(r,'#2b2016','#241a11')
  + R(216,16,70,86,'#151a26',.9) + R(222,22,58,74,'#3a4c66',.5) + E(250,44,16,20,P.amber,.18)
  + R(0,120,320,60,'#2e2013')
  + R(18,112,284,14,P.snow,.92) + R(18,124,284,4,'#cfc7b2',.8)
  + E(60,108,10,3,P.amber,.5)+E(60,100,3,7,P.amber,.8)
  + E(160,109,9,3,'#b9c0c9',.5)+E(252,108,10,3,P.amber,.4)
  + R(270,84,26,30,'#2c3444',.9)+R(272,86,22,5,'#7b8aa0',.5) /* the folded blazer chair */
  + figs(r,150,4,'#1d1710')
  + E(160,40,120,34,P.amber,.05); },

fire(r){ let s=wash(r,P.nightd,'#0e1118');
  for(let i=0;i<26;i++) s+=E(r()*320,r()*70,.8,.8,P.snow,.25+r()*.5);
  s+=`<path d="M0 180 L60 92 L64 92 L14 180 Z" fill="#aab6c4" opacity=".13"/>`
   + `<path d="M320 180 L236 84 L232 84 L300 180 Z" fill="#aab6c4" opacity=".11"/>`;
  for(let i=0;i<5;i++) s+=L(20+r()*60,180,110+r()*40,20+r()*40,'#e5b96b',1,.35);
  /* the kite, port wing burning */
  s+=`<g transform="translate(150 62) rotate(-7)">`
   + R(-52,-2,104,5,'#11151c') + R(-8,-7,18,9,'#11151c') + R(-58,-1,10,3,'#11151c')
   + E(-30,0,13,6,P.fire,.9)+E(-36,-4,9,5,'#f0a24a',.8)+E(-24,-7,6,4,'#f7c96e',.7)
   + `</g>`;
  for(let i=0;i<9;i++) s+=E(118-i*9,60+i*7+r()*4,7+i*1.5,4+i,P.smoke,.30-i*.026);
  s+=E(70,26,10,10,P.snow,.10)+E(70,26,7,7,P.snow,.12);
  return s+E(160,160,160,30,'#000',.35); },

silk(r){ let s=wash(r,'#8d9aa6','#7f8e9c');
  s+=E(160,150,190,50,'#6e7a70',.9)+R(0,150,320,30,'#5f6b60');
  for(let i=0;i<8;i++) s+=L(0,152+i*3.4,320,150+i*3.6,'#4d5850',1,.5);
  s+=pines(r,120,'#55604f',9);
  /* collapsed canopy */
  s+=E(96,150,44,12,P.snow,.95)+E(78,144,20,7,P.snow,.9)+E(116,146,24,8,'#d8d4c4',.9);
  for(let i=0;i<6;i++) s+=L(96+i*6-15,150,150,128,'#c9c4b2',.7,.6);
  s+=E(152,124,2.6,3,P.ink,.85)+R(149,127,6,11,P.ink,.85);
  s+=figs(r,150,2,'#3a4238');
  s+=E(50,30,26,10,'#b9c2cc',.5)+E(240,44,34,12,'#b9c2cc',.4);
  return s; },

dulag(r){ let s=wash(r,'#3a3830','#333128');
  s+=R(30,24,260,132,'#443f33')+R(34,28,252,124,'#4c463a');
  s+=R(120,10,80,10,'#2c2922');
  s+=E(160,52,26,20,'#e6d9a8',.16)+E(160,44,7,9,'#e6d9a8',.5)+L(160,20,160,36,'#221f1a',2);
  s+=R(70,96,180,8,'#332f26')+R(76,104,10,40,'#2b2822')+R(234,104,10,40,'#2b2822');
  s+=R(96,74,58,24,'#e8e0c8',.9)+L(100,82,148,82,'#8a8064',.8)+L(100,88,142,88,'#8a8064',.7)
    +E(112,70,7,4,'#a33',.55); /* the form, red cross */
  s+=E(206,84,2.8,3.2,P.ink,.9)+R(202.6,88,6.8,14,P.ink,.9);
  for(let i=0;i<7;i++) s+=E(196+i*2,66-i*5,4+i*1.4,2.4+i*.8,'#b9b2a0',.14-i*.013);
  return s+E(160,160,170,40,'#000',.30); },

gate(r){ let s=wash(r,'#98a2ab','#8b96a1');
  s+=pines(r,58,P.pine,16)+pines(r,66,P.pined,12);
  s+=R(0,124,320,56,P.soil)+E(160,146,150,20,P.soild,.5);
  s+=fence(r,84,42)+tower(52,70)+tower(268,70);
  s+=R(148,84,30,42,'#2f363c',.9)+L(148,84,178,84,P.wire,3);
  /* the yellow underfoot, scuffed through the grey */
  s+=E(163,152,30,7,P.sand,.85)+E(140,158,14,4,P.sandd,.7)+E(196,156,10,3,P.sand,.6);
  s+=figs(r,138,9,'#2c3036');
  return s+grain(r); },

compound(r){ let s=wash(r,'#9fb3c2','#93a8b8');
  s+=E(70,30,30,10,P.snow,.5)+E(210,22,42,12,P.snow,.45);
  s+=pines(r,52,P.pine,15);
  s+=R(0,110,320,70,P.soil)+fence(r,74,38);
  s+=huts(r,92);
  /* washing line + the circuit path */
  s+=L(30,120,90,116,P.wire,.8)+R(44,117,8,10,P.snow,.8)+R(60,116,8,10,'#c8ced6',.8);
  s+=`<path d="M10 172 C 90 150, 230 150, 310 170" stroke="${P.soild}" stroke-width="7" fill="none" opacity=".8"/>`;
  s+=figs(r,140,12,'#333940');
  return s+grain(r); },

scheme(r){ let s=wash(r,P.night,'#161c26');
  for(let i=0;i<16;i++) s+=E(r()*320,r()*46,.7,.7,P.snow,.3+r()*.4);
  s+=R(0,120,320,60,'#20242a')+fence(r,84,40)+tower(272,70);
  s+=`<path d="M272 78 L150 180 L235 180 Z" fill="#e9e3bf" opacity=".16"/>`;
  s+=E(200,150,40,9,'#e9e3bf',.10);
  s+=huts(r,100,'#3a3f3c');
  s+=E(96,166,3,3.4,P.ink,.95)+R(92.8,170,6.4,9,P.ink,.95); /* flat to the sand */
  s+=E(112,174,22,4,P.sand,.35);
  return s; },

cooler(r){ let s=wash(r,'#2e2c26','#282720');
  s+=R(58,16,204,150,'#35332b')+R(64,22,192,138,'#3b382f');
  s+=R(206,30,34,26,'#191c22')+L(223,30,223,56,'#565a52',3)+L(206,43,240,43,'#565a52',3);
  s+=`<path d="M206 56 L120 166 L206 166 Z" fill="#ded6b2" opacity=".14"/>`;
  s+=R(84,120,64,10,'#2c2a22')+R(88,130,8,26,'#262419')+R(132,130,8,26,'#262419');
  s+=E(112,110,2.8,3.2,'#1c1a14',.95)+R(108.6,114,6.8,13,'#1c1a14',.95);
  for(let i=0;i<5;i++) s+=L(78+i*9,36,78+i*9,60,'#4a473c',1.4,.7); /* tally marks */
  return s+E(160,166,170,30,'#000',.3); },

hut104(r){ let s=wash(r,'#3f3a2c','#383325');
  s+=R(20,18,280,146,'#4a4433')+R(26,24,268,134,'#544d3a');
  for(let i=0;i<3;i++){ const x=36+i*92;
    s+=R(x,54,72,10,'#3a3526')+R(x,92,72,10,'#3a3526')
     +R(x+2,64,4,40,'#332e20')+R(x+66,64,4,40,'#332e20')
     +R(x+4,44,64,8,'#6a6248',.8); }
  /* the stove, lit, and the trap edge */
  s+=R(238,96,34,44,'#2b2a28')+R(246,88,8,12,'#2b2a28')+E(255,118,9,10,P.fire,.5)
    +E(255,118,5,6,'#f0a24a',.6);
  s+=R(224,148,58,10,'#463f2c')+L(224,148,282,148,P.sandd,1.2,.5);
  s+=E(96,126,20,14,'#e6d9a8',.10);
  s+=E(140,120,2.8,3.2,P.ink,.9)+R(136.6,124,6.8,13,P.ink,.9);
  s+=E(180,122,2.8,3.2,P.ink,.85)+R(176.6,126,6.8,13,P.ink,.85);
  return s+E(160,164,175,30,'#000',.28); },

theater(r){ let s=wash(r,'#241c12','#1e170e');
  s+=R(30,20,260,120,'#171310');
  s+=R(46,36,228,88,'#3a2f22'); /* stage */
  s+=R(46,36,228,88,'#503f2a',.4)+E(160,80,110,50,'#e8d9a8',.12);
  s+=R(52,42,60,76,'#5c6b52',.8)+R(120,50,90,60,'#6b5b44',.8)+R(216,44,52,72,'#4c5a68',.8); /* flats */
  s+=E(100,102,2.6,3,P.ink,.9)+R(96.9,105,6.2,12,P.ink,.9);
  s+=E(150,100,2.6,3,'#7a2620',.9)+R(146.9,103,6.2,12,'#7a2620',.9);
  for(let i=0;i<7;i++) s+=E(60+i*34,150,13,4.5,'#0d0b08',.9)+E(60+i*34,144,4,4.5,'#1c1712',.9); /* the house */
  s+=R(30,18,260,6,'#0d0b08');
  for(let i=0;i<5;i++) s+=E(60+i*50,26,7,4,'#f0d98a',.30+r()*.2); /* klim-tin lights */
  return s; },

tunnel(r){ let s=R(0,0,320,180,'#171310');
  s+=E(160,90,150,80,'#231a10',.9);
  /* the bore, receding */
  s+=E(160,92,118,58,'#2c2013')+E(160,94,86,44,'#3a2a16')+E(160,96,58,32,'#4a3418')+E(160,98,34,20,'#5c4019');
  s+=E(160,98,16,11,'#8a6a2a')+E(160,98,8,6,'#c9a44a',.9); /* lamp at the face */
  for(let i=0;i<7;i++){ const k=1-i*.13;
    s+=L(160-118*k,92-58*k,160+118*k,92-58*k,'#4c3a22',2.2,.65); /* roof boards */
    s+=L(160-118*k,92+58*k,160+118*k,92+58*k,'#42311c',2,.5);
    s+=L(160-118*k,92-58*k,160-118*k,92+58*k,'#514027',2,.6)+L(160+118*k,92-58*k,160+118*k,92+58*k,'#514027',2,.6); }
  s+=L(140,148,180,148,'#6a5a3a',2,.7)+L(146,152,174,152,'#6a5a3a',2,.5); /* trolley rails */
  s+=E(120,120,10,7,P.sand,.25)+E(210,128,12,8,P.sand,.2);
  return s; },

winter(r){ let s=wash(r,'#aab4bd','#9fabb6');
  s+=pines(r,44,'#414d42',15);
  s+=R(0,100,320,80,'#dfe0d8')+E(160,120,160,26,'#eceee6',.9);
  s+=fence(r,70,34);
  s+=huts(r,86,'#5c564a');
  for(let i=0;i<40;i++) s+=E(r()*320,r()*180,1+r()*1.2,1+r()*1.2,'#fff',.5+r()*.4);
  s+=E(120,150,26,5,'#c6c9bd',.8)+E(120,144,3,8,'#2c2a22',.8); /* a lone man on the circuit */
  s+=E(126,152,2.6,3,P.ink,.85)+R(123,155,6,10,P.ink,.85);
  return s; },

appell(r){ let s=wash(r,'#93a0ab','#8996a3');
  s+=pines(r,50,P.pine,14)+fence(r,72,34);
  s+=R(0,116,320,64,P.soil);
  for(let row=0;row<3;row++) for(let i=0;i<16;i++){
    const x=28+i*17+(row%2)*4, y=126+row*14;
    s+=E(x,y-6,2,2.4,'#2c3036',.85)+R(x-1.8,y-4,3.6,8,'#2c3036',.85); }
  s+=E(258,120,3,3.6,'#37424d',.95)+R(254.6,124,6.8,13,'#37424d',.95); /* the officer with the count */
  s+=R(286,96,22,30,'#4c463a')+R(288,98,18,22,'#e8e0c8',.9); /* the board under the eagle */
  return s+grain(r); },

night(r){ let s=wash(r,'#10141d','#0b0e15');
  for(let i=0;i<30;i++) s+=E(r()*320,r()*60,.7,.7,P.snow,.2+r()*.5);
  s+=R(0,118,320,62,'#141821');
  s+=huts(r,100,'#1d222b');
  s+=fence(r,80,38)+tower(280,66);
  s+=E(160,140,140,20,'#e6e8ea',.06); /* snowfield glow */
  for(let i=0;i<3;i++) s+=E(60+i*70,150+r()*8,16,3,'#e6e8ea',.08);
  s+=R(96,96,20,26,'#252017')+E(106,110,7,9,'#d8a24a',.25); /* hut 104 window lit low */
  return s; },

hole(r){ let s=wash(r,'#0e1218','#0a0d13');
  for(let i=0;i<24;i++) s+=E(r()*320,r()*50,.7,.7,P.snow,.25+r()*.4);
  s+=R(0,110,320,70,'#e3e5e2',.9)+R(0,104,320,10,'#c9ccc8',.6); /* open snow */
  s+=pines(r,30,'#1d2a20',9); /* the treeline, ten feet too far */
  s+=E(96,138,17,9,'#0d0b08')+E(96,136,13,6,'#241c10'); /* the hole */
  s+=E(96,130,9,4,P.sand,.5);
  s+=`<path d="M96 138 C 140 132, 200 120, 248 108" stroke="#5a5340" stroke-width="1.6" fill="none" opacity=".8" stroke-dasharray="5 4"/>`; /* the rope */
  s+=E(250,106,2.6,3,P.ink,.9)+R(247,109,6,9,P.ink,.9); /* the signalman prone-ish */
  s+=`<path d="M282 60 L180 180 L260 180 Z" fill="#e9e3bf" opacity=".05"/>`; /* dead searchlight ghost */
  return s; },

station(r){ let s=wash(r,'#14161c','#0f1116');
  s+=R(0,120,320,60,'#1c1e24');
  s+=R(20,50,180,72,'#2a2820')+R(20,44,184,8,'#1c1a14'); /* booking hall */
  s+=R(36,66,26,36,'#e8d9a8',.25)+R(76,66,26,36,'#e8d9a8',.18); /* windows */
  s+=E(150,40,9,6,'#e8d9a8',.5)+L(150,46,150,58,'#3a3830',2); /* the one lamp */
  s+=L(0,150,320,146,'#3d4046',3,.9)+L(0,160,320,157,'#3d4046',3,.9); /* rails */
  for(let x=8;x<320;x+=13) s+=R(x,146,7,14,'#26282e',.8);
  s+=E(60,132,2.8,3.2,P.ink,.9)+R(56.6,135,6.8,13,P.ink,.9);
  s+=E(96,132,2.8,3.2,'#37424d',.9)+R(92.6,135,6.8,13,'#37424d',.9); /* the check */
  s+=E(103,131,5,3,'#e8d9a8',.3); /* the torch */
  return s; },

walk(r){ let s=wash(r,'#8f9aa4','#8593a0');
  s+=E(160,60,190,40,'#b8c2ca',.5); /* far haze */
  s+=`<path d="M0 74 L52 46 L96 70 L150 40 L204 68 L258 44 L320 70 L320 90 L0 90 Z" fill="#cfd6da" opacity=".8"/>`; /* the mountains */
  s+=`<path d="M0 76 L52 50 L96 72 L150 44 L204 70 L258 48 L320 72" stroke="#a8b2ba" stroke-width="1.4" fill="none" opacity=".8"/>`;
  s+=R(0,90,320,90,'#dfe0d8')+E(160,110,170,22,'#eceee6',.9);
  s+=pines(r,86,'#4b5648',10);
  s+=`<path d="M40 180 C 90 150, 150 140, 208 120" stroke="#c2c6ba" stroke-width="5" fill="none" opacity=".7"/>`;
  s+=E(120,140,2.8,3.2,P.ink,.95)+R(116.6,144,6.8,13,P.ink,.95); /* one small figure, walking */
  for(let i=0;i<7;i++) s+=E(112-i*7,156+i*2,1.6,.9,'#b8bcb0',.7); /* footprints back */
  return s; },

docks(r){ let s=wash(r,'#1a2028','#141a22');
  s+=R(0,120,320,60,'#10161e'); /* black water */
  for(let i=0;i<9;i++) s+=L(10+i*36,126+r()*40,34+i*36,126+r()*40,'#3c4c5c',1,.5);
  s+=R(0,104,320,18,'#232019'); /* quay */
  /* the ship */
  s+=`<path d="M180 118 L300 118 L292 96 L188 96 Z" fill="#2c3440"/>`;
  s+=R(214,72,52,24,'#3a4450')+R(232,52,12,22,'#4a5560')+E(238,50,4,5,'#c9a44a',.5);
  for(let i=0;i<5;i++) s+=E(196+i*20,100,2.4,2.4,'#e8d9a8',.5);
  s+=L(206,118,182,132,'#5a5340',2.4,.9); /* gangway */
  s+=tower(40,60)+fence(r,84,20);
  s+=E(120,110,2.8,3.2,P.ink,.9)+R(116.6,113,6.8,11,P.ink,.9); /* the man at the fence line */
  s+=E(240,30,20,7,'#8fa0ae',.3)+E(80,24,26,8,'#8fa0ae',.25); /* harbor smoke */
  return s; },

list(r){ let s=wash(r,'#9aa2a9','#909aa3');
  s+=R(60,26,200,128,'#6d675a')+R(66,32,188,116,'#7a7365'); /* cookhouse wall */
  s+=R(126,44,68,86,'#e8e0c8',.95); /* the list */
  for(let i=0;i<14;i++) s+=L(134,56+i*5.4,186-r()*14,56+i*5.4,'#3a362c',1.1,.8);
  s+=`<path d="M150 34 L160 26 L170 34 L165 34 L165 40 L155 40 L155 34 Z" fill="#4c463a"/>`; /* the eagle, abstracted to shape */
  /* the men, backs to us, hats off */
  s+=E(96,150,3.4,3.8,'#2c3036',.95)+R(92,155,8,16,'#2c3036',.95);
  s+=E(130,152,3.8,4.2,'#2c3036',.95)+R(125.4,158,9.2,15,'#2c3036',.95); /* tiny */
  s+=E(168,151,3.4,3.8,'#2c3036',.95)+R(164,156,8,16,'#2c3036',.95);
  s+=E(206,150,3.4,3.8,'#2c3036',.95)+R(202,155,8,16,'#2c3036',.95);
  return s+E(160,166,175,26,'#000',.18); },

marchw(r){ let s=wash(r,'#b9bfc4','#aeb6bd');
  for(let i=0;i<60;i++) s+=E(r()*320,r()*180,1+r()*1.4,1+r()*1.4,'#fff',.4+r()*.5);
  s+=R(0,110,320,70,'#e6e7e2');
  s+=`<path d="M0 160 C 80 146, 240 146, 320 128" stroke="#c9ccc4" stroke-width="10" fill="none" opacity=".9"/>`; /* the road */
  /* the column */
  for(let i=0;i<12;i++){ const x=30+i*24, y=150-i*1.6;
    s+=E(x,y-6,2.2,2.6,'#33363c',.9)+R(x-2,y-4,4,9,'#33363c',.9);
    if(i%4===2) s+=R(x+4,y+2,12,4,'#4c463a',.9)+L(x+4,y+4,x-2,y+1,'#4c463a',1.4,.9); } /* sledges */
  s+=pines(r,96,'#55604f',7);
  return s; },

home(r){ let s=wash(r,'#a8c2b8','#9cb8ad');
  s+=E(160,50,180,36,'#e8f0ea',.5);
  s+=R(0,96,320,84,'#7fa06b'); /* england, green off the water */
  s+=E(160,112,180,24,'#8fb07a',.9);
  s+=`<path d="M0 96 C 60 84, 120 92, 180 84 C 240 78, 280 88, 320 82 L320 96 Z" fill="#6d905c"/>`;
  /* the garden gate */
  s+=R(140,108,4,42,'#7a6a4c')+R(196,108,4,42,'#7a6a4c');
  s+=L(142,116,198,116,'#8a7a58',3)+L(142,132,198,132,'#8a7a58',3)+L(142,146,198,146,'#8a7a58',3);
  s+=L(150,112,150,150,'#8a7a58',2.4)+L(170,112,170,150,'#8a7a58',2.4)+L(188,112,188,150,'#8a7a58',2.4);
  s+=E(146,150,10,4,P.amber,.4)+E(196,148,8,3,'#c9a0b8',.5)+E(122,154,7,3,P.amber,.35); /* crocuses at the gate */
  s+=E(240,120,2.8,3.2,'#3a4238',.9)+R(236.6,124,6.8,13,'#3a4238',.9);
  s+=E(226,122,2.4,2.8,'#6a4a52',.9)+R(223,125,5.6,11,'#6a4a52',.9); /* two figures, close */
  return s; },

vault(r){ let s=wash(r,'#8fa08a','#84977f');
  s+=pines(r,26,P.pined,16)+pines(r,40,P.pine,12);
  s+=R(0,140,320,40,'#6d7a62');
  s+=R(118,66,84,74,'#c9c4b4')+R(112,60,96,10,'#b3ada0')+R(124,72,72,54,'#d4cfc0');
  for(let i=0;i<8;i++) s+=L(132,80+i*6,188-r()*10,80+i*6,'#8a8478',1,.7); /* the names, unreadable */
  s+=E(96,150,3,3.4,'#37413a',.9)+R(92.4,154,7.2,14,'#37413a',.9);
  s+=E(226,150,3,3.4,'#37413a',.9)+R(222.4,154,7.2,14,'#37413a',.9);
  s+=E(160,60,60,20,'#e8e4c8',.12);
  return s+grain(r); },

sand(r){ let s=wash(r,'#9aa8b4','#90a0ae');
  s+=pines(r,40,P.pine,14)+fence(r,64,30);
  s+=R(0,94,320,86,P.soil);
  /* the cut: grey lifted, yellow underneath */
  s+=E(160,132,86,26,P.sandd,.9)+E(160,128,74,20,P.sand,.95)+E(150,124,40,10,'#e7c257',.9);
  s+=E(74,150,20,6,P.sand,.5)+E(246,148,16,5,P.sand,.45);
  /* boots treading it in */
  s+=E(105,118,2.8,3.2,P.ink,.9)+R(101.6,122,6.8,13,P.ink,.9);
  s+=E(220,116,3.4,3.8,P.ink,.95)+R(216,121,8,15,P.ink,.95); /* Tiny */
  s+=L(224,136,229,142,P.ink,2,.9);
  for(let i=0;i<8;i++) s+=E(214+r()*16,142+r()*5,2.4,1,P.sand,.8);
  return s+grain(r); },
};

function paint(el, key, seed){
  const r=rng(key+'|'+seed);
  const body=(scenes[key]||scenes.compound)(r);
  el.innerHTML=`<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${body}</svg>`;
}
return { paint };
})();
