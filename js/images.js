/* =====================================================================
   G FOR GEORGE — images.js
   The painted scenes (M4 art pass). Any key not listed here falls back
   to the procedural gouache in art.js — the game is whole either way.
   ===================================================================== */
const IMAGES = (() => {
  const keys = new Set(['title','club','fire','gate','compound','tunnel','theater',
    'hole','list','marchw','docks','sand','hut104','home','night','winter',
    'silk','dulag','scheme','cooler','appell','vault','horse','inhorse',
    'canal','safehouse','pyrenees']);
  return {
    has: k => keys.has(k),
    url: k => 'assets/scenes/' + k + '.jpg',
  };
})();
