# G FOR GEORGE — HANDOFF
### Everything needed to pick this project up cold, by a new session, a different AI, or Kyle alone.
*Written 2026-07-20, after milestone M20. If this file and the repo survive, the project survives.*

---

## 0. What this is, in one paragraph

**G FOR GEORGE** is a finished, deployed, branching playable book about the true escapes from
Stalag Luft III — the Great Escape, the Wooden Horse, and the long walk home across occupied
Europe. It is told in 1994 by the last survivor of Hut 104 to his dead friend's granddaughter,
so **replaying is diegetically retelling**. The events are true and source-checked; the names
are changed; the last page prints the real ones. It is vanilla JS, no build step, no
dependencies, and it is live on GitHub Pages as part of Kyle's THE ROOM hub.

**Play it:** https://kylefriesmarketing.github.io/george/

---

## 1. Where everything lives

| Thing | Location |
|---|---|
| **Live game** | https://kylefriesmarketing.github.io/george/ |
| **Repo** (public) | `kylefriesmarketing/george` — branch `main`, Pages serves `main` / root |
| **Local working copy** | `C:\Users\kylef\Downloads\New folder\george\` — *its own git repo in that subfolder* |
| **The hub (THE ROOM)** | repo `kylefriesmarketing/games`, local `C:\Users\kylef\Downloads\New folder\games-hub\` |
| **Local dev server** | `george/serve.ps1`, **port 8397**, registered in `.claude/launch.json` as `george` |
| **Design bible** | `george/BIBLE.md` — the why: pitch, registers, cast, structure |
| **Build log** | `george/MILESTONES.md` — every milestone M0–M20 with its verification gate |
| **This file** | `george/HANDOFF.md` |

**Recreating from nothing:** `git clone https://github.com/kylefriesmarketing/george` — that's it.
There is no build, no npm, no bundler. Open `index.html` through a local server (not `file://`).

---

## 2. How to run and verify it

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File george/serve.ps1 -Port 8397
```

**⚠️ Screenshots do not work on this stack.** They require the Browser pane to be *displayed*
and time out otherwise. All verification in this project is therefore done by **DOM and
computed-style probes**, which has worked extremely well — it has caught more real bugs than
looking would have. The house methods:

**The soak** (graph integrity, built in):
```js
window.__ggSoak(1500, 42)   // → {ok, endings, deadEnds, missing, errors}
```
It executes node `text`/`title` functions on purpose — several real bugs lived only inside
those functions. Never "optimise" that away.

**The corpus probe** (verify prose/content changes) — render every node and ending text
function across seeded states, concatenate, then regex it. Roughly 151k characters:
```js
const S0=()=>({node:'n_club',feet:0,heat:0,kit:0,crew:3,nv:{hero:0,friend:0},contrib:0,
  cooler:0,role:null,tun:'harry',streak:0,nell:0,num:0,fnum:0,chain:[],flags:{}});
const P0=()=>({runs:1,endings:{e_horse:1,e_relay:1,e_roll:1},log:{},mentions:{},
  names:{hero:'Kit',friend:'Freddie'},journal:[],opts:{}});
let corpus=''; Object.values(STORY.nodes).forEach(n=>{
  if(typeof n.text==='function'){try{corpus+=n.text(S0(),P0());}catch(e){}} else corpus+=n.text||'';});
```

**The archetype harness** (balance/economy) — score every available choice by its meter deltas
and let a weighted "strategy" play itself, e.g. `{feet:1,kit:0,crew:0,heat:0}` = dig-hard.
200 seeded runs per archetype. The full implementation is in the **M18 commit message**; re-run
it before ever touching balance numbers.

**Contrast/typography probe** — a hidden `<span>` with the paragraph's computed `font` measures
character width, giving true characters-per-line; WCAG ratios are computed from
`getComputedStyle` colours. Used in M16 to find a real accessibility failure.

---

## 3. Current state — done, and honestly

**20 milestones complete.** The game is content-complete, deployed, and verified.

- **M0–M5** engine, all four acts, 11 endings, art (22 gouache scenes), audio, deploy, hub entry
- **M6** her notebook (journal of tellings, renameable) + the 24-deed audit
- **M7** **Book Two: the Wooden Horse** — the escape that worked clean; the counterfactual
  licence *inverts* (his flinches are the lies and she corrects the record)
- **M8** **Book Three: the Relay** — the long way home, told to read the *helpers* into the
  record; ends on the Ledger of Hands
- **M9** audio v2, Options + Cold Telling, presentation, share cards
- **M10** the Keeper capstone (all three books + the roll) + completion strip + a11y
- **M11** notebook export/import codes (`GG1.…`), focus rings, choice numbers
- **M12** comprehensive reduced-motion, save robustness, README
- **M13** the Reader's Companion (three books on one true timeline) + mobile pass
- **M14** bug sweep — 4 real bugs
- **M15** injection sweep — **fixed a stored-XSS vector**
- **M16** visual pass — typography, drop caps, paper, mounted art, **contrast fix**
- **M17** **historical accuracy audit** — 4 real errors corrected against sources
- **M18** **economy audit** — CREW was a one-way ratchet, KIT was free; both fixed
- **M19** editorial pass — measured 18,111 words; *the flab hypothesis was disproved*
- **M20** retelling variants — the teller notices he has covered this ground before

**Numbers as of now:** 14 endings (all reachable) · 32 Mentions in Dispatches · 87 prose units ·
~18,100 words · 22 scene paintings + 10 cast portraits · 14 retold passages · hub total 14.

---

## 4. Architecture

```
george/
  index.html      all markup, all screens
  css/style.css   everything visual; M16 "visual pass" block is the typography/paper layer
  js/data.js      ALL content: nodes, endings, her lines, retold, cast, mentions,
                  glossary, companion timeline, afterword. Content changes go HERE.
  js/engine.js    render loop, meters, persistence, options, share cards, __ggSoak
  js/art.js       procedural SVG scenes — the fallback beneath every painting
  js/images.js    which scene keys have real art
  js/audio.js     WebAudio leitmotifs (no files)
  assets/scenes/  22 gouache scenes    assets/cast/ 10 portraits    assets/og.jpg
```

**Data shapes:**
- node: `{ region, reg:'lark'|'ache'|'dread'|'elegy', title, text(S,P), choices:[…] }`
- choice: `{ t, pre?, req?(S,P), feet?/heat?/kit?/crew?, fx?(S,P), go|end }` (`go`/`end` may be functions)
- run state `S`: `feet, heat, kit, crew, nv{hero,friend}, contrib, role, tun, num, chain[], flags{}`
- persist `P`: `runs, endings{}, log{}, mentions{}, journal[], seen{}, names{}, opts{}`

---

## 5. The expensive knowledge — traps that cost real time

1. **`esc` and `cleanName` MUST stay declared above `loadP`** in engine.js. `let P=loadP()` runs
   at module load; putting them lower is a temporal-dead-zone error that **white-screens the
   entire game**. Hit while fixing the XSS; caught pre-ship.
2. **`n_docks` / `e_needle` never appear in random soak walks — this is not a bug.** They sit
   behind a `KIT>=75` gate by design; The Needle's Eye is meant to be the rarest road. Proven
   reachable by targeted walk. **Do not "fix" it.**
3. **The soak must execute `text`/`title` functions.** Two real bugs (the lottery draw and the
   Freddie-verdict) lived only inside them and were invisible to a walk that skipped them.
4. **`(pointer: coarse)` is not reported by the Browser-pane emulator.** The mobile CSS
   deliberately also matches `(max-width:720px)`. That is not redundancy — removing it makes
   the tap-target fixes unverifiable.
5. **Screenshots time out** (pane must be displayed). Use the DOM probes in §2.
6. **Player names are the only user text reaching `innerHTML`,** and they travel inside
   shareable notebook codes. They are sanitised at *every* boundary and escaped at render.
   Keep it that way if you add any new place a name is displayed.
7. **`String.replace` with a replacement *string* interprets `$&`.** Name substitution uses
   function replacements for this reason.
8. **Endings must equal the hub total.** The share card says "one of N tellings" and
   `games-hub/js/room.js` records a total (currently 14, in two places). Changing the ending
   count means changing both, or completionists stall forever.
9. **GitHub Pages can wedge during incidents.** If a build sticks on "building", an
   empty commit re-triggers it; otherwise wait it out. The repo is never the problem.
10. **Commit messages with quotes/apostrophes break PowerShell here-strings.** Write the message
    to a file and use `git commit -F <file>`.

---

## 6. The design contract — read before writing any new prose

- **Voice:** first person, past tense, an old man at a 1994 reunion dinner. Four registers, and
  the discipline between them *is* the quality bar: **lark** (the camp's gallows comedy — it is
  load-bearing, not relief), **ache** (letters, tedium, home), **dread** (procedural, never
  supernatural), **elegy** (the frame; every ending).
- **Understatement is the house style.** The prose never cries; the reader does.
- **Violence is aftermath and paperwork** — a notice, a list, urns on a platform. Never onscreen.
- **The history is fixed; the thread is free.** Big beats happen on schedule; where *your* number
  falls in them is the game. Wrong is a branch, not a retry.
- **Never invent dishonour for a real man,** and never let player agency change a recorded fate.
  The invention budget is spent on *people* — the committee, the crew, the helpers — and on the
  human weather around documented events.
- **Deliberate refrains exist and must survive edits:** Doc's *"deep enough to stand up straight
  in"*, the schoolmistress's *"because you are somebody's"*, the 336 feet.
- **Every node gets 4+ choices.**

---

## 7. What is left

**Nothing is owed.** The game is finished. Remaining ideas, all optional, all costing Higgsfield
credits (balance at time of writing: **316.8**, plan "plus"):

| Idea | Est. | Note |
|---|---|---|
| Art for the 5 regions still borrowing scenes | ~10cr | lottery, garden, trade, order, agency |
| 15 bespoke ending cards | ~30cr | endings currently reuse scene art; they're the shareable image |
| Narrator VO, 10–12 surgical lines | **test first** | bills *per second*, rate has moved ~10×. Generate ONE line, read `transactions`, then size the batch |
| Short trailer video | ? | reach, not craft |
| Upscale 22 scenes to 2K | modest | polish |

**⚠️ The line to hold:** keep all imagery **painted, never photorealistic**, and **never generate
a likeness of a real named man** (Bushell, Walenn, van der Stok…). Fifty of them were murdered
and they are named in the afterword; a fabricated "photograph" of a real murdered officer should
not exist, and it would break the game's own contract — *the names belong to no one*.

---

## 8. Paste this into a fresh AI session to resume

> I have a finished browser game called **G FOR GEORGE** — a branching playable book about the
> true escapes from Stalag Luft III, told by the last survivor at a 1994 reunion. It is live at
> https://kylefriesmarketing.github.io/george/ and the source is at
> `github.com/kylefriesmarketing/george` (also locally at
> `C:\Users\kylef\Downloads\New folder\george`, its own git repo, served on port 8397 via
> `serve.ps1`).
>
> Read `HANDOFF.md` first, then `MILESTONES.md` for build history and `BIBLE.md` for design.
> HANDOFF §5 lists traps that will otherwise cost you hours — especially: screenshots don't work
> on this stack (verify via DOM/computed-style probes), the soak must execute text functions, and
> `esc`/`cleanName` must stay declared above `loadP` in engine.js.
>
> The game is content-complete at milestone M20 with nothing owed. Before changing anything, run
> `window.__ggSoak(1500, 42)` in the browser console and confirm `ok:true`.

---

*The light is on in Hut 104. — handed over at M20.*

---

## 9. Addendum — the Higgsfield pass (M21–M22)

**M21 · art completed.** Seven scenes that were borrowing another region's painting or falling
back to procedural SVG (`trade`, `order`, `lottery`, `agency`, `garden`, `station`, `walk`) now
have their own, and **all 14 endings have bespoke cards**. Ending art keys are namespaced
`end_*`; `images.js` routes those to `assets/endings/` and everything else to `assets/scenes/`,
so the engine needed no change. `art.js` holds `END_FALLBACK` so a missing card degrades to a
sensible procedural scene.

**M22 · the teller's voice.** Twelve spoken lines (`STORY.vo` → `assets/vo/*.mp3`, mono 24k,
588 KB total) at the moments that already carry. `playVO()` reuses one Audio element, won't
repeat on a re-render, and yields to both global mute and the new **"the teller's voice"**
option (default on). Autoplay refusal and missing files are treated as silence.

**Costs, measured this pass:** images **2 credits each**; `seed_audio` speech **0.6 credits a
line** (preflight with `get_cost:true` before committing to a batch — the rate has moved ~10×
historically). Total spend: **~51 credits**. Voice preset: **Arthur**
(`30fc8796-ceb6-4a66-b3a7-4a145ef7f346`) — chosen by Kyle from samples.

⚠️ **I cannot hear.** The voice was selected by Kyle from generated samples, not by me. If
narration is ever re-judged or extended, generate a sample and ask rather than assuming.

⚠️ Still holding: **painted only, never photoreal, never a likeness of a real named man.**
