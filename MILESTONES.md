# G FOR GEORGE — Build Milestones & Checklist

*Companion to `BIBLE.md` (the what/why). This is the how, piece by piece. Work top to bottom;
every milestone ends with a verification gate — do not start the next until the gate is green.
House rules apply throughout: vanilla JS, data-driven, serve :8397 (no file://), DOM-check
everything (screenshots time out), 4+ choices per node, wrong-is-a-branch.*

---

## M0 — SCAFFOLD (the engine skeleton, no story yet) — ✅ DONE 2026-07-18

- [ ] Folder `george/`: `index.html`, `css/style.css`, `js/engine.js`, `js/storyData.js`,
      `js/ui.js`, `js/audio.js` (stub), `serve.ps1` on **:8397** (copy SOUTH's lean pattern —
      it's the freshest engine on the shelf).
- [ ] Node renderer: prose pane (first-person past-tense telling), choice list, register tag
      per node (`lark|ache|dread|elegy` — drives styling + later audio).
- [ ] State store: `tunnel` (feet + which tunnel is active), `heat` (0–10), `nerve` (per-name
      state map), `kit` (0–100), `crew` (bond), `flags`, `act`, `chapter`.
- [ ] `{HERO}`/`{FRIEND}` token substitution (defaults Kit / Freddie) + rename UI on the title
      page.
- [ ] Persistence: save slots + `gg-log` (cross-run Log), `gg-retellings` (frame memory),
      `gg-mentions` (deeds) in localStorage.
- [ ] `~` debug panel: jump-to-node, set meters, view flags.
- [ ] **`window.__ggSoak(n)` v0**: random-walk n runs; asserts no dead ends, no missing node
      refs, no crash; returns `{endings, deadEnds, errors}`.
- [ ] **GATE:** soak runs green on a 5-node dummy graph; page serves clean, console clean.

## M1 — FRAME + ACT I (playable vertical slice, ~12 story nodes) — ✅ DONE 2026-07-18
*Gate results: 14 nodes shipped (frame + Act I), `__ggSoak(300)` green (0 dead ends / 0 missing
refs / 0 errors), console clean, save→reload→resume exact, rename tokens verified in-DOM,
4 deeds wired+firing (nonames/watcher/crewtrue/firstsand), tunnel bar reveals at The Garden
with the firm's 26-foot head start. Screenshots time out on this stack as expected — all
verification was DOM-based. Bookmark ending `e_pause` closes Act I until M2.*

- [ ] Cold open, 1994: the club, the blazer, Tiny's granddaughter, "Will you?" (1 node) →
      match cut to the crash.
- [ ] The fall: G-George on fire over Essen, the jump, capture — "for you the war is over"
      (2 nodes; establishes the five dead + the guilt).
- [ ] Dulag Luft interrogation: the friendly-interrogator trap; name-rank-number gauntlet that
      TEACHES the NERVE meter (2 nodes, real branching consequences into Act II HEAT).
- [ ] Arrival at Sagan → spring '43 move into North Compound; the society (lectures, cigarette
      exchange, theater plans) — the LARK register at full volume (3 nodes).
- [ ] The naive solo scheme — player picks one of three classic bad ideas, all fail
      educationally, each leaves a different flag/scar (1 node, 3 sub-branches).
- [ ] Recruitment: the Magpie's interview; sworn in as a penguin; first sand down the trouser
      leg (2 nodes).
- [ ] Act I close: **the tunnel bar appears on the HUD** — the reveal is staged as a scene
      (1 node).
- [ ] HUD v1 live: TUNNEL bar (pencil-on-squared-paper style), NERVE, THE CREW; HEAT
      introduced in the final node.
- [ ] First 4 Log entries witnessable (Magpie, Tiny, Duke, Freddie openers).
- [ ] **GATE:** Act I playable start→act-end in browser; `__ggSoak(200)` green; DOM checks:
      HUD renders, tokens substitute, save/reload mid-act restores exactly.

## M2 — ACT II ECONOMY + ACT III NIGHT — ✅ DONE 2026-07-18
*15 Act II nodes (trade→336, incl. the hook subplot at n_hook) + 8 Act III (agency→night4).
Soak caught 3 real bugs: lottery numbers + Freddie-word verdict lived in text fns the soak never
ran (moved to `drawNums`/`goodWord` helpers callable from fx/end), and the hook HEAT gate was
unreachable after Tom's -4 wash (now ≥2). Soak now EXECUTES text/title fns. Deviation from the
bible: "Cooler and Back" became a node (n_cooler28 rejoins the camp thread — the recaptured man
reads the list) rather than a terminal ending; richer, deliberate.*

## M2 original checklist (kept for reference)

**The economy (build first, story hangs on it):**
- [ ] Season loop: WORK choice each chapter (tunnel / kit / men / goons), each with cost +
      yield; HEAT search events at thresholds (hut search, appell shakedown, mic check).
- [ ] NERVE board for named cast (steady→quiet→fevered) + the wire-drift rule when a fevered
      man is left alone.
- [ ] KIT % with named components (papers, clothes, compass, maps, German, cover story).
- [ ] Sacrificial decoy mechanic (feed the ferrets a find, HEAT drops).

**Act II beats (history in bold, on schedule regardless of player state):**
- [ ] Three-tunnels reveal + trap scenes (Harry under the warm stove in 104).
- [ ] Duke's hook in Brandt — the dirty choice (player participates or refuses; both cost).
- [ ] Theater opening night (NERVE harvest + survey cover).
- [ ] Zabek's nine hours, told at the tunnel face.
- [ ] Inky / Dean & Dawson scenes; the eyes; letters to his mam.
- [ ] **Hamburg burns** (July '43) — Brandt's telegram, witnessed.
- [ ] Freddie's Dear John — THE CREW's biggest test before the roster.
- [ ] **Tom found & dynamited** (Sept '43) — the tunnel bar DIES on screen; the Weasel
      compliments the shoring; Dick demoted to sand dump (George's foreshadow, underlined).
- [ ] **Winter halt → microphones → January restart**; sand under the theater seats.
- [ ] Sandy Cole: two wallpaper scenes, then the wire at dawn, heard from inside the hut.
- [ ] **Harry done: 336.** Act close.

**Act III — the order and the night:**
- [ ] The Travel Agency's dated papers force the schedule (KIT consequences lock in).
- [ ] The lottery at the theater: ranked places + the draw; your number and Freddie's drawn
      on screen (numbers seeded by KIT/contribution/flags).
- [ ] The knife node: what can even be SAID gates on THE CREW (give / keep / the third thing).
- [ ] Escape night, minute-by-minute, one node per beat: frozen trap (90 min) → **ten feet
      short** → the rope signal improvised → **air-raid blackout** with men in the tunnel →
      the sand fall → the dying schedule → your number resolves (out / in the tunnel / at the
      window) → **4:55, the shot, seventy-six**.
- [ ] **GATE:** `__ggSoak(500)` green AND asserts the fixed-history beats fire in every
      branch on schedule; economy sanity DOM-checked (HEAT search triggers, NERVE wire-drift,
      KIT gates); the night reachable with all three number-fates.

## M3 — ACT IV + ENDINGS + THE ROLL + AFTERWORD — ✅ DONE 2026-07-18
*14 Act IV nodes (roads + camp threads), 11 real endings + legacy bookmark: needle, longwalk,
uniform†, man77†, given_stockholm, given_list, garden, roadwest, appell†, hook†, roll (†=counter-
factual license). Gates green: soak 3000 runs 0 errors, every ending hit or targeted-walk-proven
(needle 1/2000 = correctly rare), Log completes in 2 well-played retellings, Roll choice appears
at the club when complete, afterword prints the real names, glossary + Last Page buttons live,
GEORGE bar renders "no end mark", audio (M5 item) already built: register pads, George's theme,
appell snare, THE SILENCE on region list. Console clean.*

## M3 original checklist (kept for reference)

**The roads (if out):**
- [ ] Sagan station check in the small hours — papers vs torch (KIT decides).
- [ ] The hard-arser walk south; trains-vs-feet arithmetic.
- [ ] The needle's eye: Baltic docks → Swedish hold (gated KIT+CREW, rarest path).

**The camp (all roads return here in the telling):**
- [ ] The appell that won't add up; **von Reyter relieved & court-martialed** — the roof gone.
- [ ] **The list week**: rumor → 41 names under the eagle → grows to 50 (Vane, Inky ON it);
      audio-silence hook stubbed for M5.
- [ ] Urns by rail; **the memorial** the prisoners build.
- [ ] **GEORGE**: Doc proposes it, the narrator names it; the bar with no end mark; digging
      as grief-work.
- [ ] **The Long March** (Jan '45, 3 a.m. order, snow, SOUTH-style named-survivor counting)
      → liberation → the boat → "at least you sat it out safe."

**Endings & meta:**
- [ ] All ~15 ending cards written in the elegy register, each closing in the club (per
      BIBLE §9): Needle's Eye, Long Walk, Cooler and Back, Other Uniform†, Man 77†, Given
      Place ×2 tiers, Kept Place, The Garden (graded), Road West, Long Appell†, Quiet Hook†
      († = counterfactual license framing — "deal me a different number").
- [ ] THE LOG: every named man's entry (best scene + fate), cross-run persistence, the
      granddaughter asks about skipped men on retellings.
- [ ] Retelling greetings (2nd, 3rd, nth visit variants).
- [ ] **True ending "Answering the Roll"**: gated on Log complete; the roll, the "Here"s,
      "All present. All accounted for."
- [ ] MENTIONS IN DISPATCHES: 24 deeds wired + gallery UI.
- [ ] **The afterword page "The Fifty"** — the true record, the real names our characters
      wore, the three who made it, the memorial that stands. NOT optional; the game does not
      deploy without it.
- [ ] Codex/glossary (kriegie → hard-arsers, per BIBLE §11).
- [ ] **GATE:** `__ggSoak(1000)` green: every ending reachable, Log fillable, all 24 deeds
      attainable, no orphan nodes; full playthrough of at least 3 contrasting runs by hand
      (needle's eye / the garden / a counterfactual) DOM-verified; save/reload at every act
      boundary round-trips.

## M4 — ART PASS — ✅ DONE 2026-07-18
*16 scenes + og for ~32cr (nano_banana_2 @2cr, balance 196.9→~165). Montage-vetted in one Read —
palette law held (yellow=sand only, amber=home only, no insignia). Installed as JPG q86 in
assets/scenes/; images.js + image-first paintScene with SVG fallback. 9 lower-traffic regions
(silk/dulag/scheme/cooler/appell/station/walk + shared) stay procedural on purpose — candidates
for a future top-up. No portraits this pass (same).*

## M4 original checklist (kept for reference)

- [ ] SVG fallbacks confirmed shipping for every scene/ending (they exist from M1–M3; art
      only upgrades).
- [ ] Budget check: nano_banana ~2cr/image; plan ≈16 scenes + 15 ending cards + ~10 portraits
      + og-card ≈ **50–70cr**. Sheet-slice (multiple panels per gen) wherever composition
      allows — the icon-sheet trick halves this.
- [ ] Palette lock per BIBLE §10: gouache on airmail paper; RAF blue-grey / pine / topsoil /
      cream; amber = memory & home ONLY; **yellow sand = the danger color** (its presence in
      frames tracks HEAT); no regalia closeups.
- [ ] Portraits: the committee + Freddie + the three Germans (period-drab, faces not
      glamor).
- [ ] og-card + THE ROOM book cover art.
- [ ] **GATE:** montage-vet every image before install (one Read of the montage, never
      per-image); all art has onerror SVG fallback; page weight sane.

## M5 — AUDIO + POLISH + DEPLOY — ✅ DONE 2026-07-18 · **SHIPPED & LIVE**
*Live: https://kylefriesmarketing.github.io/george/ (repo kylefriesmarketing/george, Pages main).
Audio: register pads + George's theme + appell snare + THE SILENCE (region 'list' stops all
music; memorial got its own 'vault' region so music returns at the dedication). THE ROOM: shelf
book (row 1), hub card, kid-greeting + notebook progress (gg_persist, 12 tellings), sitemap —
games repo 74bd534. SHIP GATE GREEN: 1000-run soak on the DEPLOYED build, 0 problems, 9 endings
hit live, art loading, console clean. Remaining nice-to-haves: name-your-telling UI, portraits,
mobile deep-pass (works, untuned).*

## M5 original checklist (kept for reference)

- [ ] Leitmotifs (WebAudio synth, all original): George's theme (4-bar whistle, learned in
      the Act I crash, recurs), tunnel (earth drone + breath + trolley rope-creak), home
      (music box that detunes as letters thin), appell (snare + cold air).
- [ ] **The silence system**: from the first list rumor to the last name, ALL music stops —
      wire it as a real audio state, not an absence.
- [ ] Register-driven ambience (lark/ache/dread/elegy) + mute toggle persisted.
- [ ] Polish: keyboard nav, reduced-motion, mobile/touch pass, typewriter-text with
      click-to-complete (house pattern).
- [ ] Deploy: new GitHub repo `george` (gh CLI, kylefriesmarketing), Pages + `.nojekyll`,
      README with a screenshot.
- [ ] THE ROOM integration: hub list entry + 3D shelf book in `games-hub/js/room.js`
      (⚠️ parallel sessions push that repo — `pull --rebase` first; read the v4–v6 gotchas).
- [ ] **GATE (ship gate):** `__ggSoak(1000)` green on the deployed build; live-site DOM
      checks (HUD, save, rename tokens, Log across two visits); console clean; afterword
      page reachable from every ending; hub book opens the game.

## M6 — THE JOURNAL & THE AUDIT — ✅ DONE 2026-07-18

- [x] **Her notebook**: `P.journal` (cap 60) in the Tellings gallery; entries renameable
      inline (click title → input; rename persists; original shown as "it came out as …").
- [x] **Her line**: all 12 endings carry `her` reactions (STORY.her map, #ending-her).
- [x] **The residue remembers**: title screen quotes last telling's title.
- [x] **THE DEEDS AUDIT**: 24/24 Mentions earned across exactly three chained tellings
      (camp-sweep → The Garden, kit-max docks → The Needle's Eye, then Answering the Roll).
      No game fixes needed — every deed was honestly reachable.
- [x] **GATE:** 24/24 + soak green + rename persistence + roll-with-her-line all DOM-verified;
      console clean; deployed.

## M7 — BOOK TWO: THE HORSE — ✅ DONE 2026-07-18 (checklist below as built)

The true Wooden Horse escape (East Compound, same camp, autumn '43 — three out, ALL THREE
home), told by our narrator as the camp legend he has imagined himself into ever since.
**The license inverts**: history here is fixed as SUCCESS, so the dark branches are the
narrator flinching — and the granddaughter interrupts and corrects the record ("That's not
how it went"), and the telling rights itself. Wrong-is-a-branch, not an ending.

- [x] 12 nodes + 2 flinch interrupts + `e_horse` (kind home) + her line ("ALL THREE").
- [x] Gated club entry (req one prior telling); tunnel bar horse variant (100 ft, "from the
      horse"), scripted to 100 at the break like Harry's 336.
- [x] +3 Mentions (registry now 27); soak seeds half its runs as retellings — e_horse hit
      202/2000 in soak; both flinch paths verified correcting back to the record.
- [x] 2 new scenes (4cr) + procedural fallbacks; afterword gained the true Wooden Horse
      paragraph (Williams/Codner/Philpot, the borrowing openly confessed).
- [x] **BONUS ENGINE FIX the gate caught:** stale choice buttons could re-fire an ending on
      double-click (inflating runs + journal) — ending() now clears #choices.
- [x] **GATE:** soak green, straight + flinch + deeds walks green, one-journal-entry-per-
      telling verified, console clean, deployed.

## M8 — BOOK THREE: THE RELAY — ✅ DONE 2026-07-18 · gates green (soak 73 relay
completions/2000 seeded runs; careful+loose walks both land; chain chip live at 4+ hands;
all 3 deeds; one-journal-entry verified; console clean; deployed + hub bumped to 14 tellings
with "three true books" card copy).

The third home run of the real escape — the long road through occupied Europe (after the
real Bram van der Stok's route, names changed as ever) — told to read THE HELPERS into the
record: the schoolmistress, the courier girl, the priest, the mountain guide, the two never
named. The traveler's survival is fixed history; the weight is the chain's fates, which he
tries to skip and she makes him finish. New light mechanic: THE CHAIN (hands counted on the
HUD). Unlocks after Book Two is told.

- [ ] ~12 nodes: out at eighteen → the trains west → his own street, the door not knocked →
      the safehouse rules → the courier girl → the other country's Inky → the line rolled up
      behind him → passeur country → the Pyrenees at night → Gibraltar → the Ledger of Hands.
- [ ] `e_relay` (kind home) + her line; +3 Mentions (The Door Not Knocked / Hand to Hand /
      The Ledger of Hands) → registry 30; afterword gains van der Stok + THE HELPERS.
- [ ] 3 new scenes (canal dusk, the safehouse attic, the Pyrenees crossing) ≈ 6cr.
- [ ] Hub totals bump (14 tellings) in games repo.
- [ ] **GATE:** soak (seeded with e_horse) green, e_relay + deeds reachable, chain chip
      renders, live deploy.

## M9 — THE FINISH (A+B+C+D) — ✅ DONE 2026-07-18

- [x] **A · Audio v2** (audio.js rewritten): music-box lullaby phrase detuning by chapter;
      camp wind / tunnel earth+creaks / club room-tone / harbor rumble layers; Book Two
      music-hall lilt on horse regions; THE RELAY theme (four voices, each starting where
      the last let go, the small silence of the handover between); richer per-kind stings;
      THE SILENCE untouched. 0cr. *Code paths exercised headless; give it ears in a real tab.*
- [x] **B · Options & Cold Telling**: 4-row options panel (persisted in P.opts), HTML-safe
      typewriter with click-to-complete, text-lg/contrast/cold classes; cold deed "The
      Unwatched Ledger" verified on a full cold Book One run — registry 31.
- [x] **C · Presentation**: Ken Burns on scenes (reduced-motion safe), page-turn sweep on
      chapter stamps, ending art as a rotated white-framed photograph with a notebook caption.
- [x] **D · Share cards**: Keep This Page — 1200×630 canvas card (scene art + airmail border
      + telling title/number/kind + url), local download, "THE PAGE IS KEPT" toast.
- [x] **GATE:** soak 1500 green; typewriter types + completes; HUD hidden cold; cold deed
      awarded on The Other Uniform; caption + card + toast verified; console clean; deployed.

## M10 — THE KEEPER (capstone + completion + a11y) — ✅ DONE 2026-07-20

- [x] **The Keeper capstone**: gated on all three books + the roll (keeperReady = e_roll &&
      e_horse && e_relay); club choice → n_k1 → e_keeper (kind true) "The Light Does Not Go
      Out" — the old man's fear was being the last one who knew; the frame passes to her (4
      variants: give the notebook / sworn in / the map from the pocket / her name on the
      strength). Deed 32 "The Keeper"; her line. Gate proven exact (none/roll/roll+horse all
      false; all-three true).
- [x] **Completion strip**: title screen shows 4 pillars (Book One / Two / Three / roll) →
      Keeper note; guides completionists to the last page.
- [x] **Accessibility pass**: focus moves to node-title on every render (SR announces the new
      passage); gallery opens focus the close button + Escape closes from anywhere + overlay
      owns keys while open; per-choice aria-labels ("Choice N: …").
- [x] **GATE:** soak 2500 green; live end-to-end Keeper telling (choice first & gated, node,
      ending, deed, completion note, Tellings entry); gallery focus+Esc; console clean. 0cr.

## M11 — THE NOTEBOOK KEEPS (quality-of-life + a11y, 0cr) — ✅ DONE 2026-07-20

- [x] **Notebook export/import** (shelf share-code pattern): `GG1.`+base64 of runs/endings/log/
      mentions/names/journal; import MERGES union-max (counts→larger, log→deeper stage, runs→max,
      longer journal kept) so restoring never loses local progress. Proven two-device: exactly
      5 endings / 4 mentions / tiny log 1→3 / runs→9. Options → "the notebook keeps".
- [x] **Focus-visible ring**: keyboard nav visibly outlined across links/buttons/inputs/choices
      (contrast variant thickens it); passage focus stays silent.
- [x] **Choice numbers** (opt-in): 1–9 badges on choices; the number keys always worked, now
      discoverable. Render + key-fire verified.
- [x] **OS high-contrast auto-default**: first-ever load seeds opts.contrast from
      `prefers-contrast: more`.
- [x] **GATE:** soak green, merge lossless + accurate message, numbers render + keys fire,
      focus-visible rule live, console clean, deploy.

## M12 — HARDEN & RESPECT (engineering rigor, 0cr) — ✅ DONE 2026-07-20

- [x] **Reduced-motion, comprehensively**: replaced two partial blocks with the recommended
      global neutralizer + explicit `animation:none` kills for the infinite offenders (Ken Burns,
      page-turn, the Keeper's urge pulse); the clock-rail SMIL ripple is now skipped in JS when
      `reducedMotion()`. First load also auto-defaults reveal→'instant' under prefers-reduced-motion.
- [x] **Save robustness**: `loadRun()` now validates (object + existing node) and discards/clears
      corrupt or stale saves instead of white-screening; Continue merges the save over a fresh
      skeleton so a pre-M8 save missing S.nv/chain/flags can't crash the HUD. Proven: garbage/
      empty/bad-node all → null+cleared; an old-style {node,feet} save resumed and painted the
      HUD (S.nv filled) with no error.
- [x] **Richer README**: three-books structure, playing/accessibility/under-the-hood, real-names
      note — the repo's front door.
- [x] **GATE:** soak green; robustness matrix + real old-save resume verified; SMIL suppressed
      under forced reduced-motion; console clean; deploy.

---
M0+M1 are one sitting (the slice proves the voice).
M2 is the long march — the economy first, then beats in calendar order. M3 before ANY art.
M4/M5 can swap if credits are thin (audio is free, art isn't).
