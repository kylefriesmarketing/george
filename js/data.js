/* =====================================================================
   G FOR GEORGE — data.js
   ALL content. The true story of the tunnels of Stalag Luft III,
   names changed. The events are true; the names belong to no one,
   so that the story can belong to all of them.

   node: { region, reg:'lark'|'ache'|'dread'|'elegy', title,
     text(str|fn(S,P)), choices:[ t, pre?, req?(S,P),
     heat?/kit?/crew? (deltas), feet? (tunnel), fx?(S,P), go|end ] }
   Tokens: {HERO} {FRIEND} substituted from P.names.
   ===================================================================== */
const STORY = (() => {

const regions = {
  club:    { name:'The Royal Air Force Club — 1994', ch:9, art:'club' },
  fire:    { name:'Over Essen — October 1942',       ch:1, art:'fire' },
  silk:    { name:'A Field in Germany',               ch:1, art:'silk' },
  dulag:   { name:'Dulag Luft — the Interrogation',   ch:2, art:'dulag' },
  gate:    { name:'Stalag Luft III — Sagan, Silesia', ch:2, art:'gate' },
  compound:{ name:'The Compound',                     ch:3, art:'compound' },
  scheme:  { name:'The Wire — After Dark',            ch:3, art:'scheme' },
  cooler:  { name:'The Cooler',                       ch:3, art:'cooler' },
  hut104:  { name:'Hut 104',                          ch:3, art:'hut104' },
  sand:    { name:'The Yellow Sand',                  ch:3, art:'sand' },
  trade:   { name:'The Trade — 1943',                 ch:4, art:'compound' },
  theater: { name:'The Camp Theater',                 ch:4, art:'theater' },
  tunnel:  { name:'Thirty Feet Down',                 ch:4, art:'tunnel' },
  winter:  { name:'The Halt — Winter ’43',            ch:4, art:'winter' },
  order:   { name:'March 1944',                       ch:5, art:'appell' },
  lottery: { name:'The Theater — the Night of the Draw', ch:5, art:'theater' },
  night:   { name:'The Night of the 24th',            ch:6, art:'night' },
  hole:    { name:'The Hole',                         ch:6, art:'hole' },
  station: { name:'Sagan Station — Small Hours',      ch:7, art:'station' },
  walk:    { name:'The Roads South',                  ch:7, art:'walk' },
  docks:   { name:'The Baltic Docks',                 ch:7, art:'docks' },
  list:    { name:'The List',                         ch:7, art:'list' },
  vault:   { name:'The Memorial in the Pines',        ch:7, art:'vault' },
  agency:  { name:'Dean & Dawson — the Travel Agency', ch:5, art:'dulag' },
  horse:   { name:'East Compound — the Vaulting Horse', ch:4, art:'horse' },
  inhorse: { name:'Inside the Horse',                  ch:4, art:'inhorse' },
  garden:  { name:'The Garden — 1944',                ch:8, art:'tunnel' },
  marchw:  { name:'The Road West — January ’45',      ch:8, art:'marchw' },
  home:    { name:'Home',                             ch:8, art:'home' },
};
const CHAPTERS=['The Fall','The Bag','The Compound','The Trade','The Order','The Night','The List','The Garden','1994'];

/* The Log — every named man, entered as you witness him. stage: 1 met,
   2 his story, 3 his fate. Real counterparts are printed only in the
   afterword, never here. */
const cast = {
  freddie:{ name:()=>P0().friend, role:'Navigator — the other half of the crew',
    note:'He could find anywhere from a cockpit in the dark. Sunny, precise, engaged to Peggy. All that is left of G-George besides you.' },
  magpie: { name:'W/Cdr Edmund Vane — “the Magpie”', role:'Big X',
    note:'Pre-war barrister. Collects men, maps, and tin the way other men collect stamps. Third escape attempt; the Gestapo promised him there would not be a fourth.' },
  zabek:  { name:'F/Lt Stefan Zabek', role:'Tunnel King',
    note:'Polish airman, ex-miner. Buried alive at sixteen for nine hours. Digs at the face anyway, every day, because Poland.' },
  inky:   { name:'F/O Owen “Inky” Price', role:'The Forger — “Dean & Dawson”',
    note:'Welsh, gentle. Reproduces German typefaces by hand, one letter at a time, by candlelight, going quietly half-blind for other men’s papers.' },
  duke:   { name:'F/O Roy “Duke” Callahan', role:'The Scrounger',
    note:'Canadian charm in a converted greatcoat. Chocolate, cigarettes, sympathy — then the hook. Hates the hook more than the Germans do.' },
  tiny:   { name:'F/O “Tiny” Watts', role:'Penguin',
    note:'Enormous, gentle, funny. Disperses sand from his trouser bags with a music-hall shuffle. Calls the tunnels “the garden — same work, upside down.”' },
  doc:    { name:'S/L “Doc” Meredith', role:'Medical Officer',
    note:'The committee’s conscience. Tends wire fever. Believes the tunnel doesn’t have to reach the trees — it has to reach June.' },
  reyter: { name:'Oberst von Reyter', role:'Kommandant',
    note:'Old Luftwaffe; flew in the first war. Decent within a system that is not. A roof the camp does not know it has.' },
  brandt: { name:'Uffz. Brandt', role:'A guard',
    note:'Homesick and kind, which in this place is a currency. A daughter in Hamburg.' },
  weasel: { name:'Fw. Griess — “the Weasel”', role:'Chief Ferret',
    note:'A craftsman who respects craft. Crawls under huts for a living and is very good at it. The nearest thing you have to a rival player.' },
};
/* engine sets this so cast name fns can read renames */
let P0=()=>({hero:'Kit', friend:'Freddie'});
const bindP=(fn)=>{ P0=fn; };

/* Mentions in Dispatches — the deeds. All 24. */
const mentions = {
  tomdick:  { t:'They Found What We Let Them Find', hint:'Witness what happened to Tom, all of it.' },
  ninehours:{ t:'The Nine Hours',          hint:'Hear why the Tunnel King chooses the face.' },
  boards:   { t:'The Bed You Gave the Tunnel', hint:'Sleep on string so Harry can stand.' },
  kindness: { t:'No Ledger Entry',         hint:'Give a frightened man something for nothing.' },
  sandyd:   { t:'Stand for Sandy',         hint:'Do not let the wire have the last word.' },
  draw:     { t:'The First Thirty',        hint:'Earn a number worth having.' },
  pact:     { t:'The Crew Flies Together', hint:'Seventy-two hours at the coast. Shake on it.' },
  rope:     { t:'Two Tugs',                hint:'Work the rope at the hole on the night.' },
  gardener: { t:'Deep Enough to Stand In', hint:'Dig the tunnel that goes nowhere.' },
  bringthem:{ t:'All Answering at the Barns', hint:'Bring your people through the road west.' },
  stockholm:{ t:'Arrived, Course as Plotted', hint:'A home run — anyone’s.' },
  silence:  { t:'The Week the Music Stopped', hint:'Stand at the wall and read every name.' },
  vaulter:  { t:'Twenty a Day',              hint:'Take every vaulting shift in Book Two.' },
  flush:    { t:'Flush to the Frame',        hint:'Reseal the trap so well the horse itself would approve.' },
  allthree: { t:'All Three',                 hint:'Catch the boat. Everyone catches the boat.' },
  nonames:  { t:'No Names, No Pack Drill', hint:'Give the interrogator nothing — twice.' },
  watcher:  { t:'Eyes Open',               hint:'Learn the wire before you touch it.' },
  firstsand:{ t:'First Sand',              hint:'Carry your first bag down a trouser leg.' },
  crewtrue: { t:'Two of Seven',            hint:'Reach the compound with the crew unbroken.' },
  twocigs:  { t:'Two Cigarettes at a Time', hint:'Waste ten hours of a ferret’s life.' },
  greenfingers:{ t:'Green Fingers',        hint:'Hear all of Tiny’s story.' },
  deandawson:{ t:'Dean & Dawson',          hint:'Walk out with perfect papers.' },
  footaday: { t:'A Foot a Day',            hint:'Feed the tunnel thirty days running.' },
  craftsman:{ t:'The Craftsman',           hint:'Earn the Weasel’s respect.' },
  piccadilly:{ t:'Piccadilly',             hint:'Ride the trolley the full three hundred and thirty-six.' },
  perardua: { t:'Per Ardua',               hint:'Answer the roll.' },
  junegate: { t:'The Garden Gate',         hint:'Read every one of Nell’s letters.' },
};

/* ======================================================================
   NODES — ACT I: THE BAG
   ====================================================================== */
const nodes = {

/* ---------- FRAME: 1994 ---------- */
n_club:{ region:'club', reg:'elegy', title:'More Chairs Than Men',
  text:(S,P)=>{
    const base=`The club lays the long table the same way every year: white cloth, the good silver, and one place set at the end that nobody will use, with a folded blazer over the back of the chair. There were forty of us at this dinner once. Tonight we are six, and I am the only one who was in Hut 104.\n\nThe girl finds me by the window with a glass I have been not-drinking for half an hour. Tiny’s granddaughter — she has his laugh, which is a remarkable thing to hear come out of a person you could fit in his old greatcoat pocket. She pulls up the chair beside me the way he used to, backwards, arms folded on the rail.`;
    if(!P.runs) return base+`\n\n“Grandad never would tell it,” she says. “Not properly. Will you?”\n\nFifty years I have been not telling this story properly. I look at the folded blazer at the end of the table, and the folded blazer looks back.`;
    const skip=untoldName(P);
    const ask = skip===null
      ? `“You know it all now,” she says. “Every man, told to the end. So tonight I want it in order, the whole book of it — and at nine, when they read the roll, I want you on your feet.”`
      : skip==='Grandad'
      ? `“You always go around Grandad,” she says, before the soup is even down. “You do the shuffle, you do the marrows, and then you go around him. Tonight, don’t.”`
      : `“You always skip ${skip},” she says, before the soup is even down. She keeps the ledger of my tellings better than I do. “Tonight, don’t.”`;
    return base+`\n\nI have told her this before${P.runs>1?' — '+(P.runs>4?'more times than the waiters approve of':P.runs+' times now'):''}, and it has come out different every time, because that is the only way to tell all of it.\n\n${ask}\n\nI look at the folded blazer at the end of the table, and the folded blazer looks back.`;
  },
  choices:[
    { t:'Begin where it begins: with an engine on fire.', pre:'tell it forward',
      fx:(S,P)=>{P.frame='fire';}, go:'n_fire' },
    { t:'Begin with the names. Seven in the crew, six hundred in the compound. She should have the names first.',
      fx:(S,P)=>{P.frame='names';}, go:'n_fire' },
    { t:'Pour two fingers for the empty chair first. Some things are done in order.',
      fx:(S,P)=>{P.frame='toast';}, go:'n_fire' },
    { t:'Warn her: it is a funny story almost the whole way. That is the part nobody believes.',
      fx:(S,P)=>{P.frame='funny';}, go:'n_fire' },
    { t:'She closes the notebook. “Tell me the other one tonight. Grandad’s favorite — the one about the horse.” The one from next door. The one that worked clean.',
      pre:'book two: the horse', req:(S,P)=>P.runs>=1,
      go:'n_h1' },
    { t:'Tonight the secretary reads the roll at nine — and tonight, for the first time, you know all of it. Every man, told to the end. Stand, and answer.',
      pre:'★ the log is complete', req:(S,P)=>logComplete(P),
      fx:(S,P)=>{ award(P,'perardua'); }, end:'e_roll' },
  ]},

/* ---------- CH 1: THE FALL ---------- */
n_fire:{ region:'fire', reg:'dread', title:'G for George',
  text:(S,P)=>`${P.frame==='funny'?'It is a funny story almost the whole way. But it does not start funny.\n\n':''}October of ’42, and the Ruhr is burning in both directions — them below, us above. G-George takes the flak somewhere over Essen: a sound like the ground clearing its throat, and then the port wing is a torch and the kite is trying to trade height for time and losing the exchange.\n\nSeven of us in her. {FRIEND} at the chart table with his pencils, calling me a course home as if the instruments still meant anything — that is what a navigator is, someone who believes in the way home <em>professionally</em>. The intercom is half fire-noise. I am twenty-two years old and the aircraft I am captain of has perhaps forty seconds left to live.\n\nI said the word. I have said it every night since, in the small hours, to the ceiling: <em>jump</em>.`,
  choices:[
    { t:'Hold her level. Wings steady, nose up, count them out the hatch — captain leaves last.',
      pre:'the drill, done properly', fx:S=>{S.flags.fall='held';}, go:'n_silk' },
    { t:'Go forward first — drag the flight engineer off the fire wall. He was seventeen days married.',
      fx:S=>{S.flags.fall='went'; S.flags.tried=1;}, go:'n_silk' },
    { t:'Tell her the truth: you do not remember. The fire, the word, and then sky. Fifty years and the middle is still missing.',
      fx:S=>{S.flags.fall='blank';}, go:'n_silk' },
    { t:'Tell it the way the squadron told it after: text-book bale-out, pilot last man off. Let the record be kind tonight.',
      pre:'the kind version', fx:S=>{S.flags.fall='kind';}, go:'n_silk' },
  ]},

n_silk:{ region:'silk', reg:'ache', title:'For You the War Is Over',
  text:(S,P)=>`Silk cracks open above me and the war goes quiet, all at once, like a door closed on a party. Below there is a black field in the black country I was bombing a minute ago, coming up slow and personal.\n\n${S.flags.fall==='went'?'I got him to the hatch. I know I got him to the hatch. Two chutes came out of George; his was not the second one. The arithmetic of that has a permanent room in my head.':'Two chutes came out of G-George. Out of seven. That arithmetic has a permanent room in my head, and the rent is paid nightly.'}\n\nThey take me at dawn in a beet field — an old farmer with a lantern and a boy with a shotgun that worries me chiefly because the boy is shaking. Then Wehrmacht, and the sentence every one of us heard, delivered almost gently, the German phrase-book kindness: <em>for you the war is over.</em>\n\nIn the village lock-up there is one other guest: a navigator, sitting on the bench with his boots off, wringing out his socks. He looks up. Of all the fields in all of Germany.`,
  choices:[
    { t:'“{FRIEND}. You’re late. I had us down at the coast twenty minutes ago.” — Give him the joke. He needs the joke.',
      pre:'the crew survives on form', crew:1, fx:S=>{S.flags.metjoke=1;}, go:'n_dulag' },
    { t:'Say nothing. Cross the cell and hold on to him like a man holds a rail in a sea.',
      crew:1, fx:S=>{S.flags.metheld=1;}, go:'n_dulag' },
    { t:'“Who else got out?” — Ask it now, fast, like ripping a dressing off.',
      fx:S=>{S.flags.metasked=1;}, go:'n_dulag' },
    { t:'“I’m sorry, Freddie.” Start the apology you will be making for fifty years.',
      crew:-1, fx:S=>{S.flags.metsorry=1;}, go:'n_dulag' },
  ]},

/* ---------- CH 2: THE BAG ---------- */
n_dulag:{ region:'dulag', reg:'dread', title:'The Friendly Man',
  text:`They split us at the railhead — that is the first thing the system does, it unpicks crews — and I go into a cell at Dulag Luft the size of a wardrobe, alone, for six days. This is not neglect. This is the recipe: solitude first, to soften.\n\nThen the friendly man. Luftwaffe major, beautiful English with a Cambridge crease in it, and a file on his desk with my squadron’s crest on the cover — which he lets me see, which is also the recipe. He offers a cigarette. He knows my station, my CO’s name, the pub outside the main gate. He is terribly sorry about my crew. He has, he says, only some forms to complete — a formality, so the Red Cross can notify my mother that I am alive.\n\n“You understand,” he says, “I already know nearly all of it. You would be telling me nothing. You would be doing your mother a kindness.”\n\nSix days of a wardrobe, and a man is offering me my mother.`,
  choices:[
    { t:'Name, rank, number. Say the three things and then say the three things again, in the same order, until the interview is over.',
      pre:'the stone', fx:S=>{S.flags.stone1=1;}, go:'n_redcross' },
    { t:'Take the cigarette. Smoke it slowly. Answer nothing. Courtesy costs nothing and gives the same nothing.',
      fx:S=>{S.flags.stone1=1; S.flags.smoked=1;}, go:'n_redcross' },
    { t:'Talk — about the weather, cricket, the terrible coffee. Fill the hour with a wall of pleasant rubbish.',
      fx:S=>{S.flags.chatted=1;}, go:'n_redcross' },
    { t:'Lose your temper. Six days in a wardrobe; let him have the temper. It is at least honest.',
      fx:S=>{S.flags.cracked=1;}, go:'n_redcross' },
  ]},

n_redcross:{ region:'dulag', reg:'dread', title:'The Form',
  text:(S,P)=>`The second session there is no major, only a corporal with a clipboard and a form headed with a red cross. Name. Rank. Number. And then, in the same friendly type: squadron. Aircraft. Target. Bomb load. Names of crew.\n\n${S.flags.cracked?'The major mentions my temper from last time, mildly, the way one mentions weather. My ears go hot. Temper is a coin, and I spent it and bought him a look at me.':'The corporal does not even watch me read it. That is how routine the trick is: the form does the work, hundreds of times a week, on tired frightened men who want their mothers written to.'}\n\nIt looks exactly official enough. That is its entire job. Somewhere in this building the real Red Cross form exists too — three lines long, name, rank, number — and the difference between the two pieces of paper is the whole war, in miniature, on a clipboard.`,
  choices:[
    { t:'Fill in three lines. Draw a courteous pencil stroke through the rest and hand it back.',
      pre:'three lines, no more',
      fx:(S,P)=>{ if(S.flags.stone1){ S.flags.dulagClean=1; award(P,'nonames'); } }, go:'n_gate' },
    { t:'Refuse all paper. If the Red Cross wants me, the Red Cross can find me. (Your mother waits three more weeks.)',
      fx:(S,P)=>{ if(S.flags.stone1){ S.flags.dulagClean=1; award(P,'nonames'); } S.flags.refusedform=1; }, go:'n_gate' },
    { t:'Fill it in — every box — with luminous rubbish. Squadron: the Watford Gap. Aircraft: a Sopwith Camel. CO: W/Cdr Biggles.',
      pre:'a wall of pleasant rubbish', heat:1, fx:S=>{S.flags.biggles=1;}, go:'n_gate' },
    { t:'Stall: your eyes are bad, your German worse, your hand shakes. Take the form away to “think about it” and lose it.',
      fx:S=>{S.flags.stalled=1;}, go:'n_gate' },
  ]},

n_gate:{ region:'gate', reg:'ache', title:'The Bag',
  text:(S,P)=>`Three days in a boxcar, and then a name I would spend two years learning to pronounce like a home address: <em>Sagan.</em> Silesia. Pine forest to every horizon, the trees planted in rows like a crop, which they are.\n\nAnd the camp. Wire in two fences with coiled wire piled between; goon towers on stilts at the corners, machine guns under little roofs like bird tables; and inside, huts on legs in a sea of grey dirt. They photograph me holding a number. A sergeant stamps things, fourteen times, with tremendous satisfaction.\n\n${S.flags.dulagClean?'“In the bag,” said the sergeant of the escort as the gate shut — almost friendly, one professional to another, a man delivering a parcel. ':''}And here is the thing I noticed first, that everyone notices first, the thing that runs this whole story like an engine: where boots had scuffed the grey topsoil by the gate, the ground underneath showed through <em>yellow</em>. Yellow like a canary. Yellow like a warning painted by the management.\n\nAt the gate of the compound, a reception committee of prisoners watches the new arrivals — kriegies, I would learn to say, and be one. A voice from the crowd: “Any of you play cricket? We’ve lost our best bat to a tunnel.” Laughter I did not yet understand.`,
  choices:[
    { t:'Walk in with your chin up and your wits out. This is a camp; camps have rules; learn them all.',
      fx:S=>{S.flags.arrival='sharp';}, go:'n_society' },
    { t:'Find {FRIEND} in the column and stay on his shoulder. One thing survived the fall; keep it where you can see it.',
      crew:1, go:'n_society' },
    { t:'Answer the voice: “I bowl a bit.” Whatever a tunnel has to do with cricket, be the man who said yes on his first day.',
      pre:'said yes on day one', fx:S=>{S.contrib++; S.flags.saidyes=1;}, go:'n_society' },
    { t:'Look too long at the yellow sand under the grey. File it away. You do not yet know what you are filing.',
      fx:S=>{S.flags.sawsand=1;}, go:'n_society' },
  ]},

/* ---------- CH 3: THE COMPOUND ---------- */
n_society:{ region:'compound', reg:'lark', title:'Sagan University',
  text:`Here is what nobody tells you about a prison camp, and what I could never make anyone at home believe: it was a <em>town</em>. Six hundred officers with nothing but time, and time is a raw material.\n\nThere were lectures — real ones, law and Greek and beekeeping — from men who had been dons and solicitors and, in one case I treasured, a circus manager. There was a stock exchange run entirely in cigarettes, with bulls, bears, and one memorable crash. There was a theater going up hut by hut, built from Red Cross packing crates, with an orchestra pit. The Poles ran a chess ladder of terrifying standard. Somebody was always walking the circuit — the beaten path inside the warning wire — two miles to the lap if you counted, and everybody counted.\n\nAnd under all of it, like a water table, the other industry. The one nobody named in the open. You could feel it the way you feel a basement under a dance floor: a certain hollowness to the cheerful noise.\n\nA man plants himself somewhere in a town like that, or he floats. Floating, I had seen already in the transit camps, is how the wire gets into a man.`,
  choices:[
    { t:'The theater crew. Sets from crate-wood, lights from tins — stage craft is CAMP craft, and everyone welcome.',
      pre:'build the theater', fx:(S,P)=>{S.contrib++; S.flags.planted='theater'; crewChk(S,P);}, go:'n_north' },
    { t:'The lecture circuit. Sit in the front row of Sagan University and take actual notes. Feed the head.',
      fx:(S,P)=>{S.flags.planted='lectures'; crewChk(S,P);}, go:'n_north' },
    { t:'The trading floor. Learn the cigarette economy from the inside — who wants what, who can get what, who owes whom.',
      fx:(S,P)=>{S.contrib++; S.flags.planted='trade'; crewChk(S,P);}, go:'n_north' },
    { t:'The circuit, with the quiet men. Walk laps with whoever is walking. You learn a town fastest through the soles of your feet.',
      fx:(S,P)=>{S.contrib++; S.flags.planted='circuit'; crewChk(S,P);}, go:'n_north' },
  ]},

n_north:{ region:'compound', reg:'lark', title:'The New Compound',
  text:(S,P)=>`In the spring of ’43 they marched us into the brand-new North Compound — raw huts, fresh-cut pine still bleeding sap, stumps in the dirt like pulled teeth. The Germans were proud of it. Purpose-built, they said. Escape-proof, they said, and pointed at the seismograph microphones buried along the wire, which they told us about <em>on purpose</em>, the way you tell a child the stove is hot.\n\nMoving day is how I met the man they built this story around. Enormous fellow supervising the furniture like a foreman — “Tiny,” inevitably — who shook my hand and said, of the new compound, in the voice of a man assessing an allotment: “Lovely soil round here. Free-draining. You could grow anything in this,” and winked with the entire right side of his body.\n\nA Canadian in a converted greatcoat sold me a spare blanket I did not know I needed for three cigarettes I did not know I had. Duke, that was, and the blanket was genuinely excellent.\n\nAnd across the parade square, watching six hundred men carry their worldly goods, stood a wing commander with black bright eyes that were not watching the men at all. They were watching the <em>distances</em>. I did not know his name yet. Everybody in that compound was a spoke; I had just seen the hub.`,
  choices:[
    { t:'Ask Tiny, deadpan, what he’d plant first. Speak allotment back to a man speaking allotment.',
      pre:'learn the local language', fx:(S,P)=>{S.flags.tinyfriend=1; logSee(P,'tiny',1);}, go:'n_scheme' },
    { t:'Buy Duke a real cup of trade coffee and ask him nothing at all. Investment.',
      fx:(S,P)=>{S.flags.dukefriend=1; logSee(P,'duke',1);}, go:'n_scheme' },
    { t:'Watch the wing commander watch the distances, and make sure he sees you seeing it.',
      pre:'let the hub notice a spoke', fx:(S,P)=>{S.contrib++; logSee(P,'magpie',1);}, go:'n_scheme' },
    { t:'Walk the new wire with {FRIEND} once, all the way round, saying nothing. Navigators like a fix on their position.',
      crew:1, fx:(S,P)=>{logSee(P,'freddie',1);}, go:'n_scheme' },
  ]},

n_scheme:{ region:'scheme', reg:'lark', title:'Everyone Digs a Bad Tunnel First',
  text:`Every new kriegie arrives certain that six hundred clever men have simply not yet thought of his idea. This is a disease of the first month. There is only one cure, and the camp — wisely — lets you catch it.\n\nMine came in the fourth week. I had studied the wire like a set text: the blind spot by the cookhouse where the tower lights crossed badly; the delousing parties marched to the shower block outside the gate on Thursdays; the German orderly about my height who wheeled the swill cart out at five. A dozen of us new boys traded these observations at night with the solemnity of a war cabinet.\n\nFifty years later I can tell you what we were actually doing: we were being <em>watched</em> — by the camp, by the committee, by men who had catalogued every one of these schemes in 1940 and knew their failure modes the way Doc knew symptoms. The camp lets the new boy try, or almost try, because the cooler teaches what no lecture can.\n\nAlmost try, or actually try? That was the only real question.`,
  choices:[
    { t:'The swill cart. Borrow the orderly’s route, his hat, and his five o’clock slouch, and wheel it at the gate.',
      pre:'ten days’ board and lodging', heat:1, fx:S=>{S.flags.scheme='cart'; S.cooler+=10;}, go:'n_cooler' },
    { t:'The delousing party. One extra man in a marching column of twenty — who counts? (They count.)',
      heat:1, fx:S=>{S.flags.scheme='shower'; S.cooler+=10;}, go:'n_cooler' },
    { t:'The blind spot. Over the warning wire at moonset, flat to the sand, wire cutters from a stolen stove scraper.',
      pre:'the honest, terrible way', heat:2, fx:S=>{S.flags.scheme='wire'; S.cooler+=14;}, go:'n_cooler' },
    { t:'None of them. Sit on your scheme, watch the others try theirs, and write down exactly how each one dies.',
      pre:'eyes open', fx:(S,P)=>{S.flags.scheme='watched'; S.contrib+=2; award(P,'watcher');}, go:'n_interview' },
  ]},

n_cooler:{ region:'cooler', reg:'ache', title:'Board and Lodging',
  text:(S,P)=>`${S.flags.scheme==='cart'?'I got eleven yards past the gate. The real orderly, it turned out, whistled — tunelessly, always the same three notes — and I did not know the tune. Eleven yards. A sentry took the cart handles from me almost sympathetically, like relieving an old lady of her shopping.':S.flags.scheme==='shower'?'They count. They count twice, at both ends, and a Feldwebel with a pencil found his column one officer rich and could not have been more pleased about it. The delousing party cheered me as I was led away, which I maintain was the proudest moment of my service to that date.':'I was six feet past the warning wire, flat in the sand with my heart going like a Merlin at take-off boost, when the tower light stopped crossing badly. They had mended the blind spot that Tuesday. The camp knew the blind spot. The camp had always known the blind spot; the camp was waiting to see who’d buy it.'}\n\nThe cooler: a corridor of cells the size of the Dulag wardrobe, and days measured in meals and the shadow of the window bar crossing the floor. You get a Bible, if you ask. You get your thoughts, whether you ask or not. I had rather a lot of those, mostly about ${S.flags.tried?'the flight engineer, seventeen days married':'two parachutes, out of seven'}.\n\nOn my release, blinking in the light like something born under a log, I found {FRIEND} waiting at the cooler door with a mug of trade coffee and a face doing several things at once.`,
  choices:[
    { t:'“Well,” you say, “the accommodation is quieter than ours.” Give him the joke before he can spend the worry.',
      pre:'form, held', crew:1, go:'n_interview' },
    { t:'Let him be angry. He is entitled. He watched you nearly get shot for a swill cart and heard about it from strangers.',
      crew:1, fx:S=>{S.flags.tookrow=1;}, go:'n_interview' },
    { t:'Tell him the truth you worked out in the cell: it wasn’t escape. It was the arithmetic — doing SOMETHING about the five.',
      pre:'the real reason, out loud', crew:2, fx:S=>{S.flags.toldwhy=1;}, go:'n_interview' },
    { t:'Take the coffee, dodge the conversation, and ask what you missed. There was a rumor of a camp show. Normal life, please.',
      crew:-1, go:'n_interview' },
  ]},

n_interview:{ region:'hut104', reg:'dread', title:'The Interview',
  text:(S,P)=>`${S.flags.scheme==='watched'?'It was Tiny who fetched me, of all people, with the theatrical casualness of a man asking you to make up a bridge four. “Chap wants a word. About the cricket.” We do not play cricket down the far end of Hut 104.':'Two days after the cooler let me go, Tiny appeared at my bunk with the theatrical casualness of a man asking you to make up a bridge four. “Chap wants a word. About the cricket.” We do not play cricket down the far end of Hut 104.'}\n\nThe wing commander with the black bright eyes sat on a bottom bunk with a wash-basin of water going cold in front of him — I learned later the basin was so the steam would fog the window glass, against lip-readers with binoculars. That is the standard of man I was dealing with.\n\n“${S.flags.scheme==='watched'?'You sat on a workable scheme for five weeks,' :'Eleven yards with the swill cart,'}” he said, without any hello. “${S.flags.scheme==='watched'?'and spent the time writing post-mortems of other men’s attempts. Show me the notebook. — Mm. Yes.':'And you kept your mouth shut in the cooler, which interests me more than the cart does.'}”\n\nHe looked at me the way he looked at distances. “Everything in this camp that matters,” he said, “is one organization. It has a hundred and thirty jobs and none of them are glamorous and every one of them is the tunnel. I don’t recruit men who want to escape. Every fool wants to escape. I recruit men who can be <em>part of a machine</em>. What are you offering me?”`,
  choices:[
    { t:'Your hands. You are fit, not claustrophobic that you know of, and you can learn to dig.',
      pre:'the face crews', fx:(S,P)=>{S.role='digger'; logSee(P,'magpie',2);}, go:'n_oath' },
    { t:'Your legs and your nerve. Sand has to walk somewhere in trouser bags, past ferrets, all day, looking bored.',
      pre:'the penguins', fx:(S,P)=>{S.role='penguin'; logSee(P,'magpie',2);}, go:'n_oath' },
    { t:'Your eyes. You watched the whole compound for five weeks and can say who stood where. Stooging: the watchers who watch the watchers.',
      pre:'the duty pilot system', fx:(S,P)=>{S.role='stooge'; logSee(P,'magpie',2);}, go:'n_oath' },
    { t:'Your schoolboy German and a steady drawing hand. Somewhere in this machine, somebody forges.',
      pre:'a runner for Dean & Dawson', fx:(S,P)=>{S.role='agency'; logSee(P,'magpie',2);}, go:'n_oath' },
  ]},

n_oath:{ region:'hut104', reg:'lark', title:'The Firm',
  text:(S,P)=>`What I was sworn into — and it was an oath, hand on nothing, eyes on his, which binds tighter — was not a tunnel. It was a firm.\n\nSecurity first: I would talk to no one about anything I saw or carried or heard, and “no one” was a list with only working exceptions. If a ferret came within fifty feet of certain huts, a man reading a certain book on certain steps would turn a page, and I would learn to see that page turn from across a parade square. There were duty rosters. There were shifts. There was, I am perfectly serious, a personnel department.\n\nAnd then the Magpie told me the shape of the thing, because I was inside now and the inside of the machine is the shape: not one tunnel. <em>Three.</em> Simultaneous, permanent, industrial. “They will find one,” he said, comfortably, like a man sacrificing a pawn he never liked. “Finding one proves the compound clean. Nobody digs three.”\n\nThree tunnels. Six hundred men over them, walking to lectures. I thought of the hollowness under the dance floor and understood I was now part of the basement.\n\n${S.flags.toldwhy?'“Your navigator,” the Magpie added, at the door, having plainly known every fact about me for weeks, “is the best draughtsman of maps in this compound, according to men who know. Bring him.” And so the two of us who fell out of George went into the machine together.':'“And your navigator,” the Magpie added at the door, having plainly known every fact about me for weeks. “Maps want drawing. Bring him.” And so the two of us who fell out of George went into the machine together.'}`,
  choices:[
    { t:'Ask the only question that matters to a pilot: who is the engineer? Who makes three tunnels not fall down?',
      pre:'meet the tunnel king', feet:26, fx:(S,P)=>{S.flags.tunnelRevealed=1; logSee(P,'zabek',1);}, go:'n_sand' },
    { t:'Ask what the odds actually are, out the far end, in Germany, in winter. Watch him decline to answer like a barrister.',
      feet:26, fx:S=>{S.flags.tunnelRevealed=1; S.flags.askedodds=1;}, go:'n_sand' },
    { t:'Ask nothing. Sworn in is sworn in; the machine will show you your corner of itself. Go and tell {FRIEND}.',
      crew:1, feet:26, fx:S=>{S.flags.tunnelRevealed=1;}, go:'n_sand' },
    { t:'Ask him, straight: why three tunnels when one man in ten thousand gets home? Make Big X say the arithmetic out loud, once.',
      pre:'the arithmetic, out loud', feet:26, fx:(S,P)=>{S.flags.tunnelRevealed=1; S.flags.heardcase=1; logSee(P,'magpie',2);}, go:'n_sand' },
  ]},

n_sand:{ region:'sand', reg:'lark', title:'The Garden',
  text:(S,P)=>`${S.flags.heardcase?'“Because,” he said, not missing a beat, “every man out that hole is ten thousand Germans looking for him instead of shooting at our brothers. I am not running an escape, Harland. I am running a second front you can walk to lectures over.” Then he wished me good morning.\n\n':''}My induction to the works was conducted by Tiny, which I would later understand was itself a compliment.\n\nHe took me down Hut 104 at slack period, moved a stove that was — this is the detail that still delights me — <em>kept burning</em>, so the concrete under it stayed warm to an inspecting hand, and showed me the trap. Ten seconds of woodwork and Germany opened. A shaft, shored like a mineshaft, breathing cool earth-smelling air up into the hut, with a ladder going down into electric light. Electric. They had wired it off the camp mains. Thirty feet down and the start of a gallery running north, shored with bed boards, towards the wire and the pines beyond.\n\nAnd everywhere, the enemy: the sand. Bright yellow, the moment you cut into it. On the surface of this compound there is no yellow anywhere the management did not put it — which is why, ${S.role==='penguin'?'as the newest penguin of the firm':'whatever one’s day job in the firm'}, a man walks the circuit with twelve pounds of Germany down each trouser leg, dribbling it out through a bag-and-pin arrangement while discussing the theater programme, and then <em>treads it in</em>, casually, like a man scuffing at nothing.\n\n“Same work as gardening,” said Tiny, shuffling a neat yellow pound into grey dirt while apparently admiring the sky, “just upside down. Sky’s down there” — he nodded at the trap — “and we plant blokes in it.”\n\nThat evening the firm posted its ledger where the firm could read it: feet dug. A number, chalked small, that six hundred men were secretly farming.\n\nHer voice, fifty years away: “How long did it have to be?” Three hundred and thirty-six feet, I tell her. She writes it on the tablecloth with her finger, the way her grandfather used to.`,
  choices:[
    { t:'Carry your first bag that same afternoon. Start the ledger.',
      pre:'first sand', feet:8,
      fx:(S,P)=>{ S.flags.tunnelRevealed=1; award(P,'firstsand'); logSee(P,'tiny',2); },
      go:'n_trade' },
    { t:'Go down the ladder first — one look at the sky they are planting men in. Then carry the bag.',
      pre:'see the works', feet:8,
      fx:(S,P)=>{ S.flags.tunnelRevealed=1; S.flags.wentdown=1; award(P,'firstsand'); logSee(P,'zabek',1); },
      go:'n_trade' },
    { t:'Find {FRIEND} and tell him about the maps job before anything else. The crew flies together.',
      crew:1, feet:4,
      fx:(S,P)=>{ S.flags.tunnelRevealed=1; logSee(P,'freddie',2); },
      go:'n_trade' },
    { t:'Stand a moment too long looking at the chalked number, doing arithmetic — feet, seasons, odds. Tiny’s hand lands on your shoulder: “Steady on. One bag at a time.”',
      feet:4,
      fx:(S,P)=>{ S.flags.tunnelRevealed=1; S.flags.didmath=1; logSee(P,'tiny',2); },
      go:'n_trade' },
  ]},

/* ======================================================================
   ACT II — THE TRADE (1943, the long year)
   ====================================================================== */

n_trade:{ region:'trade', reg:'lark', title:'The Firm at Full Steam',
  text:(S,P)=>`The summer of ’43 the firm ran three shifts and I learned the shape of an industrial concern from the inside. Tom ran west from Hut 123. Dick ran from 122. Harry — ours, though every man said “ours” about all three — ran north from under our warm stove toward the pines. Below ground: bed-board shoring, a rope-hauled trolley, and air pushed up the line by a pump built from kit bags, hockey sticks, and a genius from Glasgow.\n\nAbove ground, the town kept perfect cover. The lectures ran. The theater rehearsed. A quiet Rhodesian named Sandy Cole lent me his Dickens and marked his favorite passages in pencil, very faintly, as if raising his voice even on paper were bad manners.\n\nEverything wanted doing at once. That was the trade: you gave the tunnel your day, and it gave you back a reason to have one.`,
  choices:[
    { t:'Take a shift at the face — stripped to long johns in the yellow dark, filling boxes at the trolley head.',
      pre:'the digging', feet:12, heat:1, fx:(S,P)=>{ if(S.role==='digger'){S.feet=Math.min(336,S.feet+6);} dstreak(S,P); }, go:'n_brandt' },
    { t:'Walk sand. All day, every day — the kickabout, the theater line, the vegetable patch nobody questions.',
      pre:'penguin rounds', feet:8, fx:(S,P)=>{ if(S.role==='penguin'){S.heat=Math.max(0,S.heat-1);} dstreak(S,P); }, go:'n_brandt' },
    { t:'Stand stooge. Learn every ferret’s face, gait, and lunch hour; turn pages that empty tunnels in ninety seconds.',
      pre:'the duty pilot system', feet:6, fx:(S,P)=>{ if(S.role==='stooge'){S.heat=Math.max(0,S.heat-2);} dstreak(S,P); }, go:'n_brandt' },
    { t:'Run for Dean & Dawson — carrying photographs, inks, and the beginnings of your own future papers.',
      pre:'the travel agency', feet:4, kit:10, fx:(S,P)=>{ if(S.role==='agency'){S.kit=Math.min(100,S.kit+8);} dstreak(S,P); }, go:'n_brandt' },
  ]},

n_brandt:{ region:'trade', reg:'ache', title:'The Hook',
  text:(S,P)=>`Duke’s trade ran on tame goons, and the tamest was Brandt — a corporal with a soft face and a daughter in Hamburg whose photograph he showed anyone who held still. It began as it always began: real coffee, chocolate, sympathy about the war. Kindness as an investment. Then one afternoon Duke showed me the ledger he kept in his head: every gift Brandt had accepted, every regulation each one had quietly broken.\n\n“Now he fetches for us,” Duke said, not proudly. “A camera next. Maybe a wireless valve. He knows what happens if his sergeant learns the arithmetic, and I know he knows, and neither of us ever says it.” He looked at the photograph of the daughter, which Brandt had given him, because Brandt gave it to everyone.\n\n“Somebody has to hold the hook,” Duke said. “I’d rather it was somebody who hates it.”`,
  choices:[
    { t:'Take your turn on the hook. The firm needs the camera; feelings are a peacetime expense.',
      pre:'press it', kit:12, heat:1, fx:(S,P)=>{S.flags.hook='pressed'; logSee(P,'duke',2); logSee(P,'brandt',1);}, go:'n_theater' },
    { t:'Help Duke work Brandt — but keep the asks small, and keep the man fed. A hook can be held gently.',
      pre:'hold it gently', kit:6, fx:(S,P)=>{S.flags.hook='soft'; logSee(P,'duke',2); logSee(P,'brandt',1);}, go:'n_theater' },
    { t:'Refuse the duty. You will dig, walk, stooge — anything — but you will not farm a frightened man.',
      pre:'clean hands', crew:1, fx:(S,P)=>{S.flags.hook='refused'; logSee(P,'duke',2);}, go:'n_theater' },
    { t:'Ask Duke the question he is asking himself: what happens to Brandt when this is over? Watch him not answer.',
      fx:(S,P)=>{S.flags.hook='asked'; logSee(P,'duke',2); logSee(P,'brandt',1);}, go:'n_theater' },
  ]},

n_theater:{ region:'theater', reg:'lark', title:'Opening Night',
  text:(S,P)=>`The theater opened in the autumn with a drawing-room comedy, and I want it on the record that the set was better than the West End: three hundred Red Cross crates, planed, pegged, and painted, under lights made from klim tins. Six hundred men in pressed rags laughed at every joke twice — once for the joke, once for the fact of it.\n\nIn the interval I met the Welshman who painted the backdrops: Inky, of Dean & Dawson, whose day job was reproducing the Reich’s typefaces letter by letter with a sable brush. He held my programme at arm’s length to read it and made a joke about the only man in Germany ruining his eyes trying to read <em>less</em>. Doc Meredith stood at the back through the whole performance not watching the stage at all. He was watching the audience laugh, the way a man reads a barometer.\n\nAnd under the seats — though most of the house never knew it — Dick’s abandoned gallery was filling, night by night, with the yellow sand of Harry. The firm had built a theater on top of its own evidence. The applause covered the sound of the trap.`,
  choices:[
    { t:'Take a backstage job for the run. Every set change is cover for a shift change below.',
      pre:'stagecraft is camp craft', feet:8, crew:1, fx:(S,P)=>{ logSee(P,'inky',1); logSee(P,'doc',1); if(S.nv.hero>0)S.nv.hero--; }, go:'n_zabek' },
    { t:'Sit with {FRIEND} in the second row and laugh until your ribs hurt. Rations of the soul.',
      crew:2, fx:(S,P)=>{ logSee(P,'inky',1); logSee(P,'doc',1); if(S.nv.friend>0)S.nv.friend--; if(S.nv.hero>0)S.nv.hero--; }, go:'n_zabek' },
    { t:'Spend the interval with Inky and his arm’s-length programme. Ask about the brushwork, not the eyes.',
      pre:'meet the forger properly', kit:6, fx:(S,P)=>{ logSee(P,'inky',2); logSee(P,'doc',1); }, go:'n_zabek' },
    { t:'Stand at the back with Doc and read the barometer with him. Ask what he sees.',
      fx:(S,P)=>{ logSee(P,'doc',2); logSee(P,'inky',1); }, go:'n_zabek' },
  ]},

n_zabek:{ region:'tunnel', reg:'dread', title:'Thirty Feet Down',
  text:(S,P)=>`You go down the shaft at Hut 104 on a ladder of bed boards, past the pump room and the workshop chamber, and then you lie on a wheeled trolley and are hauled flat on your back up a passage two feet square, thirty feet under the ferrets, with a margarine lamp or — on good days — the electric string throwing your shadow along the boards. The air tastes of earth and warm men. The boards tick and settle over you like something deciding.\n\nAt the face I found the Tunnel King. Zabek dug the way other men pray — completely. In the halfway house, resting, he told me (because I was new at the face, and he told every new man; it was, I understood later, a gift) about the mine at sixteen: nine hours in a collapsed gallery in the dark, his cousin’s voice for the first six of them.\n\n“Every morning,” he said, “I wake, I am afraid of the tunnel. Every morning I choose. You understand? Good. Push the box.”`,
  choices:[
    { t:'Dig your shift beside him and match his rhythm. Fear answers to work.',
      pre:'push the box', feet:14, heat:1, fx:(S,P)=>{ logSee(P,'zabek',2); dstreak(S,P); }, go:'n_mics' },
    { t:'Ask him — carefully — why a man with his nine hours chooses the face every day. Hear all of it.',
      pre:'the nine hours', feet:8, fx:(S,P)=>{ logSee(P,'zabek',2); award(P,'ninehours'); }, go:'n_mics' },
    { t:'Learn the trolley run and the rope signals until you could do them in your sleep. Craft over courage.',
      feet:10, kit:4, fx:(S,P)=>{ logSee(P,'zabek',2); dstreak(S,P); }, go:'n_mics' },
    { t:'Do the shift, hate every foot of it, and go up gratefully. Some men are made for the sky, not under it.',
      feet:8, fx:(S,P)=>{ logSee(P,'zabek',2); S.flags.hatesbelow=1; }, go:'n_mics' },
  ]},

n_mics:{ region:'trade', reg:'dread', title:'The Listening Ground',
  text:(S,P)=>`The Germans had buried microphones along the wire — seismographs, wired to a hut where a bored man in headphones listened to the earth. We knew because they had told us, on purpose, the day the compound opened. What they had not said was how well the things worked, and so the firm treated the ground itself as an informer.\n\nAnd the ferrets were on us that autumn${S.heat>=6?' — on us like weather. Our huts were searched twice in a week; they took floorboards up in 110 and found a kit stash: clothes, a compass, forty hours of Inky’s eyes in confiscated stamps. The Weasel signed for it all like a man accepting a delivery he had ordered':''}. The Weasel crawled under huts with a torch in his teeth. He probed the vegetable patch with a steel rod, dryly, like a doctor who already knows what you have.\n\nDoctrine said: a ferret’s time is a fixed sum. Every hour he spends finding something you gave him is an hour he is not finding the trap under the stove.`,
  choices:[
    { t:'Serve the Weasel a decoy: a dummy tunnel mouth, three feet deep, seasoned with an old glove. Watch him spend two days on it.',
      pre:'two cigarettes at a time', heat:-3, fx:(S,P)=>{ logSee(P,'weasel',1); award(P,'twocigs'); if(S.heat>=6){S.kit=Math.max(0,S.kit-10);} }, go:'n_dearjohn' },
    { t:'Go quiet. A fortnight of nothing: no sand, no shifts, six hundred men conspicuously bored. Starve his suspicion.',
      pre:'the quiet week', heat:-2, feet:-4, fx:(S,P)=>{ logSee(P,'weasel',1); }, go:'n_dearjohn' },
    { t:'Push on regardless. Feet now, caution later — winter is coming and the pines are not getting closer on their own.',
      feet:12, heat:2, fx:(S,P)=>{ logSee(P,'weasel',1); dstreak(S,P); if(S.heat>=8){S.kit=Math.max(0,S.kit-10);} }, go:'n_dearjohn' },
    { t:'Study the man himself. Walk the circuit when he is under Hut 11; learn what he checks first and what bores him.',
      pre:'know your rival', heat:-1, kit:4, fx:(S,P)=>{ logSee(P,'weasel',2); }, go:'n_dearjohn' },
  ]},

n_dearjohn:{ region:'hut104', reg:'ache', title:'The Letter',
  text:(S,P)=>`Mail call was the compound’s weather. You could tell a man’s letter from across the hut by his shoulders.\n\n{FRIEND} got his on a Tuesday. Peggy’s hand on the envelope — he knew her envelopes at twenty feet, he had navigated by them for two years — and inside, four sentences. She was terribly sorry. He was so far away, and it had been so long, and nobody knew how long it would be. There was an American. She hoped he understood, and that he would not think badly of her, and she was, sincerely, his friend.\n\nHe read it twice, folded it along its creases, and said, “Well. That’s the mail sorted,” in a voice I had last heard over Essen, reading me a course through flak. Then he got up, walked to the window, and looked north at the pines for a very long time. The navigator who could find anywhere. I watched him lose the place he had been steering by.`,
  choices:[
    { t:'Go and stand at the window with him. Say nothing. Be a fixed point, all evening if it takes.',
      pre:'a fixed point', crew:2, fx:(S,P)=>{ S.nv.friend=1; logSee(P,'freddie',3); }, go:'n_hamburg' },
    { t:'Get the maps out that night — “Right. Plot me the route home via Stettin, for after.” Give the navigator a destination.',
      pre:'give him a course', crew:2, kit:4, fx:(S,P)=>{ S.nv.friend=1; logSee(P,'freddie',3); }, go:'n_hamburg' },
    { t:'Rage on his behalf. Peggy, the American, the sincerely-your-friend of it. Let him watch someone else carry the anger.',
      crew:1, fx:(S,P)=>{ S.nv.friend=2; logSee(P,'freddie',3); }, go:'n_hamburg' },
    { t:'Give him room. A man’s grief is his own kit; he’ll stow it his way. Keep his tea hot and his evenings occupied.',
      fx:(S,P)=>{ S.nv.friend=2; logSee(P,'freddie',3); }, go:'n_hamburg' },
  ]},

n_hamburg:{ region:'trade', reg:'ache', title:'The Telegram',
  text:(S,P)=>`In the last week of July the RAF and the USAAF burned Hamburg. We knew before the guards did — the BBC came in on the compound’s illegal wireless nightly, and the men who took the shorthand read it out hut by hut in the voices of men describing weather at sea. A firestorm. A word none of us had heard before and all of us understood immediately, professionally, from above.\n\nBrandt had a daughter in Hamburg. The whole compound knew that; he had shown the photograph to six hundred prisoners of war one at a time. For four days there was no word, and we watched a man in an enemy uniform walk his beat like a prisoner, and the camp — I record this with some pride in the species — the camp left him alone with it. No trades. No hook. Even Duke stood his pipeline down${S.flags.hook==='pressed'?', and did not look at me while he did it':''}.\n\nOn the fifth day a telegram came, and we watched him read it by the wire. Alive — the daughter was alive, in a schoolhouse outside Lübeck with her mother and nothing else. Brandt folded the telegram into his breast pocket, and stood still a long moment, and then went back to being a guard, except that something in the transaction between us and him had been permanently re-priced. ${S.flags.hook==='pressed'?'The camera sat under a floorboard in Hut 110. Some purchases do not stay paid for.':'“Same war,” Tiny said, watching him go, in the flattest voice I ever heard the big man use. “Same one. All of us in it.”'}`,
  choices:[
    { t:'Take him something on the quiet — the good chocolate, the real coffee — with nothing asked and no ledger entry. Not trade: condolence.',
      pre:'no ledger entry', fx:(S,P)=>{ logSee(P,'brandt',3); award(P,'kindness'); }, go:'n_tomfound' },
    { t:'Stand Duke his worst evening since enlistment: the scrounger drinking trade coffee and saying, over and over, “He fetches for us. He FETCHES for us.”',
      fx:(S,P)=>{ logSee(P,'brandt',3); logSee(P,'duke',3); }, go:'n_tomfound' },
    { t:'Say the professional thing to no one, once, out loud at the window: you have been over cities at night. Arithmetic has families in it.',
      fx:(S,P)=>{ logSee(P,'brandt',3); S.nv.hero=Math.max(S.nv.hero,1); }, go:'n_tomfound' },
    { t:'Write to Nell about none of it — the gate, the crocuses, ask about the squeaking latch — because some letters exist to hold a world where this page isn’t happening.',
      fx:(S,P)=>{ logSee(P,'brandt',3); S.nell=(S.nell||0)+1; }, go:'n_tomfound' },
  ]},

n_tomfound:{ region:'trade', reg:'dread', title:'Tom',
  text:(S,P)=>`In September they found Tom.\n\nNot cleverness, in the end — a probe went through, in the one afternoon in a hundred when the traffic was moving and the trap was open. The whistles went, the compound was counted and counted again, and then they marched us onto the square and kept us there while their engineer laid the charge. They wanted us to watch. That was the point of the parade.\n\nTom was a hundred and forty feet of shoring, of bed boards we had slept without, of a summer. It went up with a crump that shook sand from the hut eaves, and the Germans applauded themselves, and six hundred men stood at attention and watched a year die. Beside the crater the Weasel turned a piece of the shoring over in his hands, and I was near enough to hear him say, to no one, in his careful English: “Good work. Very good work.” He meant it. That was the terrible thing about the man.\n\nThat night the Magpie called the committee. I expected a wake. He stood by the fogged window with his tea and said: “Good. They think that was the best we had. Gentlemen — they’ve just proved this compound clean. Harry goes on. Slower, deeper, quieter. And nobody digs three.” He had already sacrificed Tom in his head, I understood then. Months ago. Perhaps before Tom was begun.`,
  choices:[
    { t:'Stand at attention and make yourself watch every second of it. The firm’s losses deserve witnesses.',
      pre:'witness it', fx:(S,P)=>{ S.heat=Math.max(0,S.heat-4); logSee(P,'weasel',2); award(P,'tomdick'); }, go:'n_winterhalt' },
    { t:'Catch the Weasel’s eye across the crater and give him the smallest nod. One craftsman to another. It costs you something.',
      pre:'one professional to another', fx:(S,P)=>{ S.heat=Math.max(0,S.heat-4); logSee(P,'weasel',2); S.flags.craft=(S.flags.craft||0)+1; award(P,'tomdick'); }, go:'n_winterhalt' },
    { t:'Watch the Magpie instead of the explosion. Learn what it looks like when a man spends a year like a coin.',
      fx:(S,P)=>{ S.heat=Math.max(0,S.heat-4); logSee(P,'magpie',2); award(P,'tomdick'); }, go:'n_winterhalt' },
    { t:'Find Tiny in the ranks and stand by him. The big man cries at the pictures; he should not stand alone at a funeral.',
      crew:1, fx:(S,P)=>{ S.heat=Math.max(0,S.heat-4); logSee(P,'tiny',2); award(P,'tomdick'); }, go:'n_winterhalt' },
  ]},

n_winterhalt:{ region:'winter', reg:'ache', title:'The Halt',
  text:(S,P)=>`In October the committee stopped Harry. Winter ground: sand dark with damp, dispersal impossible — yellow shows on snow like blood on a sheet — and the ferrets wintering indoors with nothing better to do than think. The trap was sealed under the stove, the stove was lit, and the firm hibernated on paper.\n\nThe camp shrank to the size of the cold. Rations thinned; the Red Cross parcels came late or not at all; a man learned to spend an afternoon on one page of a book. Sandy Cole gave me his Dickens outright in November — “I find I know it now,” he said, mild as ever — and spent his circuits looking at the pines in a way I did not yet have a name for.\n\nA letter came from Nell before Christmas. The garden gate again. The stuck latch her father would not oil because the squeak told him when she came home late. I read it until the creases went soft.`,
  choices:[
    { t:'Read Nell’s letter aloud to the hut at Christmas — the gate, the latch, the squeak. Give twelve men one garden between them.',
      pre:'rations of the soul', crew:1, fx:(S,P)=>{ S.nell=(S.nell||0)+1; if(S.nv.hero>0)S.nv.hero--; }, go:'n_sandy' },
    { t:'Donate your bunk boards to the shoring stockpile and sleep on string like half the compound already does.',
      pre:'the bed you gave the tunnel', fx:(S,P)=>{ S.flags.boards=1; award(P,'boards'); }, go:'n_sandy' },
    { t:'Winter with Dean & Dawson. Perfect your German script by lamplight; let Inky rest his eyes while you rule lines.',
      kit:14, fx:(S,P)=>{ logSee(P,'inky',2); S.nell=(S.nell||0)+1; }, go:'n_sandy' },
    { t:'Walk the circuit with Sandy Cole most afternoons. You have no name yet for how he looks at the pines, but walk anyway.',
      fx:(S,P)=>{ S.flags.walkedsandy=1; S.nell=(S.nell||0)+1; }, go:'n_sandy' },
  ]},

n_sandy:{ region:'winter', reg:'elegy', title:'The Warning Wire',
  text:(S,P)=>`${S.flags.walkedsandy?'All those laps, and I still did not see it coming. That is the thing I would tell her fifty years later with my hands flat on the tablecloth: you walk beside it every afternoon and you do not see it.':'Doc had a name for how Sandy looked at the pines. He kept a short list of men he was watching, and Sandy had been on it since the parcels stopped.'}\n\nIn February, at first light, Sandy Cole walked out of Hut 109 in his socks, crossed the warning wire as calmly as a man crossing his own garden, and went for the fence with his hands open. The tower did what towers do. We heard it from inside the hut — one burst, very loud in the cold, and then the particular silence of six hundred men all failing to have heard it.\n\nWire-happy, the old kriegies called it, the way you name a weather so it can’t be a person. Doc came to breakfast grey. “The tunnel,” he said to the Magpie, not quietly enough, “does not have to reach the trees. It has to reach June. Do you understand me, Edmund? It has to reach <em>June</em>.” It was years before I understood that as doctrine and not despair.`,
  choices:[
    { t:'Stand at the appell for him at attention, eyes on the tower, until they order the ranks dismissed.',
      pre:'stand for sandy', fx:(S,P)=>{ S.nv.hero=1; logSee(P,'doc',2); award(P,'sandyd'); }, go:'n_janrestart' },
    { t:'Write the letter. Someone who knew his Dickens should tell his mother something true and bearable, and the adjutant agrees.',
      pre:'something true and bearable', crew:1, fx:(S,P)=>{ S.nv.hero=1; logSee(P,'doc',2); award(P,'sandyd'); }, go:'n_janrestart' },
    { t:'Go to Doc’s list. Give him four names you are worried about and one of them, quietly, is your own.',
      pre:'the barometer', fx:(S,P)=>{ S.nv.hero=0; logSee(P,'doc',3); }, go:'n_janrestart' },
    { t:'Say nothing, feel nothing, stack the feeling with the others like sand under the theater. There is room. There is always room.',
      fx:(S,P)=>{ S.nv.hero=2; }, go:'n_janrestart' },
  ]},

n_janrestart:{ region:'winter', reg:'lark', title:'Harry Wakes',
  text:(S,P)=>`In January the order came down like spring itself: Harry goes on, flat out, finish by the thaw. The Magpie had done the arithmetic — the moonless nights of late March, the Reich rail timetable Inky was forging tickets against, the odds of another summer of ferrets — and the arithmetic said now.\n\nThe firm woke like a struck match.${S.flags.boards?' My boards went down the shaft the first week — I recognized the knots. A man sleeps better on string than you would think, knowing where his bed is spending the war.':''} Dispersal moved under the theater: seat by seat, row by row, Dick and the house of comedy swallowing Harry’s yellow by the hundredweight while the compound above applauded on cue.${S.heat>=7?'\n\nThe pace cost us. In February the ferrets hit Hut 104 at dawn — floor up, stove swung, probes down — and stood on the trap itself, on the warm concrete, and did not find it. We lost twelve feet of nerve and a week of traffic to caution. The Weasel left last, and at the door he looked back at the stove the way a man looks at a word he cannot quite remember.':''}\n\nBelow, Zabek drove the face north like a man with an appointment. A hundred feet out. Two hundred. The halfway houses got their names — Piccadilly, Leicester Square — because a thing you can joke about is a thing you can live inside.`,
  choices:[
    { t:'Give it everything. Double shifts at the face and the trolley ropes till your palms read like maps.',
      pre:'flat out', feet:30, heat:2, fx:(S,P)=>{ if(S.heat>=8){S.feet=Math.max(0,S.feet-8);} dstreak(S,P); }, go:'n_collapse' },
    { t:'Run the dispersal ballet under the theater. Sand in, seats down, curtain up — nightly, in rhythm, invisible.',
      pre:'the theater swallows it', feet:22, fx:(S,P)=>{ dstreak(S,P); if(S.role==='penguin'){S.heat=Math.max(0,S.heat-1);} }, go:'n_collapse' },
    { t:'Balance the books: feet when the ferret rota is thin, silence when it isn’t. The stooges call the tempo.',
      pre:'tempo by the watchers', feet:16, heat:-1, fx:(S,P)=>{ dstreak(S,P); }, go:'n_collapse' },
    { t:'You’ve been asked for by name at Dean & Dawson — the spring surge of papers. Two hundred men need to be Norwegian by March.',
      pre:'the paper front', feet:8, kit:16, fx:(S,P)=>{ logSee(P,'inky',2); }, go:'n_collapse' },
    { t:'A runner finds you at the cookhouse: you are wanted at the Kommandantur. By name. About “irregularities of trade.” Brandt’s day was Thursday; it is Thursday.',
      pre:'the hook pulls back', req:(S,P)=>S.flags.hook==='pressed' && S.heat>=2,
      go:'n_hook' },
  ], },

n_hook:{ region:'cooler', reg:'dread', title:'The Quiet Room',
  text:(S,P)=>`They came for me on a Thursday, which was Brandt’s day, and that told me everything before the first question: somewhere between the coffee and the camera, the arithmetic of the hook had come out of balance, and a frightened man had gone to his sergeant after all — with dates, and names, and mine among them.\n\nNot the cooler this time. A quiet room in the Kommandantur with a stenographer, a Luftwaffe security officer, and — in the corner, not speaking, which was worse — a civilian coat. The questions were patient and they were specific: the camera. The valve. The gifts, itemized. Who held the ledger.\n\nThe officer explained, courteously, that bribery of German personnel was not sport either. The coat in the corner looked at me the way a filing cabinet looks at a document.`,
  choices:[
    { t:'Give them a version: yes, gifts — chocolate for a homesick man, nothing more. Hold it through six hours and two sessions.',
      pre:'hold the line', heat:-4, crew:-1, fx:(S,P)=>{ S.cooler+=14; }, go:'n_336' },
    { t:'Pull the whole thing onto yourself. Your idea, your trades, no ledger, no Duke. Buy the firm out with your own account.',
      pre:'one name only: yours', heat:-5, fx:(S,P)=>{ S.cooler+=21; logSee(P,'duke',3); S.flags.tookhook=1; }, go:'n_336' },
    { t:'The Magpie’s prepared cover: a barrister’s alibi, dates that cannot be yours, a witness rota. Recite it and stick.',
      pre:'the firm defends its own', req:(S,P)=>S.contrib>=3, heat:-4, fx:(S,P)=>{ logSee(P,'magpie',2); }, go:'n_336' },
    { t:'Trade a scrap to end it: name the dead-letter drop they already know about. Watch the coat write it down anyway. Live with the entry.',
      pre:'the entry in the other ledger', heat:-6, fx:(S,P)=>{ S.flags.gavescrap=1; }, end:'e_hook' },
  ]},

n_collapse:{ region:'tunnel', reg:'dread', title:'The Fall',
  text:(S,P)=>`Two hundred and sixty feet out, in the wet week of February, Harry bit.\n\nA shoring frame shifted somewhere over the trolley run — a tick, then a groan, then a length of ceiling came down between Piccadilly and the face with a sound like a wave landing. The lamp went out. The air went thick. And from the wrong side of the fall, one knock. Then two.\n\n${S.role==='digger'?'I was on the near side. I want that recorded, fifty years on: I was on the near side, and the man on the far side was Zabek, and I have never moved sand like that before or since, on my knees, in the dark, by the sound of his knocking.':'They pulled men off every job in the compound within the minute — I came down the shaft with the second relay, and we passed boxes in the dark by touch, by voice, by the metronome of two knocks from the far side of the fall. It was Zabek. Of course it was Zabek.'}\n\nForty minutes. When his hand came through and took mine, he gripped it like a man completing a circuit, and when we had him out in Piccadilly he lay a moment, looked at the ceiling three inches from his nose, and said — I am quoting exactly — “Now it owes me twice.” He was at the face again the next morning. That is the whole of what I know about courage.`,
  choices:[
    { t:'Back down the ladder with him next morning. If the King returns to the face, the face crews return with him.',
      pre:'it owes him twice', feet:14, fx:(S,P)=>{ logSee(P,'zabek',2); dstreak(S,P); }, go:'n_336' },
    { t:'Rebuild the fallen frames yourself, double-thick, and check every joint from shaft to face over three nights.',
      pre:'never twice the same way', feet:8, kit:4, fx:(S,P)=>{ dstreak(S,P); }, go:'n_336' },
    { t:'Report to the committee that the pace is eating the margins — and be told, gently, that the margins are spent. March is fixed.',
      fx:(S,P)=>{ logSee(P,'magpie',2); S.flags.heardmargins=1; }, go:'n_336' },
    { t:'Admit — only to {FRIEND}, only at night — that you hear the fall now, every time the hut timbers tick in the cold.',
      crew:1, fx:(S,P)=>{ S.nv.hero=Math.max(S.nv.hero,1); }, go:'n_336' },
  ]},

n_336:{ region:'tunnel', reg:'lark', title:'Three Hundred and Thirty-Six',
  text:(S,P)=>`On the fourteenth of March, Zabek’s chalk line crossed the surveyed mark, and the firm performed its last miracle of engineering: it stopped. Three hundred and thirty-six feet from the stove in Hut 104, thirty feet down, to a point the survey team swore — by triangulation done from theater rooftops with instruments made of protractors and string — lay under the darkness of the pines. They dug upward to within two feet of the surface and framed a ceiling hatch, and left the world’s thinnest floor between the Reich and the biggest joke ever told at its expense.\n\nI rode the trolley the whole run that week — flat on my back, hauled through Piccadilly and Leicester Square, the electric string sliding past over my nose like a tide mark, all the way to the up-shaft, where you could put your palm against the cold ceiling and feel Germany two feet above your hand, unaware.\n\nA letter from Nell was waiting when I came up, as if the timing were a courtesy: crocuses at the garden gate. {FRIEND} looked at the envelope, then at me, and said, in his flak voice, “Course home’s plotted, then.” We were twenty-three years old, and the tunnel was finished, and for about one week that March, before the weather and the moon and everything after, I believe every man in that compound was, in a way I cannot explain to anyone who was not there, <em>happy</em>.`,
  choices:[
    { t:'Put your palm flat on the cold hatch ceiling and hold it there a moment. Two feet. After a year: two feet.',
      pre:'ride it to the far end', fx:(S,P)=>{ S.feet=336; award(P,'piccadilly'); S.nell=(S.nell||0)+1; }, go:'n_agency' },
    { t:'Come up and read Nell’s letter to {FRIEND} — crocuses, the gate — and let him re-plot the Stettin route out loud, alive again.',
      pre:'a course to steer by', crew:2, fx:(S,P)=>{ S.feet=336; if(S.nv.friend>0)S.nv.friend--; S.nell=(S.nell||0)+1; }, go:'n_agency' },
    { t:'Stand the face crews their cocoa ration and watch Zabek not celebrate. For him the tunnel is not finished; it is holding its breath.',
      fx:(S,P)=>{ S.feet=336; logSee(P,'zabek',2); }, go:'n_agency' },
    { t:'Find the Magpie at the fogged window, already three problems ahead — weather, moon, timetables — and take the fourth problem off his desk unasked.',
      pre:'the machine turns to the night', fx:(S,P)=>{ S.feet=336; S.contrib++; logSee(P,'magpie',2); }, go:'n_agency' },
  ]},

/* ======================================================================
   ACT III — THE ORDER (March 1944)
   ====================================================================== */

n_agency:{ region:'agency', reg:'dread', title:'Dean & Dawson, Working Nights',
  text:(S,P)=>`The papers were dated. That is the detail people never believe: the forged travel permits carried dates, because real ones did, and so the moment Inky’s team inked them the escape had a deadline with the Reich’s own stamp on it. The moon tables said the window was the night of the twenty-fourth. After that, the dates went stale and two hundred identities died on the shelf.\n\nDean & Dawson ran around the clock behind blanket-screened windows: typefaces painted letter by letter; rubber stamps carved from boot heels; photographs taken with the camera the hook had bought, in a corner dressed as a Reich photo studio, against a blanket the exact grey of bureaucracy. Inky worked with his nose four inches off the nib, and when he finally sat back from my own papers — Flight Lieutenant to Norwegian draughtsman in eleven documents — he pressed the heels of his hands into his eyes and held them there, and said, cheerful as ever, slightly muffled: “There you are, boyo. Try not to sweat on Norway.”\n\nEvery man out of the hole would carry hours of that man’s sight in his breast pocket. Most of us never worked out how to thank him. I am not sure I ever heard anyone try; the vocabulary of the place ran to jokes or nothing.`,
  choices:[
    { t:'Sit for your photograph, learn your Norwegian name until it answers before your own, and drill the cover story against {FRIEND}’s cross-examination.',
      pre:'become the paper man', kit:18, fx:(S,P)=>{ logSee(P,'inky',2); if(S.kit>=80) award(P,'deandawson'); }, go:'n_purge' },
    { t:'Rule lines, mix inks, carve a boot-heel eagle — give the Agency your steady hand for the last week and rest Inky’s eyes an hour a night.',
      pre:'lend him your eyes', kit:12, fx:(S,P)=>{ logSee(P,'inky',2); S.contrib++; if(S.kit>=80) award(P,'deandawson'); }, go:'n_purge' },
    { t:'Run the tailor line instead: greatcoats down to civilian cut, buttons recast, RAF blue dyed with beetroot and boot polish.',
      kit:14, fx:(S,P)=>{ if(S.kit>=80) award(P,'deandawson'); }, go:'n_purge' },
    { t:'Learn the rail timetable by heart — Sagan, Breslau, Stettin, the 01:04, the 03:15 — until {FRIEND} says you could work the ticket window.',
      kit:12, crew:1, fx:(S,P)=>{ if(S.kit>=80) award(P,'deandawson'); }, go:'n_purge' },
  ]},

n_purge:{ region:'trade', reg:'ache', title:'The Purge',
  text:(S,P)=>`Ten days before the moon, the Germans played a card nobody had dealt them. A purge: nineteen names, read out at morning appell, to be transferred to the compound at Belaria — suspected organizers, chosen by some ferret arithmetic of their own. No appeal, one hour to pack.\n\nZabek’s name was ninth.\n\nHe packed his kit in six minutes and spent the rest of the hour at the stove in 104, not lifting the trap — the ferret escort was in the doorway — just standing where it was, warming his hands, saying goodbye to it in Polish inside his head, I suppose. The man who had dug every foot of Harry, who had been buried twice for it, would not be going down it. At the gate he shook my hand with the grip from under the fall of sand, that same completing-a-circuit grip, and said: “Ride it to the end for me. And when you are in the trees — walk, don’t run. Miners’ rule: hurry is what kills.” Then the truck.\n\nThe compound was very quiet that day. The tunnel was suddenly full of a man who would never be in it.`,
  choices:[
    { t:'Promise him — out loud, in front of the escort, in plain English — that Harry will be ridden to the end. Let the Germans hear a promise they can’t parse.',
      pre:'the promise at the gate', fx:(S,P)=>{ logSee(P,'zabek',3); }, go:'n_lottery' },
    { t:'Give him Sandy’s Dickens for the truck. He has nine hours of dark in his account; he should have something for the journeys.',
      pre:'something for the journeys', crew:1, fx:(S,P)=>{ logSee(P,'zabek',3); }, go:'n_lottery' },
    { t:'Ask the Magpie afterward if the purge list means an informer. Watch the question hit a man who has already asked it of himself all morning.',
      fx:(S,P)=>{ logSee(P,'zabek',3); logSee(P,'magpie',2); S.flags.askedinformer=1; }, go:'n_lottery' },
    { t:'Take a face shift that night in his honor and dig nothing — the tunnel is done — just crawl to the end and touch the hatch frame he built.',
      fx:(S,P)=>{ logSee(P,'zabek',3); if(S.nv.hero>0)S.nv.hero--; }, go:'n_lottery' },
  ]},

n_lottery:{ region:'lottery', reg:'dread', title:'The Draw',
  text:(S,P)=>{
    drawNums(S);
    const committee = S.contrib>=4 || S.role==='digger';
    return `Two hundred places. That was the committee’s ruling — two hundred men out of Harry in one night, if the schedule held. The first thirty places went by right: the men whose work had earned it and whose German could survive a station check. The rest went into a wash-basin at the theater, on folded slips, and were drawn one by one in front of six hundred men in a silence you could have shored a tunnel with.\n\n${committee?`My name was read in the first thirty — number ${S.num}. Earned, the committee said. I have spent fifty years deciding whether to believe them.`:`My slip came out of the basin at number ${S.num}. You did the arithmetic instantly, everyone did: ten men an hour, out by dawn — number ${S.num} was a maybe. A good maybe, men said around me, meaning a bad one.`}\n\nAnd {FRIEND} — the man who had drawn every map in every breast pocket in that theater — {FRIEND} drew one hundred and four.\n\nHe laughed. That was the worst of it. He looked at the slip and laughed his real laugh and said, “Well — always liked the hut better anyway,” and across that theater I watched thirty men who owed their route sketches to him not meet his eye. The navigator had drawn everyone’s way out but his own.`;
  },
  choices:[
    { t:'Say nothing, tonight. A theater is no place for the conversation you can both feel coming.',
      fx:(S,P)=>{ drawNums(S); if(S.num<=30) award(P,'draw'); }, go:'n_knife' },
    { t:'Walk him home the long way round the circuit, talking rail timetables as if numbers were just numbers.',
      crew:1, fx:(S,P)=>{ drawNums(S); if(S.num<=30) award(P,'draw'); }, go:'n_knife' },
    { t:'Go to the committee about his number. Be told what you already know: the draw is the draw, or none of it holds.',
      fx:(S,P)=>{ drawNums(S); if(S.num<=30) award(P,'draw'); S.flags.askedcommittee=1; logSee(P,'magpie',2); }, go:'n_knife' },
    { t:'Look at your own slip a long time in your bunk, doing a different arithmetic — the one with two numbers in it.',
      fx:(S,P)=>{ drawNums(S); if(S.num<=30) award(P,'draw'); S.flags.didknifemath=1; }, go:'n_knife' },
  ]},

n_knife:{ region:'hut104', reg:'elegy', title:'One Place Between Us',
  text:(S,P)=>`The night of the twenty-third, the hut pretended to sleep and nobody managed it. Somewhere down the block a man was saying his Norwegian name over and over, softly, like a rosary. And on the bunk above mine the navigator of G-George lay with his hands behind his head, and we had the conversation at last, in the dark, in the voices we used over Essen.\n\nHere is the whole arithmetic, as it stood at midnight: my number ${S.num<=30?'was '+S.num+' — out in the first hours, while the schedule still held':'was '+S.num+' — a maybe, but a live one'}. His was a hundred and four — dawn at best, and both of us knew the schedule would not hold; schedules never held; he was a navigator, he could read a timetable against a headwind better than any man in Silesia.\n\n“You’ll want to say something noble,” he said to the bunk boards above him. “I can hear you loading it. Don’t.”\n\nI had one thing he did not have: a number worth having. He had one thing I did not have: nothing, anymore, to go home to — and a man with nothing to go home to, {FRIEND} said into the dark, quite calmly, travels light. We were both lying about something. That is what the knife was made of.`,
  choices:[
    { t:'Give him your number. Say it plainly: the crew gets its navigator home, and you can live at a hundred and four — you have Nell to wait for and he has a route to fly.',
      pre:'the given place', fx:(S,P)=>{ S.flags.knife='given'; logSee(P,'freddie',3); }, go:'n_night1' },
    { t:'Keep your number. Hate it, argue yourself hoarse inside your own head, and keep it — and let him be the one who tells YOU it’s right.',
      pre:'the kept place', fx:(S,P)=>{ S.flags.knife='kept'; logSee(P,'freddie',3); }, go:'n_night1' },
    { t:'The pact. Numbers stand as drawn — and whoever is out first waits at the Stettin dock, the Swedish boats, seventy-two hours. The crew reassembles at the coast. Shake on it.',
      pre:'the crew flies together', req:(S,P)=>S.crew>=5, fx:(S,P)=>{ S.flags.knife='pact'; logSee(P,'freddie',3); award(P,'pact'); },
      go:'n_night1' },
    { t:'Offer the swap and let HIM choose. Put both slips on the blanket between you and turn your back on them until he’s done.',
      pre:'his call to make', fx:(S,P)=>{ S.flags.knife = (S.crew>=4 ? 'kept' : 'given'); S.flags.hechose=1; logSee(P,'freddie',3); },
      go:'n_night1' },
  ]},

n_night1:{ region:'night', reg:'dread', title:'The Trap Is Frozen',
  text:(S,P)=>`The twenty-fourth was moonless and iron-cold, with old snow crusted under the pines. By half past eight, Hut 104 held two hundred men who were not supposed to be in it, dressed as Norwegian draughtsmen and French laborers and Danish margarine salesmen, all sitting very still on other men’s bunks with their papers in their breast pockets, sweating in the cold.\n\nAt nine, the trap would not open.\n\nThe winter had swollen the boards and frozen the frame fast, and the men whose job it was knelt over it with fingers and fat-lamp heat and improvised chisels for ninety minutes — ninety minutes, two hundred sets of papers going damp against two hundred hearts — while the schedule died before a single man had gone down the ladder. When it finally gave, with a crack like a rifle that stopped every breath in the hut, the Magpie looked at his watch, and I watched him re-do the night’s arithmetic in four seconds and go on giving orders with the loss already folded in. Ten a minute had been the plan. It was ten o’clock, and no one was in the tunnel yet.`,
  choices:[
    { t:'Hold your corner of the hut steady: quiet card games, quiet jokes, two hundred heartbeats kept at conversational volume.',
      pre:'steady the room', fx:(S,P)=>{ if(S.nv.hero>0)S.nv.hero--; }, go:'n_night2' },
    { t:'Kneel over the trap with the chisel crew and pass your turn at the frozen frame — fingers first, pride nowhere.',
      pre:'work the frame', fx:(S,P)=>{ S.flags.workedtrap=1; }, go:'n_night2' },
    { t:'Sit with {FRIEND} against the end wall and go over the Stettin timetable one last time, both of you word-perfect, neither stopping.',
      crew:1, go:'n_night2' },
    { t:'Watch the Magpie fold ninety minutes of dead schedule into his plan without blinking, and learn the last thing he had to teach: composure is a decision.',
      fx:(S,P)=>{ logSee(P,'magpie',2); }, go:'n_night2' },
  ]},

n_night2:{ region:'hole', reg:'dread', title:'Ten Feet Short',
  text:(S,P)=>`The first man up the far shaft broke the thinnest floor in the world at half past ten, pushed his head into the night air of freedom — and found sky where there should have been branches.\n\nThe tunnel was short. All that survey, the protractors and string and rooftop triangulation, and Harry’s mouth had opened ten feet shy of the treeline: in the open, in the snow, in plain sight of the goon tower fifty yards south, its searchlight swinging its slow indifferent arc across the very crust of it. A year of digging, and the last ten feet were the ones we hadn’t dug. There, in the hole, in the dark, the night was nearly lost — and then it was saved by a length of rope and a man who refused to panic: rope from the ladder to a blind behind the nearest pine, a signalman lying in the needles with the end wrapped round his wrist. One tug: wait. Two tugs: come now, crawl low, the beam is past.\n\nThe schedule, already crippled, went to walking pace: one man at a time, waiting on a rope’s judgment, seventy-two seconds of open snow between the Reich and the trees. In Hut 104 the numbers crept upward through the dark like a tide against a harbor wall — and every man in that hut could do the sum of tide against dawn.`,
  choices:[
    { t:'Volunteer down the tunnel to work the relay at the up-shaft — the man who whispers “now” at the ladder’s foot all night.',
      pre:'work the rope', fx:(S,P)=>{ S.flags.workedrope=1; award(P,'rope'); }, go:'n_night3' },
    { t:'Keep the hut’s ledger with the controllers: numbers down the shaft, numbers through, the terrible falling average.',
      pre:'keep the count', fx:(S,P)=>{ S.flags.keptcount=1; }, go:'n_night3' },
    { t:'Sit against the wall with your eyes shut, riding the tunnel in your head — Piccadilly, Leicester Square, the cold hatch — until your number is real.',
      go:'n_night3' },
    { t:'Find Tiny — going out at sixty-one, the biggest man ever posted through a two-foot pipe — and straighten his civilian collar like a valet. Leave him laughing.',
      pre:'leave him laughing', crew:1, fx:(S,P)=>{ logSee(P,'tiny',2); }, go:'n_night3' },
  ]},

n_night3:{ region:'night', reg:'dread', title:'The Lights Go Out',
  text:(S,P)=>`Past midnight, the sirens started — Berlin was catching it, a hundred miles north — and the Reich did what the Reich did in a raid: it turned off the world. Every light in the camp died, tower beams included. And every light in Harry died with them, because Harry ran off the camp mains, and Harry was at that moment full of men.\n\nFat lamps went down the line hand to hand. In the dark of the hut, we could hear the raid breathing far away to the north, and men counted between flashes as if it were weather. A blackout was cover — the best cover of the night, men out under a dead searchlight — and a blackout was also a tunnel full of crawling men whose lamps had died at thirty feet down, and both things were true at once, which is the entire war in one sentence.\n\nThen, somewhere past two, the worst sound of the night: a soft distant slump through the floor of 104. A fall of sand, somewhere down the line, with the traffic in it. The rope-and-box men cleared it in the dark by hand — I heard afterward it cost forty minutes and two men’s nerve, one of whom went up the ladder home to his bunk and I have never once judged him.`,
  choices:[
    { t:'Whatever your number, go down and haul boxes at the fall until the line is clear. The tunnel does not care whose turn it is.',
      pre:'clear the fall', fx:(S,P)=>{ S.flags.clearedfall=1; }, go:'n_night4' },
    { t:'Hold {FRIEND}’s shoulder in the dark of the hut one moment — no words, the fixed point returned — before the numbers separate you.',
      crew:1, go:'n_night4' },
    { t:'Stand at the window watching the dead searchlight, doing the new arithmetic: dark tower, slow tunnel, pale east. Say none of it aloud.',
      go:'n_night4' },
    { t:'Pray, actually pray, for the first time since the fire over Essen, in the language of the multiplication table: ten a minute, four an hour, dawn at six.',
      go:'n_night4' },
  ]},

n_night4:{ region:'hole', reg:'dread', title:'What the Numbers Did',
  text:(S,P)=>{
    const eff = S.flags.knife==='given' ? 104 : S.num;
    const out30 = eff<=30, out76 = eff>30 && eff<=76;
    return `${S.flags.knife==='given'?`{FRIEND} went down the ladder at half past one, wearing my number and my blessing and the collar I had straightened. At the trap he turned and gave me the thumbs-up we used at take-off, twenty-two ops’ worth of it in one gesture, and then the tunnel took him. I stood at the stove like a man seeing an aircraft off, which is what I was.\n\nMy own night was the hundred-and-fourth man’s night: the hut, the window, the count.`:''}${S.flags.knife==='kept'?`My number came and I went — past {FRIEND} at the end wall, who took my hand in both of his and said, “Steer small, skipper. See you when it’s over.” I have replayed the grip of his hands more times than any other second of my life.\n\n`:''}${S.flags.knife==='pact'?`The pact stood: numbers as drawn, the dock at Stettin, seventy-two hours. He repeated it back to me at the end wall like a course heading — dock, boats, seventy-two — and grinned his real grin, and the numbers took us to our separate stations.\n\n`:''}${out30?`Down the shaft. Along Harry flat on the trolley in the fat-lamp dark, the year of my life sliding past three inches over my face — Piccadilly, Leicester Square, the fall scar — to the foot of the ladder, the cold draught of open Germany pouring down it. The rope lay along the snow like a nerve. Two tugs came. And then I did the ten hardest feet of the war on my forearms in open snow under a dead searchlight, and the pines took me, and I stood up in the free dark of the Reich a Norwegian draughtsman with a heartbeat like a Merlin.`:''}${out76?`My number went down the ladder as the east was going grey. Too late — every man in the hut knew it was too late, and we went anyway, because the alternative was to have not gone. I made the trees at first light with the four ahead of me, the woods already stiffening around us like something waking, torches away east where the first of us had crossed a road unwisely.`:''}${!out30&&!out76?`The count reached seventy-six as the east went grey. Number seventy-seven was on the ladder — I could see the hut controller holding the list, deciding whether dawn could be argued with — when the shot came.\n\nOne rifle shot, flat across the snow, from the treeline. A guard, wandered off his beat to the edge of the pines, at the wrong place at exactly the wrong moment, staring at a hole in the ground with men in it.\n\nWhat followed in 104 was the fastest, quietest catastrophe I ever saw: papers into stoves, civilian coats under floorboards, two hundred Norwegian draughtsmen becoming British officers asleep in the wrong hut. The trap swallowed the ladder party back up; the stove went over the closed trap warm as innocence. Outside, whistles. Dogs. The night was over. Seventy-six men were somewhere out there in the snow, and the rest of us stood at the windows of the Reich’s escape-proof camp listening to it discover what six hundred men can do with bed boards and a wash-basin lottery.`:''}`;
  },
  choices:[
    { t:'North, alone, by rail: Sagan station in the small hours, papers warm against your chest. The 03:15 to Frankfurt-an-der-Oder, then Stettin.',
      pre:'the train', req:(S,P)=>(S.flags.knife==='given'?104:S.num)<=30, fx:(S,P)=>{ S.flags.road='train'; }, go:'n_station' },
    { t:'South on foot — hard-arser through the snow toward Czechoslovakia, walking by Zabek’s rule: hurry is what kills.',
      pre:'the long walk', req:(S,P)=>(S.flags.knife==='given'?104:S.num)<=30, fx:(S,P)=>{ S.flags.road='walk'; }, go:'n_walk' },
    { t:'Make for the woods’ edge and lie up till the first sweep passes — then move, in a wood already filling with torches and dogs.',
      pre:'the sweep', req:(S,P)=>{const e=(S.flags.knife==='given'?104:S.num); return e>30&&e<=76;}, fx:(S,P)=>{ S.flags.road='swept'; }, go:'n_sweep' },
    { t:'Stay at the window as the whistles close in, holding the count in your head like a prayer: seventy-six out. Seventy-six.',
      pre:'the window', req:(S,P)=>(S.flags.knife==='given'?104:S.num)>76, go:'n_count' },
    { t:'Tell it the other way tonight — the way it goes when you are the seventy-seventh man, on the ladder, when the shot comes down the tunnel mouth like weather.',
      pre:'the arithmetic he still does at 3 a.m.', req:(S,P)=>(S.flags.knife==='given'?104:S.num)>76, end:'e_man77' },
  ]},

/* ======================================================================
   ACT IV — THE LIST AND THE GARDEN
   ====================================================================== */

n_station:{ region:'station', reg:'dread', title:'The 03:15',
  text:(S,P)=>`Sagan station at three in the morning was the loneliest lit place in the Reich: one lamp, one stove, one clerk — and, that night, a remarkable number of gentlemen travelling early. I recognized four of them and greeted none. We stood about the little booking hall like strangers, a Norwegian draughtsman, two French laborers, and a Danish margarine man, all of us listening with our skins.\n\nThe check came before the train did. Feldgendarmerie — two of them, torch and clipboard, working the hall bench by bench with the unhurried thoroughness of men who own the night. My papers were four months of Inky’s eyes: the permit, the workbook, the letter from a Breslau firm that did not exist on any map but would survive a telephone call to a number Dean & Dawson had chosen because it was permanently engaged.\n\nThe torch reached me. “Papiere, bitte.” Somewhere north, the 03:15 announced itself down the cold rails, right on the timetable {FRIEND} had made me learn until I could work the ticket window.`,
  choices:[
    { t:'Be the paper man. Bored, half-asleep, faintly put-upon — hand them over mid-yawn and check your watch against the arriving train.',
      pre:'norway holds', req:(S,P)=>S.kit>=75, fx:(S,P)=>{}, go:'n_docks' },
    { t:'Your German is thinner than your papers. Cough your way through it, a workman with a chest, gesturing at the timetable — and pray the torch is tired.',
      req:(S,P)=>S.kit>=60 && S.kit<75, fx:(S,P)=>{ S.flags.thinice=1; }, go:'n_walk' },
    { t:'The torch stops on the photograph too long. It is over — put your hands out from your body slowly, and say, in English, “Royal Air Force,” before anyone’s rifle decides otherwise.',
      pre:'taken at the lamp', req:(S,P)=>S.kit<60, fx:(S,P)=>{ S.flags.takenstation=1; }, go:'n_sweep' },
    { t:'Tell it the other way tonight — the platform, the shout, the running man in the lamplight, and the men in the OTHER uniform who were waiting at the end of it.',
      pre:'the version with the coats', end:'e_uniform' },
  ]},

n_walk:{ region:'walk', reg:'ache', title:'Hard-Arser',
  text:(S,P)=>`${S.flags.road==='walk'?'I went south on foot from the pines themselves, by Zabek’s rule: walk, don’t run.':'The train was ash; the walking remained. South, then, by Zabek’s rule: walk, don’t run.'} Snow to the shins in the woods, roads only at night, steering by {FRIEND}’s silk map and a razor-blade compass that swung like a drunk but told the truth on average.\n\nI walked eleven nights. I ate what the kit held and then what the country did — a cellar of seed potatoes, a rabbit that made the mistake of being slow near a man who had been hungry since 1942. Twice a farm dog gave me away to nobody; once a woman saw me plainly across a field at dusk, looked at me a long moment, and went inside and did not raise the house. I have thought about her for fifty years.\n\nThe mountains came up out of the haze on the twelfth morning — the far wall of Bohemia, and beyond them, in my mind already, Switzerland: white, enormous, indifferent, and so beautiful I sat down in the snow and looked at them like a man in a gallery. That is where the two soldiers found me. Boys, both of them, more frightened than I was. The rifle shook. I put my hands up very slowly, and said the sentence I had saved: <em>Luft. Offizier.</em> And that was the walk.`,
  choices:[
    { t:'Say it plainly at the club, glass raised an inch: “I saw the mountains. I want that on the record.”',
      pre:'on the record', fx:(S,P)=>{}, end:'e_longwalk' },
    { t:'Tell her about the woman at the field’s edge who went inside and said nothing. The war was full of people who are not in the histories.',
      fx:(S,P)=>{ S.flags.toldwoman=1; }, end:'e_longwalk' },
    { t:'Count the miles for her on the tablecloth: eleven nights, one rabbit, two frightened boys. Best holiday of my life, in the only sense that matters: I chose every step of it.',
      fx:(S,P)=>{}, end:'e_longwalk' },
    { t:'Admit the other thing: that some nights on that road you were not walking to Switzerland at all. You were just walking away from the wire, and any direction would have done.',
      fx:(S,P)=>{}, end:'e_longwalk' },
  ]},

n_docks:{ region:'docks', reg:'dread', title:'The Baltic Water',
  text:(S,P)=>`Stettin smelled of coal smoke, salt, and neutrality. The Swedish ships lay along the free harbor like parked countries — one gangway, one bored sentry, one stretch of black water between the Reich and the rest of my life.\n\n${S.flags.knife==='pact'?'Seventy-two hours, the pact said. I found the dock, and the boats, and the coldest doorway in Pomerania, and I waited. I watched every figure that came out of the dark of the coal yards for three nights, and none of them walked like a navigator. He was at a hundred and four, and the schedule died at seventy-six, and I knew that — I had known it since the shot — and I waited every minute of the seventy-two hours anyway, because a pact is a pact, and because knowing a thing and believing it are different organs entirely.\n\nOn the third night ':'On the second night '}I went over the harbor fence at the blind corner a Danish stoker sold me for my watch, swam the last twenty feet because the tide said swim, and came up the anchor chain of a Göteborg coaler with my papers ruined and my lungs full of the Baltic and not one single regret available anywhere in my body. A Swedish bosun found me in the chain locker at dawn. He looked at me a long time. Then he brought me coffee with brandy in it and said, in English better than my German ever was: “You are the fourth this year. Welcome to Sweden, when we get there.”`,
  choices:[
    { t:'Stand in the bow as the coast of the Reich goes down into the sea, and find you cannot cheer. Seventy-five men are still out there in the snow tonight.',
      pre:'the fourth this year', fx:(S,P)=>{ award(P,'stockholm'); }, end:'e_needle' },
    { t:'Sleep, finally, whole nights of it, in a bunk that smells of Swedish soap — and dream, every night, of a tunnel two feet square, and wake up laughing.',
      fx:(S,P)=>{ award(P,'stockholm'); }, end:'e_needle' },
    { t:'Write two letters from Stockholm before England is even arranged: one to Nell about a garden gate. One to the camp, via the Red Cross, saying only: ARRIVED. TELL THE TRAVEL AGENCY THE PAPERS HELD.',
      pre:'tell dean & dawson', fx:(S,P)=>{ award(P,'stockholm'); S.flags.wroteback=1; }, end:'e_needle' },
    { t:'Stand at the rail with the bosun’s coffee and say Zabek’s names for the halfway houses out loud to the open sea — Piccadilly. Leicester Square. Let the wind have them.',
      fx:(S,P)=>{ award(P,'stockholm'); }, end:'e_needle' },
  ]},

n_sweep:{ region:'walk', reg:'dread', title:'The Woods Full of Torches',
  text:(S,P)=>`${S.flags.takenstation?'They walked me out of the booking hall as the 03:15 came and went without me.':'The woods filled up with the Reich by mid-morning: soldiers in lines beating the brush, dogs on long leads, whistles talking to whistles across the plantations.'} The countryside had been turned out of bed — Landwacht men with shotguns and armbands, boys on bicycles, the whole apparatus of a state having its nose publicly tweaked. I was taken ${S.flags.takenstation?'at a lamp with false papers':'in a forestry hut, asleep in the woodpile'}, by men who were, I must record, correct with me — angry in the way of embarrassed institutions, but correct.\n\nWhat I remember is the drive back: the staff car crested the Sagan road and there was the camp below in the winter light, wire and towers and huts, and I looked down at it and felt — God forgive me — something adjacent to homecoming, and hated the feeling all the way down the hill.\n\nAt the gate, the count of the recaptured stood at forty and climbing. They processed us with strange gentleness. It was only later we understood: the Luftwaffe men at that gate already knew what the other uniform was doing with the men it processed, and were ashamed.`,
  choices:[
    { t:'Give the cooler your twenty-eight days like a gentleman: name, rank, number, and a request for something to read.',
      pre:'twenty-eight days of quiet', fx:(S,P)=>{ S.cooler+=28; }, go:'n_cooler28' },
    { t:'Ask the sergeant at the gate — carefully, man to man — how many are still out. Watch him decide to tell you: “More than thirty, Herr Oberleutnant.” Feel the whole cooler block breathe it in.',
      fx:(S,P)=>{ S.cooler+=28; S.flags.heardcount=1; }, go:'n_cooler28' },
    { t:'Go through the gate with your chin up for the benefit of the six hundred faces at the wire, and produce, from somewhere, a wink for Tiny. The camp must see that coming back is survivable.',
      pre:'for the faces at the wire', crew:1, fx:(S,P)=>{ S.cooler+=28; }, go:'n_cooler28' },
    { t:'Tell it the other way tonight — the sweep where the men who find you in the woodpile are not soldiers with shotguns but the coats. Where the staff car does not turn toward Sagan at the crossroads.',
      pre:'the version with the crossroads', end:'e_uniform' },
  ]},

n_cooler28:{ region:'cooler', reg:'ache', title:'Twenty-Eight Days',
  text:(S,P)=>`The cooler was standing room only that spring — the recaptured queued for cells like a popular hotel, and the Germans, out of some bureaucratic decency I never understood, honored the queue. I did my twenty-eight days on bread, soup, and the window bar’s shadow crossing the floor, which by then I could read like a sundial.\n\nTally marks on the wall from every guest before me. I added mine and dated them. A man learns things in the fourth week that the first week hides: that solitude has a floor under it, if you have people to think about. I thought about {FRIEND}${S.flags.knife==='given'?', out there somewhere north with my number in his pocket':''}. I thought about Inky’s eyes and the Magpie’s watch and Zabek’s rule and the woman at the field’s edge who went inside and said nothing.\n\nOn the twenty-ninth morning they gave me back my braces and my bootlaces and walked me into the compound, and I knew before the gate opened that the town I was returning to was not the one I had left. It was too quiet. Six hundred men, and the circuit nearly empty, and no cricket, and Tiny — Tiny saw me from the door of 104 and did not joke. He put his hand on my shoulder like a man closing a door gently, and said: “There’s a list gone up, boyo. By the cookhouse. You’ll want to not be alone when you read it, so you’re not going to be.”`,
  choices:[
    { t:'Go to the cookhouse wall now, with Tiny’s hand on your shoulder.',
      pre:'the list', fx:(S,P)=>{ S.flags.wasout=1; }, go:'n_count' },
    { t:'Ask him first — just the one name, {FRIEND}’s — and read the answer in the two seconds before he speaks.',
      crew:1, fx:(S,P)=>{ S.flags.wasout=1; S.flags.askedfirst=1; }, go:'n_count' },
    { t:'Stop at Hut 104 first. Touch the stove, which is warm, and burning, and sitting on a sealed trap like a headstone.',
      fx:(S,P)=>{ S.flags.wasout=1; }, go:'n_count' },
    { t:'Make him say the number still unaccounted for before you take a step. Hold onto it the way you held the count at the window: like a prayer with digits.',
      fx:(S,P)=>{ S.flags.wasout=1; }, go:'n_count' },
  ]},

n_count:{ region:'order', reg:'dread', title:'The Appell That Would Not Add',
  text:(S,P)=>`${S.flags.wasout?'They told me how it had gone at the camp while I was on the roads, so that the telling could be whole.\n\n':''}The morning after the night, the Germans counted us, and the parade square became a theater of pure arithmetic. Count, gap, recount. Officers with clipboards walking the ranks like men looking for a mislaid century. The number would not come right because the number was seventy-six men wrong, and when that figure finally stood up out of the sums and looked the Kommandantur in the face, the camp — I want this recorded — the camp did not cheer. We stood at attention in the cold and watched the enemy understand, and the discipline of our silence was louder than any cheer ever managed.\n\nVon Reyter came out to the square himself. He looked down the ranks a long time. He was an old airman; some of the men he had just lost to the winter roads he had personally protected from worse for two years, and I believe — I believed it then, watching his face — that he knew, before Berlin said a word, exactly what his telephone was about to become. Within the week he was relieved of command, under arrest, bound for a court-martial for the crime of having run a prison camp like a soldier of the old school and not a jailer of the new one.\n\nThe roof came off the world quietly, the way roofs do.`,
  choices:[
    { t:'Watch the old man walk back across his parade square alone, and — against every regulation of two armies — come to attention as he passes your rank.',
      pre:'a roof, acknowledged', fx:(S,P)=>{ logSee(P,'reyter',3); }, go:'n_list' },
    { t:'Note the new Kommandant’s face at the gate: a jailer of the new school, arriving into six hundred men’s silence like a man taking over a debt.',
      fx:(S,P)=>{ logSee(P,'reyter',3); }, go:'n_list' },
    { t:'Hold the only number that matters through all the counting: seventy-six out. Whatever else this morning is, it is also that.',
      fx:(S,P)=>{ logSee(P,'reyter',3); }, go:'n_list' },
    { t:'Catch the Weasel’s face during the recounts. He is not triumphant. He is doing the same arithmetic as the old Kommandant, one professional to another, and arriving at the same fear.',
      fx:(S,P)=>{ logSee(P,'reyter',3); logSee(P,'weasel',2); }, go:'n_list' },
  ]},

n_list:{ region:'list', reg:'elegy', title:'The List',
  text:(S,P)=>`It went up under the eagle by the cookhouse door, typed, no explanation. Forty-one names.\n\nWe stood in the cold and read it top to bottom, and nobody said anything, because every man was doing the same arithmetic: forty-one is not seventy-three, and the list had room at the bottom. It grew all that week. It stopped at fifty.\n\n“Shot while resisting recapture,” the notice said, and “shot attempting further escape,” and other sentences of that species, and no bodies came back to prove any of it — only, later, urns. Fifty officers. The Magpie’s name was ninth on the first posting; he had gone out third, with his third escape and the Gestapo’s old promise waiting for him somewhere on a road in the dark. Inky’s name went up on the Thursday. The forger who went half-blind making other men’s freedom had used his own papers at last, and been taken at a station two hundred miles west, and the other uniform had him, and the sable brushes are still, as far as I know, in a tin in Hut 110.\n\n${S.flags.wasout?'I stood at that wall with men who had been in the woods beside me, whose names were separated from that typed column by nothing — by a crossroads, by which patrol, by nothing at all.':'We stood at that wall, the hundred-and-somethings, the men the schedule had saved, and learned what our numbers had actually been worth.'} Tiny read all fifty names without moving. Then the biggest and gentlest man in the compound went back to Hut 104 and did not joke — not that day, not that week. When the camp’s laugh stops, you can hear everything: the wind, the wire, the count.\n\nEscape is no longer a sport. The new administration posted that notice within the month. Nobody in the compound ever called it anything but what it was: a confession.`,
  choices:[
    { t:'Stand at the wall until you have read all fifty names as many times as it takes to believe them. Witness is a duty of the survivor.',
      pre:'read every name', fx:(S,P)=>{ logSee(P,'magpie',3); logSee(P,'inky',3); logSee(P,'duke',3); award(P,'silence'); S.nv.hero=Math.max(S.nv.hero,1); },
      go:(S,P)=>S.flags.knife==='given'?'n_freddieword':'n_memorial' },
    { t:'Find Duke — alive, coolered, back — standing at the wall looking for his own name in the place where it isn’t. Stand with him.',
      fx:(S,P)=>{ logSee(P,'magpie',3); logSee(P,'inky',3); logSee(P,'duke',3); award(P,'silence'); },
      go:(S,P)=>S.flags.knife==='given'?'n_freddieword':'n_memorial' },
    { t:'Go and sit with the sable brushes in the tin in Hut 110, because somebody should, and you are the one who watched him press his hands to his eyes.',
      fx:(S,P)=>{ logSee(P,'magpie',3); logSee(P,'inky',3); logSee(P,'duke',3); award(P,'silence'); S.nv.hero=Math.max(S.nv.hero,1); },
      go:(S,P)=>S.flags.knife==='given'?'n_freddieword':'n_memorial' },
    { t:'Say the Magpie’s arithmetic at the wall, quietly, to nobody: ten thousand Germans looking. Try, for the first time, to make it balance against a typed column — and fail, and keep the failure for fifty years.',
      fx:(S,P)=>{ logSee(P,'magpie',3); logSee(P,'inky',3); logSee(P,'duke',3); award(P,'silence'); S.flags.failedsum=1; },
      go:(S,P)=>S.flags.knife==='given'?'n_freddieword':'n_memorial' },
  ]},

n_freddieword:{ region:'list', reg:'elegy', title:'Word of the Navigator',
  text:(S,P)=>{
    const good = goodWord(S);
    return `He was not on the list. That was the first thing, the thing I checked with my heart in my mouth every posting of that terrible week: one hundred and four had gone down the ladder at half past one wearing my number, and his name — his real one — never appeared under the eagle.\n\nBut not on the list only meant: not dead where they admit to it. Seventy-three taken, fifty shot, fifteen returned to us, a handful scattered to other camps — and a remainder. For five weeks {FRIEND} was a remainder, and I lived at the cookhouse wall, and I am not able, even now, fifty years on, with her hand on my sleeve, to describe what that arithmetic does to a man who handed over the number that started it.\n\n${good?'Then, in May, the letter. Red Cross paper, Stockholm frank, four words in a navigator’s box-neat capitals, dated the week the list stopped growing:\n\n<em>ARRIVED. COURSE AS PLOTTED.</em>\n\nHe had done it — the docks, the coal harbor, a Swedish hold, the route he had drawn for two hundred other men run at last for himself, with my number and his own unanswerable skill. The second man home out of seventy-six. I sat down on the cookhouse step with the letter and I am told I laughed, and I am told it did not sound entirely like laughing.':'Then, in June, the other letter. Not Stockholm. A Red Cross form from a camp in the far south, another man’s handwriting doing {FRIEND}’s because — the form said it in a printed box, the Reich even has a box for it — <em>injury to the hands. Frostbite. Taken on the fourth night, in the mountains, on the long way south.</em>\n\nAlive. Alive, and wintered half to pieces, and in the wrong camp five hundred miles away, and not coming back to the bunk above mine. The navigator had flown my number as far as the weather let him. I read the form until the creases went soft, the way I had once read letters about a garden gate.'}`;
  },
  choices:[
    { t:'Fold the letter into your breast pocket, where the papers lived, and carry it to the end of the war and beyond. (Some documents outrank passports.)',
      pre:'the document that matters', fx:(S,P)=>{ if(goodWord(S)) award(P,'stockholm'); },
      end:(S,P)=>goodWord(S)?'e_given_stockholm':'e_given_list' },
    { t:'Read it aloud to Hut 104, because the compound needs the arithmetic to come out right for somebody, just once, out loud.',
      fx:(S,P)=>{ if(goodWord(S)) award(P,'stockholm'); },
      end:(S,P)=>goodWord(S)?'e_given_stockholm':'e_given_list' },
    { t:'Take it to the cookhouse wall and stand under the eagle holding it, a private posting of your own, facing the other one.',
      fx:(S,P)=>{ if(goodWord(S)) award(P,'stockholm'); },
      end:(S,P)=>goodWord(S)?'e_given_stockholm':'e_given_list' },
    { t:'Write back the only sentence that was ever true: YOUR NUMBER TOO. ALWAYS WAS.',
      fx:(S,P)=>{ if(goodWord(S)) award(P,'stockholm'); },
      end:(S,P)=>goodWord(S)?'e_given_stockholm':'e_given_list' },
  ]},

n_memorial:{ region:'vault', reg:'elegy', title:'The Vault in the Pines',
  text:(S,P)=>`The urns came back by rail, in ones and twos, over months — the other uniform’s bookkeeping, fifty small boxes where fifty men had been — and the new administration, in one of those corners of the war that no theory of humanity fully survives, gave the camp permission to build.\n\nSo we built. A working party of prisoners, under guard, down the Sagan road in the pines the tunnel had been aimed at all along: a memorial vault of stone and brick, designed by a kriegie who had been an architect in the other life, built by men who had been the Fifty’s friends. It stands there today. I have been back; it is tended; the Poles tend it. Fifty names cut clean into stone that came out of the same Silesian ground as the yellow sand.\n\nThe Weasel came to the dedication. In parade uniform, unarmed, at the back, one craftsman paying respects at the work of others. Whatever the two years between us had been — probes, decoys, dummy tunnels, the whole long game — it was suspended that afternoon in the pines and never quite resumed. ${(S.flags.craft||0)>=1?'He found me afterward at the edge of the trees. “The tunnel,” he said, in his careful English, and stopped, and tried again: “It was very good work. I am sorry for what was done. It was not — soldiers, who did that.” Then he saluted, one professional to another, and I returned it, and we never spoke of any of it again.':''}\n\nAnd the compound went back through the gate in the smell of pine sap, six hundred men out of jokes, and the war ground on toward its fifth winter, and something in the camp had to be found for hope to do — because Doc’s barometer was falling in every hut, and the wire was still the wire, and June was still a very long way off.`,
  choices:[
    { t:'Work on the vault with your own hands — you carried the sand out; you can carry the stone in.',
      pre:'carry the stone', fx:(S,P)=>{ logSee(P,'weasel',3); S.flags.craft=(S.flags.craft||0)+1; if((S.flags.craft||0)>=2) award(P,'craftsman'); }, go:'n_georgeprop' },
    { t:'Stand at the dedication next to the Weasel, at the back, uninvited and unquestioned, in the fellowship of men who spent a war on each other.',
      pre:'one craftsman to another', fx:(S,P)=>{ logSee(P,'weasel',3); S.flags.craft=(S.flags.craft||0)+1; if((S.flags.craft||0)>=2) award(P,'craftsman'); }, go:'n_georgeprop' },
    { t:'Read the fifty names off the stone once, out loud, very quietly, with Tiny — who still is not joking — holding his cap in both hands like a schoolboy.',
      fx:(S,P)=>{ logSee(P,'weasel',3); logSee(P,'tiny',2); }, go:'n_georgeprop' },
    { t:'Look from the vault back along the line the tunnel would have run — the pines, the wire, the far huts — and understand that Harry reached the trees after all. Just not the way anyone meant.',
      fx:(S,P)=>{ logSee(P,'weasel',3); }, go:'n_georgeprop' },
  ]},

n_georgeprop:{ region:'garden', reg:'ache', title:'What Doc Prescribed',
  text:(S,P)=>`It was Doc who said it first, at the committee that autumn — the committee that had not met since March, because what was there to organize? The new administration had promised that the next tunnel would be repaid in ways no one doubted. Escape was dead; the list had killed it; even the word had gone out of the compound’s vocabulary like a curse in a house where someone died of it.\n\nDoc stood up at the fogged window where the Magpie used to stand, and said: “I have eleven men on my list and it is October. I am going to say the thing none of you will. The tunnel was never the door. The tunnel was the floor — it was what six hundred men stood on. You have taken away the digging and left the wire, and I am telling you as a doctor: this camp needs a tunnel. Not to the trees.” He looked around the room. “Just deep enough to stand up straight in.”\n\nNobody spoke for a while. Then someone said: where. And under the theater — under Dick’s old sand, under the seats that had swallowed Harry — the last tunnel of Stalag Luft III was begun: dug by men who had just buried the price of digging, going nowhere, aimed at nothing, and the compound came back to life around it hut by hut like a town when the mill reopens.\n\nThey asked, in the way of these things, what it was to be called. And I heard my own voice, from the back, before I had decided anything: “George. We lost George over Essen. Then we lost fifty more. This one isn’t going anywhere. It’s just ours.”`,
  choices:[
    { t:'First shift down the new shaft. The ledger opens again — feet dug, no destination column, none needed.',
      pre:'the garden reopens', feet:0, fx:(S,P)=>{ S.tun='george'; S.feet=0; logSee(P,'doc',3); },
      go:'n_georgedig' },
    { t:'Tell Doc, privately, that you understood the prescription the day Sandy crossed the wire. Watch the barometer-reader hear it.',
      fx:(S,P)=>{ S.tun='george'; S.feet=0; logSee(P,'doc',3); }, go:'n_georgedig' },
    { t:'Write the name in chalk yourself, small, at the head of the new shaft, where the feet-count for Harry used to live: GEORGE.',
      pre:'the christening', fx:(S,P)=>{ S.tun='george'; S.feet=0; logSee(P,'doc',3); }, go:'n_georgedig' },
    { t:'Ask what {FRIEND} would say about a tunnel with no course to plot — and answer yourself in his voice, and find you can smile doing it.',
      crew:1, fx:(S,P)=>{ S.tun='george'; S.feet=0; logSee(P,'doc',3); }, go:'n_georgedig' },
  ]},

n_georgedig:{ region:'garden', reg:'lark', title:'The Garden',
  text:(S,P)=>`So we dug. Through the last autumn of the war and into its terrible final winter, the men of North Compound went down under the theater and dug a tunnel to nowhere, and it worked exactly as prescribed.\n\nThe shifts came back. The stooges came back, and the penguins — Tiny shuffling his yellow pounds into the grey with the old music-hall shuffle, and one evening, over the dispersal, he told me the whole of it at last: the allotment at home, the marrows, the wife who died the spring before the war and how the garden had been what he dug himself out of that with, one barrow at a time. “Same work,” he said, nodding down at the trap, the old wink coming back up his big face like something surfacing. “Same work, boyo. Sky’s down there. We plant blokes in it, and up they come.”\n\nThe camp’s laugh came back that winter, quietly, the way a fire relights. Rations were the worst of the war; the parcels had all but stopped; the guns in the east got a little louder every week like a train you are standing on the tracks of. And under the theater there was warm work and shored boards and the old ledger, feet dug, chalked small — a number that meant nothing to any map and everything to Doc’s list, which shrank, name by name, all winter.`,
  choices:[
    { t:'Dig your shifts and keep the ledger yourself: feet as medicine, chalk as clinical notes. Doc trades you his sick-list numbers for yours.',
      pre:'feet as medicine', feet:40, fx:(S,P)=>{ logSee(P,'tiny',3); award(P,'greenfingers'); award(P,'gardener'); if(S.nv.hero>0)S.nv.hero--; if(S.nv.friend>0)S.nv.friend--; },
      go:'n_march' },
    { t:'Run the theater above it at the same time — a pantomime for Christmas ’44, played over a working tunnel, sand going under the seats between acts. The completest joke the camp ever told.',
      pre:'the pantomime over the tunnel', feet:28, crew:1, fx:(S,P)=>{ logSee(P,'tiny',3); award(P,'greenfingers'); award(P,'gardener'); if(S.nv.hero>0)S.nv.hero--; },
      go:'n_march' },
    { t:'Take the quiet men down with you on your shifts — Doc’s list, one name at a time, handed a shovel and a place in a rhythm. Watch the wire lose customers to the garden.',
      pre:'the wire loses customers', feet:32, fx:(S,P)=>{ logSee(P,'tiny',3); logSee(P,'doc',3); award(P,'greenfingers'); award(P,'gardener'); S.nv.hero=0; },
      go:'n_march' },
    { t:'Some nights I tell it the other way — the winter where there is no George, no garden, only the wire and the list and the cold, and one grey morning I understand Sandy Cole completely.',
      pre:'the version doc dreaded', req:(S,P)=>S.nv.hero>=1, end:'e_appell' },
  ]},

n_march:{ region:'marchw', reg:'dread', title:'The Road West',
  text:(S,P)=>`They came for us at three in the morning, at the end of January ’45, with the Eastern Front audible like weather beyond the pines: an hour’s notice, the camp to be marched west, everything you can carry, form up at the gate. Six hundred men made sledges out of bed boards — the tunnel’s own timber, come up into the daylight at last to do one more job — and packed the klim tins and the last chocolate, and walked out through the gate the wire had guarded for three years, into a blizzard, on foot, in column, at night.\n\nThe Long March. Thirty below, some nights. Men who had been hungry since autumn walking thirty kilometers a day on roads glazed like bottle glass, sleeping in barns, in churches, in a pottery kiln still warm from the day’s firing — I have never since been so grateful to an industrial process. The weak went onto the sledges. The sledges went onto the strong. ${S.flags.boards?'I hauled a sledge built partly of my own bunk boards, and I knew the knots, and it held, and I want it recorded that no bed ever served a man better by being one less.':'Doc walked the column end to end each halt like a man stitching a wound, and his list walked with him, and the garden’s winter dividend paid out on that road: the men George had kept steady now kept each other.'}\n\nTiny carried a boy of nineteen — a late-war arrival, frostbitten — pick-a-back for the last two days, telling him about marrows the entire way, allotment by allotment, until the boy stopped drifting. If you want one image of what the digging had all been for, it is that: the biggest penguin of the firm, on the glazed road west, planting a man firmly in the world by talking to him about vegetables.`,
  choices:[
    { t:'Walk the column like Doc — end to end at every halt, counting your people, redistributing the loads, until every name you know is still answering at the barns.',
      pre:'bring them all through', fx:(S,P)=>{ S.flags.marchAll=1; }, go:'n_home' },
    { t:'Haul sledge. Head down, harness on, one more kilometer, for two hundred kilometers. Let the thinking men think; be the horse the column needs.',
      fx:(S,P)=>{ S.flags.marchAll=(S.crew>=4)?1:0; }, go:'n_home' },
    { t:'Keep the ledger even here: a stub of chalk on the sledge rail, kilometers instead of feet. The men look at the number at each halt exactly the way they looked at the other one.',
      pre:'the last ledger', fx:(S,P)=>{ S.flags.marchAll=(S.nv.hero===0)?1:0; }, go:'n_home' },
    { t:'Carry what Tiny carries, the way he carries it: someone, and a subject to talk about, all the way to the west.',
      crew:1, fx:(S,P)=>{ S.flags.marchAll=1; logSee(P,'tiny',3); }, go:'n_home' },
  ]},

n_home:{ region:'home', reg:'elegy', title:'The Boat',
  text:(S,P)=>`The war ended for me in a barn near Lübeck, when a dusty armored car with a white star on it nosed into the yard and a sergeant from Manchester looked down at two hundred scarecrows in RAF greatcoats and said, “Well, gentlemen. Been keeping busy?” — and two hundred men who had survived the wire, the list, and the road west laughed until several of them had to sit down in the straw.\n\nThen: delousing, forms, a Dakota, and the boat train, and England coming up green off the water like something imagined. Nell was at the barrier. The gate at home still stuck; the latch still squeaked; her father, it turned out, had never oiled it on purpose all through the war, so the squeak would be there when I came back to hear it — and if you want to know what I did when he told me that, I closed the gate and opened it again several times, squeaking, while everyone pretended not to watch me.\n\nAnd within a month, at a bus stop, a man my age in a demob suit heard where I had spent the war and said — kindly, mind you, meaning it kindly, that is the part she has to understand — “Prison camp, eh? Well. At least you sat it out safe.” ${S.nell>=2?'I have Nell’s letters still, all of them, the gate and the crocuses and the not-worrying, in a biscuit tin with a silk map and a razor-blade compass. The tin does not close properly. I have never fixed it.':''}`,
  choices:[
    { t:'Tell her what you told the man at the bus stop: nothing. You shook his hand. He was at Normandy; you were at Sagan; the war was wide enough for both kinds of nights.',
      pre:'wide enough', fx:(S,P)=>{ if(S.nell>=2) award(P,'junegate'); if(S.flags.marchAll) award(P,'bringthem'); },
      end:(S,P)=>S.flags.marchAll?'e_garden':'e_roadwest' },
    { t:'Tell her what you never told him: that the safest-looking war in Europe had a typed list in the middle of it, and your friends’ names on the list, and that “safe” is a word civilians should be allowed to keep.',
      fx:(S,P)=>{ if(S.nell>=2) award(P,'junegate'); if(S.flags.marchAll) award(P,'bringthem'); },
      end:(S,P)=>S.flags.marchAll?'e_garden':'e_roadwest' },
    { t:'Tell her about the gate — the squeak kept unfixed on purpose, four years, by a man who never once said why. That is the other thing the war was made of, and nobody gives out gongs for it.',
      pre:'the latch, unoiled', fx:(S,P)=>{ if(S.nell>=2) award(P,'junegate'); if(S.flags.marchAll) award(P,'bringthem'); },
      end:(S,P)=>S.flags.marchAll?'e_garden':'e_roadwest' },
    { t:'Tell her what you did the first September home: dug the vegetable bed over for no reason it needed, double depth, and stood in the hole up to your knees, and laughed alone like a lunatic, and felt entirely well for the first time since Essen.',
      pre:'same work, right way up', fx:(S,P)=>{ if(S.nell>=2) award(P,'junegate'); if(S.flags.marchAll) award(P,'bringthem'); },
      end:(S,P)=>S.flags.marchAll?'e_garden':'e_roadwest' },
  ]},

/* ======================================================================
   BOOK TWO — THE HORSE (the Wooden Horse, told as the camp's legend)
   The license inverts here: this history is fixed as SUCCESS, so the
   dark branches are the narrator flinching — and she corrects the record.
   ====================================================================== */

n_h1:{ region:'club', reg:'elegy', title:'The One That Worked Clean',
  text:(S,P)=>`Grandad’s favorite. Of course it was. He heard it the same day I did, at the same wire.\n\nAutumn of ’43, while we in North Compound were watching Tom die and starting to bury our hopes in Harry, something was going on next door in East Compound that none of us knew about — the neat, small, perfect one. The one with three men out and not a name on any list afterward. The one where everybody catches the boat.\n\nI wasn’t there. I want that said before the soup: I had it over the wire in whispers like everyone else, and later from one of the three himself, at a bar in London in 1947, in exchange for the price of the drinks, which I have always considered the best contract of my life. So what follows is partly his, partly the wire’s, and partly fifty years of mine — because in my telling, love, I am the third man. I have always been the third man. An old prisoner is allowed one borrowed escape, and this one is mine.`,
  choices:[
    { t:'Tell it the way the wire told it first: in whispers, over three evenings, too good to be true and true anyway.',
      fx:(S,P)=>{S.flags.htell='wire';}, go:'n_h2' },
    { t:'Tell it the way the man in the bar told it: dry as a timetable, funnier for that, buying nothing but his own soda water.',
      fx:(S,P)=>{S.flags.htell='bar';}, go:'n_h2' },
    { t:'Tell it the way you have improved it since: from inside. First person. The borrowed escape, worn openly.',
      pre:'the third man', fx:(S,P)=>{S.flags.htell='inside';}, go:'n_h2' },
    { t:'Start with the joke, because it IS a joke: the Reich, undone next door by gymnastics.',
      fx:(S,P)=>{S.flags.htell='joke';}, go:'n_h2' },
  ]},

n_h2:{ region:'horse', reg:'lark', title:'A Present From the Greeks',
  text:(S,P)=>`Two young lieutenants in East Compound looked at their problem — a hundred-odd feet of open ground between the huts and the wire, over sand that sang to buried microphones — and reasoned their way to the single most beautiful idea of the war:\n\nif the tunnel cannot start near the wire, the ENTRANCE must walk there. Daily. In public. With the Germans watching.\n\nSo they proposed a vaulting horse. A big plywood box-horse, Red Cross crates and stolen screws, carried out to the same spot by the wire every morning for healthful exercise, vaulted over for hours by relays of officers — with a man folded up INSIDE it, digging. Trap resealed flush and buried before the horse came home each evening. The tunnel would live its whole life under the enemy’s daily inspection, protected by the one force the Reich had no answer to: the sheer embarrassment of the idea.\n\nTheir committee, I am told, laughed for a full minute. Then it went very quiet, in the way of committees that have just heard something workable.`,
  choices:[
    { t:'Volunteer — in the telling — for the digging. Small men fold better, and you have been fitting into aircraft all war.',
      pre:'the man inside', feet:2, fx:(S,P)=>{S.tun='horse'; S.feet=0; S.flags.tunnelRevealed=1; S.flags.hrole='digger';}, go:'n_h3' },
    { t:'Volunteer for the vaulting. Somebody has to be terrible at gymnastics on purpose, hours a day, for the Reich’s benefit.',
      pre:'the cover', fx:(S,P)=>{S.tun='horse'; S.feet=0; S.flags.tunnelRevealed=1; S.flags.hrole='vaulter'; S.hv=(S.hv||0)+1;}, go:'n_h3' },
    { t:'Ask the question the committee asked: what happens the day a ferret tips the horse over? — and hear the answer: “Then we applaud the gymnasium for its discipline.”',
      fx:(S,P)=>{S.tun='horse'; S.feet=0; S.flags.tunnelRevealed=1;}, go:'n_h3' },
    { t:'Let her stop you: “Wait. They dug it in the OPEN? By the WIRE?” Yes, love. That is the whole joke, and it took the Reich three months not to get it.',
      fx:(S,P)=>{S.tun='horse'; S.feet=0; S.flags.tunnelRevealed=1;}, go:'n_h3' },
  ]},

n_h3:{ region:'horse', reg:'lark', title:'Physical Culture',
  text:(S,P)=>`The horse went out after morning appell and the compound discovered a passion for physical culture that would have made a Prussian schoolmaster weep.\n\nFour men carried it — which was the first tell nobody caught, because an empty plywood horse does not need four men, but a horse with a digger and his tools and, later, twelve bags of wet sand inside it certainly does. The vaulters vaulted. Some were good. The best were bad — deliberately, artistically bad, men who could take a tumble that drew every eye in every tower while below their thumping feet a trap was being lifted on a tunnel eighteen inches down.\n\nThe vaulting was everything. It masked the digging from the microphones; it explained the horse; it explained the same spot, every day, by the wire. The cover was not beside the operation. The cover WAS the operation. Doc would have prescribed it by the hour.`,
  choices:[
    { t:'Take every vaulting shift going — in the telling, your knees remember it yet. Twenty a day, badly, beautifully.',
      pre:'twenty a day', fx:(S,P)=>{S.hv=(S.hv||0)+2;}, go:'n_h4' },
    { t:'Organize the rota like the firm would: stooges among the vaulters, a signal set, injuries staged in advance and filed for later use.',
      fx:(S,P)=>{S.hv=(S.hv||0)+1;}, go:'n_h4' },
    { t:'Carry the horse. Four men, one gait, no grunting on the heavy days — the walk itself was a performance with lives in it.',
      fx:(S,P)=>{S.hv=(S.hv||0)+1;}, go:'n_h4' },
    { t:'Perfect the artistic tumble: the full-eyes-of-the-tower special, with a bounce. She laughs. Fifty years on, it is still a reliable house.',
      fx:(S,P)=>{S.hv=(S.hv||0)+1;}, go:'n_h4' },
  ]},

n_h4:{ region:'inhorse', reg:'dread', title:'Inside',
  text:(S,P)=>`Now the other half, the half the compound never saw. You are folded into a plywood box in your underclothes with a bowl to dig with, bags for the spoil, and a margarine lamp you mostly don’t light because air is the actual currency. Above your head, boots. All day, boots — the thud and shake of grown men landing on your ceiling, on purpose, on schedule, to keep you inaudible.\n\nThe shaft went down five feet under the horse’s belly, and the trap that closed it was the masterpiece: boards, then grey blended sand tamped flush, then the topsoil combed back over, all of it done lying down, in the dark, by feel, to a finish that had to survive a ferret’s probe and a hundred vaulters’ heels. Every evening the horse was carried home heavier than it went out, and every evening the ground by the wire looked like nothing at all.\n\nA hundred feet, dug with a bowl, by a man in a box being jumped on. When people tell me the age of miracles is past, I think of the horse coming home at dusk with Germany inside it.`,
  choices:[
    { t:'Do the reseal yourself, in the telling: the blend, the tamp, the comb — flush to the frame, every single dusk, no exceptions ever.',
      pre:'flush to the frame', feet:20, fx:(S,P)=>{ award(P,'flush'); }, go:'n_h5' },
    { t:'Dig like Zabek taught the other compound: fear answers to work; push the bowl.',
      feet:26, go:'n_h5' },
    { t:'Bag the spoil wet and heavy and curse it lovingly — every pound rides home inside the horse tonight, between your knees.',
      feet:22, go:'n_h5' },
    { t:'Spend one shift just listening to the boots overhead and understanding, completely, that other men’s effort is the roof over you.',
      feet:16, fx:(S,P)=>{ if(S.nv.hero>0)S.nv.hero--; }, go:'n_h5' },
  ]},

n_h5:{ region:'horse', reg:'ache', title:'The Long Gymnasium',
  text:(S,P)=>`Three months, that operation ran. July to October, every digging day the same play performed twice daily to an audience of towers.\n\nIt cost what such things cost. Backs went, and knees. The vaulters vaulted through sprains because a rest day was a tunnel day lost. The diggers came out of the horse grey and folded, men being unpacked rather than emerging, and had to walk away casually — CASUALLY — with a hundred feet of cramp in each leg. The autumn came on and the daylight shortened and the arithmetic of dusk against appell got thinner every week.\n\nAnd the sand crept forward, bowlful by bowlful, under the microphones, under the probes, under the boots of the Reich — eighteen inches down, which is nothing, which is a floor’s thickness between a man and discovery, all the way toward the wire.`,
  choices:[
    { t:'Vault through the sprain like they did. In the telling your ankle still clicks in cold weather, and you are proud of a fictional ankle.',
      pre:'the rota holds', feet:18, fx:(S,P)=>{S.hv=(S.hv||0)+1;}, go:'n_h6' },
    { t:'Mark the tunnel’s progress each night on a mental map of the compound, pacing it off above ground, casually, hands in pockets.',
      feet:20, go:'n_h6' },
    { t:'Tell her about the unpacking of the diggers — the two men lifting you out folded, and the art of the casual walk with dead legs.',
      feet:16, go:'n_h6' },
    { t:'Note what she notes, pencil poised: “Nobody’s name is on a list in this one.” Not in this one, love. Keep reading.',
      feet:18, go:'n_h6' },
  ]},

n_h6:{ region:'inhorse', reg:'dread', title:'The Heel',
  text:(S,P)=>`Of course there was a day. There is always a day.\n\nA stretch of tunnel ran shallow — eighteen inches is a guess in the dark, and guesses vary — and one afternoon a vaulter came down from a good honest leap and his heel went THROUGH. Through the turf, through the ceiling, into the tunnel, with a digger at the face forty feet beyond and two towers watching the gymnasium at their leisure.\n\nWhat happened next took four seconds and I have heard it described by a man who was there and I still don’t fully believe the speed of it: the vaulter collapsed on the hole, clutching his knee, roaring — the staged injury, filed months before, produced at sight — and the whole gymnasium converged on him in a concerned crowd that was also, precisely, a screen, while two men knelt IN the crowd and packed the hole under the cover of a rolled jacket and a water bottle and the Reich’s own first-aid instincts. They carried him off moaning. He winked at the horse as he went by.`,
  choices:[
    { t:'Stay with what happened: the crowd, the jacket, the packed hole, the wink. Four seconds of the best theater the war produced.',
      pre:'as it went', feet:8, go:'n_h7' },
    { t:'Be the roaring man, in the telling. You always are. The knee performance has improved every year since 1947.',
      feet:8, fx:(S,P)=>{S.hv=(S.hv||0)+1;}, go:'n_h7' },
    { t:'Let her feel the forty feet: a digger, underground, hearing the ceiling open behind him and the daylight come in. And then boots. And then dark again, repacked. And he stayed. And he kept digging.',
      feet:8, go:'n_h7' },
    { t:'Some nights the heel goes through and the ferret is standing right there, and the whole clean story ends in that turf—',
      pre:'the flinch', go:'n_hf1' },
  ]},

n_hf1:{ region:'club', reg:'elegy', title:'She Corrects the Record',
  text:(S,P)=>`“No,” she says.\n\nJust that, first. Her hand flat on the notebook, my glass stopped halfway. The whole club quiet around us in that particular after-nine hush.\n\n“That’s not how it went. You told me yourself — no ferret, the crowd, the jacket, the wink. It WORKED.” She looks at me the way her grandfather looked at a man dealing himself bad cards. “You do this. When a story’s too good, you flinch it. You deal them the number, or the torch, or the ferret, because you don’t trust clean luck even fifty years later. Well — this one’s mine as much as yours now, and in mine it goes the way it WENT.”\n\nShe turns the notebook around. She has been keeping the horse’s ledger in the margin, feet dug, like a professional.`,
  choices:[
    { t:'Stand corrected. Gratefully. Take the telling back up at the crowd, the jacket, the wink — as it went.',
      pre:'as it went, then', go:'n_h7' },
    { t:'Tell her why you flinch: because the other book taught you what luck usually costs. Then tell this one straight anyway.',
      go:'n_h7' },
    { t:'Say what you have never said: that the horse is the story you keep BECAUSE it needs no flinching. The one clean room in the house.',
      go:'n_h7' },
    { t:'Laugh — properly, for the first time tonight — at being edited by Tiny’s granddaughter, and surrender the pencil for good.',
      go:'n_h7' },
  ]},

n_h7:{ region:'horse', reg:'dread', title:'Three Men and the Dusk',
  text:(S,P)=>`By late October the tunnel was under the wire and the arithmetic said now: the nights drawing in fast enough that a dusk break could beat the count, the ground not yet frozen, the papers ready.\n\nTwo had earned it beyond argument — it was their idea, their tunnel, their three months in the box. They took a third man for the final push, a digger who had carried the back half of the work${S.flags.htell==='inside'?' — and in my telling, as I have confessed, that third pair of boots is mine':''}. The last day the horse went out twice, and the vaulting was the best and worst ever staged, because every man jumping knew, and had to jump like a man who didn’t.\n\nThe plan was simple the way a blade is simple: seal the diggers in at the evening session, carry the horse home light, answer the count with two rigged blanket-dummies — and at full dusk, break the last two feet, come up in the ditch beyond the wire, and walk to the railway station dressed as foreign workers, on papers grown in another compound’s garden.`,
  choices:[
    { t:'Take the last vaulting session yourself, in the telling — jump the lie clean, twenty a day to the very end.',
      pre:'the last cover', feet:18, fx:(S,P)=>{S.hv=(S.hv||0)+1; if((S.hv||0)>=4) award(P,'vaulter');}, go:'n_h8' },
    { t:'Be sealed in. Three men and a candle in a hundred feet of dark, waiting for the light over Germany to die.',
      pre:'the wait at the face', feet:18, fx:(S,P)=>{ if((S.hv||0)>=4) award(P,'vaulter'); }, go:'n_h8' },
    { t:'Walk the compound one last time above them, pacing the line of the tunnel, hands in pockets, saying the miner’s rule down through the ground: hurry is what kills.',
      feet:18, fx:(S,P)=>{ if((S.hv||0)>=4) award(P,'vaulter'); }, go:'n_h8' },
    { t:'Let her hold the count with you: a hundred feet dug, two dummies in two bunks, and the dusk coming down like a curtain being lowered by hand.',
      feet:18, fx:(S,P)=>{ if((S.hv||0)>=4) award(P,'vaulter'); }, go:'n_h8' },
  ]},

n_h8:{ region:'night', reg:'dread', title:'The Ditch',
  text:(S,P)=>`At full dark the last two feet came away like a cork.\n\nCold air, wet grass, the ditch — and the wire BEHIND them, which is a sentence I have needed fifty years to say about anyone without my chest doing something complicated. Three men in the ditch in workmen’s clothes, boots in their socks, faces down while the tower light made its slow indifferent pass, and then up and WALKING — not running; walking, casually, murderously casually, down the road any worker might use, toward the lit windows of Sagan station.\n\nBehind them the count had already come right: two dummies asleep in two bunks, the horse innocent in its shed, the trap flush to the frame under combed topsoil. The Reich would not know for a night and half a day that East Compound was three men light. By then there would be a great deal of Baltic involved.`,
  choices:[
    { t:'Walk it with them, step for step, the whole quarter-mile — the longest casual walk in the history of legs.',
      pre:'murderously casual', fx:S=>{S.feet=100;}, go:'n_h9' },
    { t:'Give her the detail the man in the bar gave you: they could hear the camp’s evening — a gramophone, a shout of laughter — carrying over the wire at their backs, and none of them looked round.',
      fx:S=>{S.feet=100;}, go:'n_h9' },
    { t:'Stop at the ditch a moment, in the telling, and put your palm flat on the cold turf, the way you once touched a hatch ceiling. Two feet. Always two feet.',
      fx:S=>{S.feet=100;}, go:'n_h9' },
    { t:'And some nights the tower light catches an elbow at the lip of the ditch, and the whole thing ends in the wet grass ten feet out—',
      pre:'the flinch, again', fx:S=>{S.feet=100;}, go:'n_hf2' },
  ]},

n_hf2:{ region:'club', reg:'elegy', title:'She Keeps the Wheel',
  text:(S,P)=>`This time she doesn’t say no. She just looks at me, and waits, with her pencil down flat like a rank of men refusing an order — and I hear it myself, in the silence: the flinch, arriving on schedule, trying to deal three walking men a searchlight they never got.\n\n“They’re in the ditch,” she says at last, evenly, like a navigator reading back a course. “The light passes. They get up. They walk. Say it.”\n\nThe light passes. They get up. They walk.\n\n“Again.”\n\nThe light passes, love. They get up. They walk. All the way to the station, and nothing in the Reich so much as turns its head. She picks the pencil back up. “Thank you,” she says, and we proceed, under new management.`,
  choices:[
    { t:'Proceed. Under new management. To the station.',
      pre:'the light passes', go:'n_h9' },
    { t:'Tell her she reads back a course exactly like a man she never met read them over Essen. Watch that land somewhere deep.',
      crew:1, go:'n_h9' },
    { t:'Admit the size of the gift: fifty years of flinching, and it took one reunion dinner and a pencil to hold the wheel steady.',
      go:'n_h9' },
    { t:'Say nothing. Some corrections you accept the way ground accepts rain.',
      go:'n_h9' },
  ]},

n_h9:{ region:'station', reg:'dread', title:'Three Tickets',
  text:(S,P)=>`They split at the station, because three foreign workers travelling together is a unit and units get counted. Two went north together for the Stettin boats — French draughtsmen, papers immaculate, a cover story with real Breslau dust on it. The third went his own long way alone, east then north, for Danzig — a margarine salesman, of all the blessed trades, with samples in his case and a Norwegian shrug rehearsed to perfection.\n\nTrains, checks, torches, timetables. All the machinery that ate seventy-three men out of my book — and in this one, love, watch: the papers hold. Every check. Every torch. The clerks stamp, the Feldgendarmerie nod, the trains run on the Reich’s own beautiful punctuality with the Reich’s own escaped prisoners aboard, reading the Reich’s own newspapers with expressions of profound boredom.\n\n${S.flags.htell==='bar'?'“The trick,” said the man in the bar, stirring his soda water, “is to be the least interesting object in any given railway carriage. I have never since managed to be interesting on a train. My wife despairs.”':'In my tellings I ride all three trains. I have had fifty years; there is time for every carriage.'}`,
  choices:[
    { t:'Ride north with the pair, in the telling — two men not knowing each other loudly, all the way to the Stettin docks.',
      pre:'the pair', fx:(S,P)=>{S.flags.hroute='pair';}, go:'n_h10' },
    { t:'Ride east alone with the margarine man — the long way round, the cold platforms, the shrug that answered every question in Norwegian silence.',
      pre:'the third ticket', fx:(S,P)=>{S.flags.hroute='solo';}, go:'n_h10' },
    { t:'Stay above the map, the navigator’s view: three moving lights crossing the Reich at night, converging on salt water.',
      fx:(S,P)=>{S.flags.hroute='map';}, go:'n_h10' },
    { t:'Give the checks their full weight — every torch a coin-flip that came up heads, eleven times, because the papers were grown right and the nerve held.',
      go:'n_h10' },
  ]},

n_h10:{ region:'docks', reg:'elegy', title:'Everybody Catches the Boat',
  text:(S,P)=>`${S.flags.hroute==='solo'?'The margarine man talked his way onto a Danzig freighter with a hold full of coal dust and a bosun full of expensive sympathy, and stood out into the Baltic on the fourth night.':'The pair went over the Stettin harbor fence at the blind corner the stokers sold, and swam the last black yards, and came up a Swedish anchor chain with their papers ruined and their lungs full of the Baltic and nothing else in the world wrong at all.'} And then — this is the part I make her sit still for — THE OTHERS ALSO MADE IT. All three. Separate boats, separate nights, one week. Stockholm confirmed them one by one like stars coming out.\n\nNo list. No urns. No week of names growing under an eagle. Three men out of a plywood horse, and every single one of them home for Christmas, and the Kommandant of East Compound reportedly stood looking at the innocent horse in its shed for a long time, and then — I have this on good authority — laughed. Once. Quietly. One professional to another.\n\nIn the club, the girl closes the notebook on the horse’s ledger: one hundred feet, all of it spent, nothing owing. “You weren’t there,” she says — gently, the way her grandfather used to catch a man out kindly. No, love. I was next door, burying Tom. “But you’ve been going with them ever since.” Every night I need it. That is what the clean one is FOR. The Fifty taught me what the digging costs. The horse reminds me what it was all along: possible.`,
  choices:[
    { t:'Raise the glass of the man not present to the three of them — the only toast in this club that never once needed the word “absent.”',
      pre:'all three', fx:(S,P)=>{ award(P,'allthree'); }, end:'e_horse' },
    { t:'Give her the notebook back and tell her the horse is hers now — the clean one, kept in trust, for the nights she’ll need it someday.',
      pre:'kept in trust', fx:(S,P)=>{ award(P,'allthree'); }, end:'e_horse' },
    { t:'Tell her what the man in the bar said last, at the door, in 1947: “We were lucky, of course. But we built the luck a bowlful at a time.”',
      fx:(S,P)=>{ award(P,'allthree'); }, end:'e_horse' },
    { t:'Sit a moment with the arithmetic that has no remainder: three out, three home, nought carried. The only sum of the war that ever balanced.',
      fx:(S,P)=>{ award(P,'allthree'); }, end:'e_horse' },
  ]},

};

/* ======================================================================
   ENDINGS — all in the elegy register; every one closes back at the club.
   Kinds: home / survive / dark (the counterfactual license) / true / pause.
   ====================================================================== */
const endings = {

e_needle:{ kind:'home', art:'docks', title:'The Needle’s Eye',
  text:(S,P)=>`Three men made it home out of seventy-six. I am telling you about one of them, which is why there is a telling at all.\n\nStockholm, the Legation, a Mosquito home in a bomb bay with a thermos of Swedish coffee — and then a debriefing room in London where a wing commander with tired eyes wrote down the route, the papers, the rope trick at the hole, all of it, and at the end looked up and said: “You understand you are one of three.” I did not understand it. I have had fifty years and I do not understand it yet. The line between my chair at this table and a name cut in Silesian stone is a lottery slip, a torch beam, a timetable — nothing. Nothing you could build a virtue out of.\n\n${S.flags.knife==='pact'?'I kept the seventy-two hours at that dock. I want it on the record that I kept them, every minute, and that when I finally went over the fence alone it was the widest water I ever crossed. The crew did not reassemble at the coast. The crew reassembled here, at this club, in ’46, with frostbitten fingers and a grin, and called me skipper across the room — but that is his story, and he tells it worse than it deserves.\n\n':''}In the club, the girl has stopped writing on the tablecloth. “So you got out,” she says. Yes. Out of Germany in the spring of ’44 — and never once, not for one night since, out of Hut 104. Nobody gets out of Hut 104. That is not a complaint, love. That is the address of everything I am.`,
},

e_longwalk:{ kind:'survive', art:'walk', title:'The Long Walk',
  text:(S,P)=>`They kept me in the south until the war blew out, in a camp of no particular history, where I taught navigation from memory to bomber crews younger than my scars and read four winters’ worth of other men’s books.\n\n${S.flags.toldwoman?'I told her about the woman at the field’s edge — the one who saw a scarecrow in RAF blue crossing her country in the dark, and went inside, and said nothing. When the histories are written they are all armies and lists. They should keep a page for the people who simply declined, once, quietly, to be part of the machinery. I owe eleven of my nights to that page.\n\n':''}“I saw the mountains,” I tell the girl, and I hold my glass up an inch, the way I do every year at this table whether anyone notices or not. “Eleven nights, a stolen rabbit, a razor-blade compass — and the far wall of the war, white as Sunday, before two frightened boys with one rifle closed the account.” Fifty men were murdered for the same walk I was given tea and a blanket for. Which patrol finds you: the whole moral history of that year comes down to which patrol. \n\nShe asks if I would do it again, knowing. It is the only question I have never needed to think about. Every step, love. Every single step. A man is not a prisoner while he is walking.`,
},

e_uniform:{ kind:'dark', art:'station', title:'The Other Uniform',
  text:(S,P)=>`This is the telling I do not do at the table. This is the 3 a.m. one, and tonight — because she asked, and because the chairs are nearly all empty now, and someone should hear it said plainly once before there is no one left to say it — tonight, the 3 a.m. one, out loud:\n\nIt goes exactly the same, you understand. The tunnel, the rope, the trees. The same feet, the same papers, the same heartbeat like a Merlin. It goes the same right up to a crossroads — a platform, a checkpoint, a woodpile, it hardly matters which — and at the crossroads, instead of soldiers, the coats. And after the coats there is a drive into a wood or a field or a quarry, and a stop that has no station, and an invitation to stretch one’s legs. Fifty times, that spring, on fifty roads, that invitation was accepted by men I had traded jam with, and the file says what files say. Shot while resisting. The file is the last lie of the journey.\n\n“Deal me a different number,” I tell her, with my hands flat on the white cloth, steady as I can make them, “a different torch beam, a different crossroads — and that is the whole story. No club. No telling. A name ninth or nineteenth or fortieth on a typed page, and somebody else, some other last man, answering for me at reunions he never once missed.” That is not a nightmare, love. That is just the arithmetic. I am the remainder. I have tried to be a good one.`,
},

e_man77:{ kind:'dark', art:'hole', title:'Man Seventy-Seven',
  text:(S,P)=>`Some nights I deal myself the ladder.\n\nIt runs like this: the count stands at seventy-six, the east is going grey, and I am next — hands on the rungs, the cold pouring down the up-shaft onto my face like water, the rope’s last two tugs still live in the signalman’s wrist somewhere above in the snow. And the shot comes down the tunnel mouth like weather, the way it actually came — I was there for the sound of it; that part is not invented — and in this telling it is my boot on the ladder instead of his, my silhouette in the hole, my war ending in a rifle’s idea of punctuation ten feet short of the trees the tunnel itself had been short of. Harry was short. The night was short. Everything that year was ten feet short, except the list.\n\nIn the true version I stood at the stove and heard it and lived. The man on the ladder lived too, as it happens — hauled back down by the ankles into two more years of wire — but at three in the morning the versions shuffle, and I have learned not to fight the deal. Doc would say it is the mind digging its own tunnel, going nowhere, deep enough to stand up straight in. Doc was right about everything else. I let it dig.\n\nAt the table, her hand on my sleeve. The glass of the man not present stands full at the empty place. Seventy-six out, love. Seventy-six. Hold the number the way we held it: like a prayer with digits.`,
},

e_given_stockholm:{ kind:'home', art:'docks', title:'The Given Place',
  text:(S,P)=>`He came to the club in April of ’46, the first reunion, with the letter — my letter, the four capitals, ARRIVED, COURSE AS PLOTTED — framed, if you please, wrapped in brown paper, and he presented it to me in front of everyone like a gong. “Property of the man whose number flew the route,” he said. The room stood up. I have received one decoration in my life that I keep on a wall, and it is a Red Cross letter frank from Stockholm.\n\nShe wants to know if I ever regretted it — the swap, the given place, watching another man walk out of the Reich through the hours that belonged to my slip. And I tell her the truth, which is that I have regretted nearly everything about that war at one hour or another of the last fifty years: the five over Essen, the jam I traded, the sums I failed at the cookhouse wall. But not that. Not once, not for a minute, not at 3 a.m., not tonight. A man gets perhaps one decision in his life that stays clean all the way down, love. Mine went down a ladder at half past one wearing my number, and gave me the thumbs-up we used at take-off, and made it home.\n\nHe navigated to the end, you know. Airlines, after. Then the little house — with a garden, of course, and a gate he never oiled. He answered at this table forty-one years running. His chair is the one with the blazer on it.`,
},

e_given_list:{ kind:'survive', art:'list', title:'The Given Place — the Other Weather',
  text:(S,P)=>`They repatriated him in the last winter through Switzerland — the hands, in the end, did what the list had not — and he was at the barrier at Victoria in the spring of ’45 with his gloves on, which is how I knew, and we shook left-handed, which became, God help us, our joke. Everything became our joke eventually. That was how the crew flew.\n\nBut I will tell her what I never told him, since tonight is for the 3 a.m. versions: the five weeks he was a remainder — after the list stopped at fifty and his name was not on it and not off it — those five weeks are the bill for the swap, and I paid it in a currency I have never got back. Every posting under that eagle, I read the new names twice: once for the dead, once for the possibility of him. You cannot hand a man your number and keep your sleep, love; that is the physics of it. I would do it again without blinking. Both things are true. Most of that war, both things were true.\n\nHe kept the frostbitten hands for fifty years and drew maps with them anyway — for the walking club, for the grandchildren, for me, every reunion, on this tablecloth in pencil: the camp, the pines, the line of a tunnel, north. The last one is in my breast pocket tonight. Some documents outrank passports.`,
},

e_garden:{ kind:'survive', art:'tunnel', title:'The Garden',
  text:(S,P)=>`So there is the whole of it: I never got out. Not through Harry, not on the roads, not once in three years — the great escaper of this table went out through the front gate in a blizzard with everyone else, hauling a sledge made of his own bed.\n\nAnd here is what I know that the films never get right: the tunnel worked. Not the seventy-six, not the three — I mean the other work, the daily one. I watched a compound of six hundred men stand on that tunnel the way a town stands on its mill. I watched Doc’s list shrink because of feet dug toward nothing. I watched the biggest man I ever knew plant frostbitten boys back into the world by talking about marrows${S.flags.marchAll?', and I brought them through, love — the road west, thirty below, and every name I knew still answering at the barns. That is my gong. There is no ribbon for it, which is correct, because it was not mine alone: it was the garden’s':''}.\n\nGeorge is still down there, you know. Under where the theater was. The Russians hold that ground now and the pines have taken the compound back, but a tunnel shored with bed boards does not file for permission to stop existing. Somewhere under Silesia there is a room dug by grieving men in the worst winter of the war, going nowhere, deep enough to stand up straight in, with a name chalked at the head of the shaft. Ours. Two of the seven of us came down on silk in ’42, love, and the tunnel that got everyone home — the one I helped dig every foot of — is the one that never left the ground.`,
},

e_roadwest:{ kind:'survive', art:'marchw', title:'The Road West',
  text:(S,P)=>`I can tell her about the wire, the list, the winter. It is the road I still walk at night.\n\nThirty below, the column two miles long, the sledges creaking like ships — and the arithmetic of the halts, which was the cruelest of the war’s many arithmetics: count them at the barn door, count them again at the kiln, and some mornings the number was wrong and there was nothing to be done about it but close the man’s coat over his face and put the column back on the road, because the guns behind us did not halt. I did not bring them all through. I want that on this tablecloth with the rest of it. Men I had dug beside, wintered beside, men the garden had carried across the worst year of their lives, and the road took them in the last hundred days like a toll-keeper, one at a time, quietly, in the snow.\n\nShe asks — gently, she has his gentleness — whether the digging was wasted, then, if the road took them anyway. And I tell her what Doc told me at a barn door near Muskau with the count wrong in his hand: “The tunnel got them to January, boy. Nothing gets everyone to June.” He said it with the list folded in his breast pocket, where other men kept photographs. He answered at this table for thirty years, and never once, in thirty years, called the garden anything but the best medicine he ever prescribed. I am the last man of the dosage. The light is still on. That has to be the telling, love: the light is still on.`,
},

e_appell:{ kind:'dark', art:'winter', title:'The Long Appell',
  text:(S,P)=>`One more 3 a.m. version, and then I am done with the dark ones, I promise you.\n\nThere is a winter — it exists, I have been into it many nights — where Doc loses the argument, or never makes it, and there is no George. No garden. Just the wire, and the list under the eagle, and the cold coming down like a lid, and a man who has stacked every feeling since Essen under a theater that no longer has a tunnel beneath it to hold the weight. And one grey morning in that winter, the man — he has my face, love; this is the version where he has my face — puts down his tin mug quite calmly, and goes out of Hut 104 in his socks, and understands Sandy Cole completely, all the way across the warning wire, with his hands open.\n\nThe tower does what towers do. It is very quick, in the version. It was very quick for Sandy.\n\nThat is the whole of it, and here is why I tell it: because the difference between that winter and the real one — the entire difference, the full moral inventory of it — is a hole in the ground that went nowhere, dug on a doctor’s prescription by men who had just read the price of digging on a typed page, and dug it anyway. When people ask me what the Great Escape achieved, they mean the seventy-six, the three, the films. I think of a wire with no customers in the winter of ’44. Deep enough to stand up straight in, love. That is what we built. It held me. I am here.`,
},

e_hook:{ kind:'dark', art:'cooler', title:'The Entry in the Other Ledger',
  text:(S,P)=>`They let me back into the compound after nine days, which told everyone the essential thing: men who give nothing get twenty-eight.\n\nWhat I gave was small. A dead-letter drop the ferrets had already marked; a nothing; a scrap thrown to end six hours of a quiet room and a civilian coat. No man went to the cooler for it. No tunnel died of it. I have run the damage assessment ten thousand times across fifty years, and the answer is always the same: negligible. Materially negligible. And the coat wrote it down, and I watched my own name enter the other ledger — the one where the currency is not chocolate, and the entries do not close.\n\nThe firm never knew, or the firm knew and forgave, which is worse. Duke stood me a coffee the week after and did not ask, and his not-asking has lasted me half a century. Here is what the quiet room teaches, love, and it is the only thing I know that the books about the camp do not say: everyone has a price and a pressure, everyone, and the men who tell you otherwise were never taken to the room — they were only ever billed in a currency they happened to have. I got out of that war with my friends, my health, and one small entry against my name that nobody living knows about but you, now, tonight. Guard it. Not because it is shameful. Because it is true, and true things about that place are getting scarce, and even the scuffed ones must be kept.`,
},

e_roll:{ kind:'true', art:'club', title:'Answering the Roll',
  text:(S,P)=>`The club secretary reads the roll of the Sagan men at nine o’clock, as it has been read at this dinner every year since 1946. There was a time it took half an hour of answering. Tonight it is one long column of silence — and me.\n\nBut tonight is different, and she is why. Fifty years I have told this story in pieces — the funny parts at dinners, the ache to the ceiling, the dark versions to nobody. Tonight, for the first time, all of it is out on the white cloth in order: every man, every foot, every number, every weather. The Log is complete. And a man who has finally told all of it true discovers he can do the thing he could never do at this table before.\n\nThe secretary reads. And for each name — the barrister with the black bright eyes, ninth on the list; the forger, half-blind, taken at a station west; the Tunnel King, who was owed twice and paid in full in Warsaw in ’72; the big man with the allotment, her grandfather, marrows and all; the Doc; the navigator, forty-one years at that chair — for each name, the last man of Hut 104 stands at attention, seventy-four years old, glass of the absent raised, and answers.\n\n“Here.”\n\nFifty times, and then the crew, and then, at the last, quietly, for a Lancaster and five boys over Essen: “Here.”\n\nHer hand finds mine on the white cloth. “All present,” she says — she has his laugh, and, it turns out, his exactness — “All present. All accounted for.”\n\n<em>The last page follows. It has the real names on it.</em>`,
},

e_horse:{ kind:'home', art:'horse', title:'The Ones Who All Came Home',
  text:(S,P)=>`That is the horse, told to the end, the way it went: no flinches${(P.endings&&P.endings.e_horse)?' — or fewer, anyway; she keeps the ledger on that too':''}, no list, no remainder. The neat, small, perfect one. History did it once, just once, right next door to the worst of it, in the same sand, under the same towers, the same autumn — as if to leave a proof in the margin: the problem was never impossible. It was only expensive.\n\nThe three of them wrote it all down after the war, and men of my book read it the way you read a letter from a better timeline. I met one of them, once, as I said, in 1947, and what I remember best is his hands around the soda water: steady as a bench vice. “The horse was the easy part,” he told me. “The hard part was believing, every day, for three months, that a thing that daft was allowed to work.” That is the sentence I have carried out of that bar for fifty years, love, and I hand it to you now with the notebook: the daft thing is allowed to work.\n\nAt the club, last orders called and ignored, she reads the horse’s pages back to me in order — the idea, the rota, the heel, the ditch, the three boats — and I sit with my eyes shut listening to my borrowed escape in her voice, and every man in it lives, every time, and the light passes, and they get up, and they walk.`,
},

e_pause:{ kind:'pause', art:'club', title:'The Telling Pauses',
  text:`In the club, the girl looks up from the tablecloth where she has been writing feet with her finger.\n\n“That’s not an ending,” she says, quite rightly.\n\nNo. That is where a man puts a bookmark. The rest of it wants a steadier glass than this one, and the club does not close till late.` },

};

/* ======================================================================
   HER LINES — the granddaughter's one-line reaction closing each ending.
   Elegy-adjacent; never maudlin; she is the reader the book deserves.
   ====================================================================== */
const her = {
  e_needle:`She is quiet a long time, and then turns the full glass at the empty place a quarter-turn. “One of three,” she says — to the tablecloth, like a number she intends to have words with.`,
  e_longwalk:`“You sat down in the snow to look at them,” she says. “The mountains.” I did. “Good,” she says, fiercely, as if somebody somewhere had argued.`,
  e_uniform:`She does not touch her glass. After a while she puts her hand flat on the cloth beside mine — not on it; beside it — the way you steady a table, not a man.`,
  e_man77:`“Seventy-six,” she says back to me, quietly, holding it exactly the way I handed it to her. A prayer with digits, passed on.`,
  e_given_stockholm:`She reads the four capitals twice. Then she looks at the blazer chair, and back at me. “He framed the letter,” she says. “You kept the number.” It is not a question, and in fifty years I have not heard it said better.`,
  e_given_list:`She holds her own hands in her lap a moment, the way men do at the memorial. “He drew you maps,” she says at last. “To the end?” To the end, love. On this very tablecloth.`,
  e_garden:`“So the one that never went anywhere—” she starts, and stops, and I watch her get there, the way her grandfather got there one evening over the dispersal. “—went the furthest,” she finishes. His laugh, exactly.`,
  e_roadwest:`She writes the number of the halts on the tablecloth with her finger, and rubs it out at once. “Doc was right, though,” she says. “About January.” He was right about everything, love. It was his one flaw.`,
  e_appell:`For a while she looks at the window, not at me. Then: “But there was a George.” There was, love. That is the whole telling: there was.`,
  e_hook:`“Who else knows?” she asks. Nobody, now. “Then it’s mine,” she says, and folds her hands over it — and that is where it lives now, and it weighs less tonight than it did this morning.`,
  e_roll:`She stands when I stand. Every chair at that table that still has a man in it stands.`,
  e_pause:`“Next time,” she says, “no bookmark.”`,
  e_horse:`“And you always catch the boat?” Every time, love. In this one, everybody always catches the boat. “Good,” she says, and writes it in the notebook under the ledger, in capitals, like a course confirmed: ALL THREE.`,
};

/* ---------------- helpers used by choices (engine binds award/logSee) -- */
let award=()=>{}, logSee=()=>{};
const bindHelpers=(a,l)=>{ award=a; logSee=l; };
/* the crew unbroken: never dipped, both lifts taken, by the compound */
const crewChk=(S,P)=>{ if(S.crew>=5) award(P,'crewtrue'); };
/* a foot a day: four separate diggings fed across the year */
const dstreak=(S,P)=>{ S.streak=(S.streak||0)+1; if(S.streak>=4) award(P,'footaday'); };
/* the true ending's gate: every name in the Log told to the end */
const logComplete=(P)=>Object.keys(cast).every(k=>(P.log[k]||0)>=3);
/* the draw — idempotent, callable from text AND fx so no path skips it */
const drawNums=(S)=>{ if(!S.num){ const committee=S.contrib>=4||S.role==='digger';
  S.num = committee ? (8+(4-Math.min(4,S.contrib))*5) : (88+(S.kit>=70?0:14));
  S.fnum = 104; } };
/* the word of the navigator: did the given place come home? */
const goodWord=(S)=>S.crew>=5 && S.nv.friend<2;
/* the granddaughter's editing: the first man whose story is still untold */
const UNTOLD_NAMES={ freddie:'the navigator', magpie:'the Magpie', zabek:'the Tunnel King',
  inky:'the forger', duke:'the scrounger', tiny:'Grandad', doc:'the Doc',
  reyter:'the old Kommandant', brandt:'the corporal with the photograph', weasel:'the Weasel' };
const untoldName=(P)=>{ for(const k of Object.keys(cast)) if((P.log[k]||0)<3) return UNTOLD_NAMES[k]; return null; };

/* ======================================================================
   THE GLOSSARY — kriegie one-liners (codex, title screen)
   ====================================================================== */
const glossary = [
  ['kriegie','A prisoner of war — from Kriegsgefangener, worn like a regimental tie.'],
  ['goon','Any German guard. The Germans were told it stood for “German Officer Or NCO,” and pretended to believe it.'],
  ['ferret','Anti-escape specialist in blue overalls, armed with a torch and a steel probe, at home under floors.'],
  ['penguin','A prisoner dispersing tunnel sand from bags hung inside his trouser legs. Walks with a purposeful waddle.'],
  ['stooge','A watcher. The duty pilot system logged every German in and out of the compound, all day, for years.'],
  ['cooler','The solitary-confinement block. Bread, soup, one shadow that crosses the floor like a sundial.'],
  ['appell','Roll call on the parade square, twice daily, in all weathers — the count the whole war argued with.'],
  ['tame goon','A guard cultivated with coffee, chocolate and sympathy until he fetches. See: the hook.'],
  ['the bag','Captivity. One went “into the bag” the day one’s aircraft declined to keep flying.'],
  ['Dulag Luft','The Luftwaffe’s transit and interrogation camp. Solitude first, then the friendly man, then the form.'],
  ['Big X','Head of the escape organization in a camp. There was only ever one X at a time.'],
  ['Dean & Dawson','The forgery department, named for a London travel agency. Paperwork for journeys the Reich had not approved.'],
  ['Piccadilly & Leicester Square','Harry’s two halfway houses, 100 and 200 feet out. A thing you can joke about is a thing you can live inside.'],
  ['hard-arser','An escaper travelling on foot rather than by train. Cheaper papers, longer odds, colder nights.'],
  ['wire-happy','The camp’s name for the despair that walks a man to the warning wire. Named like a weather, so it can’t be a person.'],
];

/* ======================================================================
   THE AFTERWORD — the last page. The real record. Ships with the game.
   ====================================================================== */
const afterword = `<h3>The Fifty</h3>
<p>This story is fiction built on a true frame. Stalag Luft III was real — the Luftwaffe’s camp at Sagan, Silesia, on yellow sand chosen because it betrays tunnels. The North Compound opened in the spring of 1943, and its prisoners — under an escape organization led by Squadron Leader <b>Roger Bushell</b>, RAF, “Big X” — dug three tunnels at once, named Tom, Dick and Harry, so that losing one would prove the compound clean. Tom was found and blown up in September 1943. Dick became a sand dump and a store. Harry ran 336 feet from a trap beneath a stove in Hut 104, thirty feet down, with a railway, workshops, and halfway houses named Piccadilly and Leicester Square.</p>
<p>On the night of 24–25 March 1944, in snow and blackout, the trap was found frozen, the exit broke ten feet short of the trees, and a rope signal ran the night at walking pace. <b>Seventy-six men escaped</b> before a sentry found the hole at dawn as the seventy-seventh emerged. Seventy-three were recaptured.</p>
<p>On Hitler’s personal order, <b>fifty of the recaptured officers were murdered by the Gestapo</b> — taken from prisons in small groups, driven to roadsides and fields, and shot, the files claiming escape attempts that never happened. Among them were Roger Bushell, shot near Saarbrücken, and Flight Lieutenant <b>Tim Walenn</b>, the gentle master forger of “Dean & Dawson,” who went half-blind making other men’s papers. The urns came back to Sagan by rail. The prisoners were permitted to build a memorial vault in the pines down the Sagan road. It stands there today, and it is tended.</p>
<p><b>Three men reached home:</b> the Norwegians Per Bergsland and Jens Müller, by train to Stettin and ship to Sweden, and the Dutch pilot Bram van der Stok, the long way through France to Spain. Wally Floody, the Canadian mining engineer who built the tunnels, was purged to another compound weeks before the escape — the Tunnel King never went down Harry, and it saved his life. Kommandant Friedrich Wilhelm von Lindeiner-Wildau, who had run his camp like a soldier of the old school, was arrested and court-martialed for it. The chief ferret, Hermann Glemnitz, whose craftsmanship the prisoners genuinely respected, attended their reunions after the war, and was welcome.</p>
<p>After the murders, the prisoners of North Compound began one more tunnel, under the theater. It went nowhere in particular. It was insurance, and defiance, and — as the camp doctors understood better than anyone — medicine. Its real name was <b>George</b>.</p>
<p><b>Book Two is true as well.</b> In October 1943, months before the Great Escape, three officers of the East Compound — <b>Eric Williams, Michael Codner and Oliver Philpot</b> — escaped through a 100-foot tunnel dug from beneath a vaulting horse placed daily near the wire, the vaulting masking the work from the seismograph microphones. All three reached Sweden and home: Williams and Codner by ship from Stettin, Philpot — travelling as a Norwegian margarine salesman — via Danzig. No one was recaptured and no one died. Williams told the story in <em>The Wooden Horse</em> (1949). The narrator of this game was never among them; that borrowing is the fiction's own, and openly confessed.</p>
<p>In January 1945 the camp was marched west through blizzard ahead of the Soviet advance — the Long March — and liberated in the spring.</p>
<p><em>The characters in this game are inventions wearing the true events. The names in this story were changed. These were the real ones. If the game sent you here wanting more, the record is rich: the escapers themselves wrote it down, and the fifty names are read aloud at RAF stations to this day.</em></p>
<p class="af-close"><em>This happened. The names belong to no one, so that the story can belong to all of them.</em></p>`;

return { nodes, endings, regions, CHAPTERS, cast, mentions, glossary, afterword, her,
  bindHelpers, bindP, TUNNEL_GOAL:336, START:'n_club' };
})();
