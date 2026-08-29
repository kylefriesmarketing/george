/* =====================================================================
   G FOR GEORGE — images.js
   The painted scenes and the ending cards. Any key not listed here
   falls back to the procedural gouache in art.js — the game is whole
   either way.  Keys prefixed 'end_' are ending cards and live in
   assets/endings/; everything else is a scene in assets/scenes/.
   ===================================================================== */
const IMAGES = (() => {
  const scenes = new Set(['title','club','fire','gate','compound','tunnel','theater',
    'hole','list','marchw','docks','sand','hut104','home','night','winter',
    'silk','dulag','scheme','cooler','appell','vault','horse','inhorse',
    'canal','safehouse','pyrenees',
    'trade','order','lottery','agency','garden','station','walk']);
  const endings = new Set(['needle','longwalk','uniform','man77','given_stockholm',
    'given_list','garden','roadwest','appell','hook','roll','horse','relay','keeper']);
  const isEnd = k => typeof k==='string' && k.startsWith('end_');
  return {
    has: k => isEnd(k) ? endings.has(k.slice(4)) : scenes.has(k),
    url: k => isEnd(k) ? 'assets/endings/' + k.slice(4) + '.jpg'
                       : 'assets/scenes/' + k + '.jpg',
  };
})();
