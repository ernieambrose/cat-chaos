# Cat Chaos — Game Design Spec
**Date:** 2026-04-10  
**Status:** Approved

---

## Overview

A browser-based 2D physics game in the style of Angry Birds, built for Felix (10) and Junie (7). Players launch cats from a yarn-ball slingshot at dog-built structures to protect the cats' cozy nap spot. Features a table-knockoff chaos mechanic, distinct cat breeds with unique abilities, and a progressive unlock system.

Target platform: Browser (HTML5). Future: wrapped for iOS/Android App Store via Capacitor.  
Deployment: GitHub Pages (private repo, shareable URL).

---

## Core Gameplay Loop

1. Player launches cats from a yarn-ball slingshot at structures on the right side of the screen
2. Dogs shelter inside/behind those structures and are trying to reach the cats' nap spot on the left
3. Destroy all dogs before running out of cats to win
4. Tables with objects are scattered around levels — cats passing near them knock items off, enabling chain reactions
5. If any dog reaches the nap spot, the player loses
6. Star rating (1–3 fish bones): 1 star = all dogs defeated, 2 stars = at least 1 cat remaining, 3 stars = at least 2 cats remaining

The cat queue for each level is fixed and visible before launch, enabling strategic planning.

---

## Cat Roster (v1)

Three cats, introduced progressively:

### Mittens *(available from Level 1)*
- **Breed:** Tabby, medium size
- **Ability:** None — standard physics, reliable bounce
- **Role:** Tutorial cat, learn the mechanics
- **Design note:** Classic cute tabby, expressive face

### Colonel Fluffington *(unlocked after Level 2)*
- **Breed:** Maine Coon, large/chonky
- **Ability:** Passive — high mass, crashes through structures, minimal bounce
- **Role:** Heavy hitter, Felix's physics-optimizer cat
- **Design note:** Big, fluffy, slightly smug expression

### Duchess *(unlocked after Level 5)*
- **Breed:** Siamese, small/sleek
- **Ability:** Active — tap/click mid-flight to trigger a speed burst; ricochets off walls
- **Role:** Precision cat, threads gaps, satisfying to master
- **Design note:** Elegant, big eyes, Junie's favorite

Each cat's size directly affects physics (mass, bounce coefficient) — breeds are not just cosmetic.

---

## Level Structure — World 1: "The Nap Napper Incident"

| Level | Cats Available | New Element |
|-------|---------------|-------------|
| 1 | Mittens ×3 | Basic wooden structures, 2 dogs |
| 2 | Mittens ×3 | Tables with knockable items |
| 🎉 | — | **Colonel Fluffington unlock celebration** |
| 3 | Mittens ×2, Colonel ×1 | Heavier stone blocks |
| 4 | Mittens ×2, Colonel ×2 | Multi-story structures |
| 5 | Mittens ×2, Colonel ×3 | Chain-reaction table setups |
| 🎉 | — | **Duchess unlock celebration** |
| 6 | All three cats | Boss level — complex structure, many dogs |
| Bonus | All three cats (fixed queue, generous count) | Maximum chaos, hidden path |

**Unlock celebrations:** A full-screen moment showing the new cat, their ability, and a prompt to name them. This is the designed handoff point for Felix and Junie to participate — they rename the cat and optionally suggest a new ability for a future cat.

---

## Technical Architecture

### Stack
- **Vite** — dev server and build tool, near-instant hot reload
- **Phaser 3** — game loop, sprite rendering, input handling, scene management
- **Matter.js** — physics engine (integrated into Phaser), handles weight, collision, structural collapse
- **GitHub Pages** — deploy `dist/` output; auto-deploy via GitHub Action on push to `main`

### Project Structure
```
cat-chaos/
  src/
    scenes/         # MainMenu, Game, LevelComplete, UnlockCelebration
    entities/       # Cat, Dog, Structure, Table, NapSpot
    levels/         # JSON level data files
    assets/         # Sprites, sounds, fonts
  docs/
    superpowers/
      specs/        # This file and future specs
```

### Level Data
Levels are defined as JSON config files — no code changes needed to add or modify levels. This makes it accessible for Felix to eventually design his own levels.

---

## Art & Visual Direction

- **Style:** Pixel art, 32×32 sprites (enough detail for expressive cat faces)
- **Palette:** Warm, saturated colors; soft pastel backgrounds (cozy house interiors — living rooms, kitchens); high-contrast sprites
- **Staged asset approach:**
  - Prototype: colored rectangles, placeholder sprites — validate physics feel first
  - v1: custom or adapted pixel art; cats have big eyes and expressive faces (Junie's requirement)
- **UI:** Chunky pixel font, large touch-friendly buttons (tablet-ready from day one); star ratings shown as fish bones
- **Sound:** Chiptune-style SFX (Kenney.nl asset packs); short cozy looping background track

---

## Deployment

- **Repo:** `github.com/ernieambrose/cat-chaos` (private)
- **CI/CD:** GitHub Action — on push to `main`, runs `vite build`, deploys `dist/` to GitHub Pages
- **Live URL:** `ernieambrose.github.io/cat-chaos`
- **Future:** Capacitor wrapper for App Store / Play Store packaging

---

## Scope Boundaries (v1)

**In scope:**
- World 1 (6 levels + bonus)
- 3 cat types with distinct physics + abilities
- 2 unlock celebration screens
- Table knockoff chain mechanic
- 1–3 fish bone star rating
- GitHub Pages deployment

**Out of scope for v1:**
- Multiple worlds
- More than 3 cat types
- Sound/music (nice to have, not blocking)
- Mobile app wrapping
- Level editor UI
- Leaderboards or save-to-cloud
