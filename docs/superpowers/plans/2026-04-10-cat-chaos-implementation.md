# Cat Chaos Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based Angry Birds-style game where players launch cats from a slingshot to defeat dogs and protect the cats' nap spot, with physics-based destruction, a table-knockoff chain mechanic, and a progressive cat unlock system.

**Architecture:** Phaser 3 handles the game loop, scenes, sprites, and input. Matter.js (via Phaser's built-in physics integration) handles rigid-body simulation — weight, bounce, structural collapse. Level data lives in JSON files parsed by a LevelLoader utility. Vitest unit-tests all pure-logic modules (level loading, star calculation, cat config). Placeholder graphics are generated programmatically so the game is fully playable before any pixel art exists.

**Tech Stack:** Vite 5, Phaser 3 (Matter.js physics), Vitest, GitHub Pages (GitHub Actions CI/CD)

---

## File Map

```
cat-chaos/
  index.html
  vite.config.js
  package.json
  .gitignore
  .github/
    workflows/
      deploy.yml
  src/
    main.js                         # Phaser game init, scene registry
    config/
      gameConfig.js                 # Phaser config object
      cats.js                       # Cat type definitions (physics, abilities, unlock level)
    scenes/
      Boot.js                       # Minimal boot, transitions to Preload
      Preload.js                    # Generate placeholder textures, load assets
      MainMenu.js                   # Title screen, level select button
      Game.js                       # Main gameplay scene
      HUD.js                        # Overlaid scene: cat queue, score display
      LevelComplete.js              # Stars, next level / retry buttons
      UnlockCelebration.js          # Full-screen new cat reveal
    entities/
      Slingshot.js                  # Drag-to-aim, release-to-fire mechanic
      Cat.js                        # Base cat — physics body, launch state
      CatMittens.js                 # Standard cat (no ability)
      CatColonel.js                 # Heavy cat (high mass, low bounce)
      CatDuchess.js                 # Fast cat (speed burst on click mid-flight)
      Dog.js                        # Walks toward nap spot
      Structure.js                  # Wood/stone physics block
      Table.js                      # Table with items that fall on impact
      NapSpot.js                    # Protected zone — dog contact = game over
    levels/
      level1.json
      level2.json
      level3.json
      level4.json
      level5.json
      level6.json
      levelBonus.json
    utils/
      LevelLoader.js                # Parse level JSON, return normalized data
      Stars.js                      # Calculate fish-bone star rating
      Progress.js                   # localStorage read/write for unlocks
  tests/
    LevelLoader.test.js
    Stars.test.js
    Progress.test.js
    cats.test.js
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `.gitignore`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/config/gameConfig.js`

- [ ] **Step 1: Initialize npm**

```bash
cd /Users/ernieambrose/Projects/cat-chaos
npm init -y
```

- [ ] **Step 2: Install dependencies**

```bash
npm install phaser
npm install -D vite vitest
```

- [ ] **Step 3: Create `.gitignore`**

```
node_modules/
dist/
.DS_Store
```

- [ ] **Step 4: Create `vite.config.js`**

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cat-chaos/',
  build: {
    outDir: 'dist'
  },
  test: {
    environment: 'node'
  }
});
```

- [ ] **Step 5: Add scripts to `package.json`**

Replace the `scripts` section:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run"
}
```

- [ ] **Step 6: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cat Chaos</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #1a1a2e; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
      canvas { display: block; }
    </style>
  </head>
  <body>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 7: Create `src/config/gameConfig.js`**

```javascript
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const gameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#87ceeb',
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 2 },
      debug: false
    }
  },
  scene: []  // scenes registered in main.js
};
```

- [ ] **Step 8: Create `src/main.js`**

```javascript
import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';
import Boot from './scenes/Boot.js';
import Preload from './scenes/Preload.js';
import MainMenu from './scenes/MainMenu.js';
import Game from './scenes/Game.js';
import HUD from './scenes/HUD.js';
import LevelComplete from './scenes/LevelComplete.js';
import UnlockCelebration from './scenes/UnlockCelebration.js';

const config = {
  ...gameConfig,
  scene: [Boot, Preload, MainMenu, Game, HUD, LevelComplete, UnlockCelebration]
};

new Phaser.Game(config);
```

- [ ] **Step 9: Create minimal `src/scenes/Boot.js` to verify startup**

```javascript
export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.scene.start('Preload');
  }
}
```

- [ ] **Step 10: Create stub scenes so import doesn't fail**

Create `src/scenes/Preload.js`:
```javascript
export default class Preload extends Phaser.Scene {
  constructor() { super('Preload'); }
  create() { this.scene.start('MainMenu'); }
}
```

Create `src/scenes/MainMenu.js`:
```javascript
export default class MainMenu extends Phaser.Scene {
  constructor() { super('MainMenu'); }
  create() {
    this.add.text(480, 270, 'CAT CHAOS', { fontSize: '48px', color: '#fff' }).setOrigin(0.5);
  }
}
```

Create `src/scenes/Game.js`:
```javascript
export default class Game extends Phaser.Scene {
  constructor() { super('Game'); }
  create() {}
  update() {}
}
```

Create `src/scenes/HUD.js`:
```javascript
export default class HUD extends Phaser.Scene {
  constructor() { super('HUD'); }
  create() {}
}
```

Create `src/scenes/LevelComplete.js`:
```javascript
export default class LevelComplete extends Phaser.Scene {
  constructor() { super('LevelComplete'); }
  create() {}
}
```

Create `src/scenes/UnlockCelebration.js`:
```javascript
export default class UnlockCelebration extends Phaser.Scene {
  constructor() { super('UnlockCelebration'); }
  create() {}
}
```

- [ ] **Step 11: Start dev server and verify**

```bash
npm run dev
```

Expected: Browser opens, black/blue screen with "CAT CHAOS" text visible. No console errors.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + Phaser 3 project"
```

---

## Task 2: GitHub Pages Deployment Pipeline

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create GitHub repo**

```bash
gh repo create cat-chaos --private --source=. --remote=origin --push
```

Expected: Repo created, initial commit pushed.

- [ ] **Step 2: Enable GitHub Pages in repo settings**

```bash
gh api repos/ernieambrose/cat-chaos/pages \
  --method POST \
  -f build_type=workflow
```

Expected: `{"url": "https://ernieambrose.github.io/cat-chaos/", ...}`

- [ ] **Step 3: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 4: Commit and verify deployment**

```bash
git add .github/
git commit -m "feat: add GitHub Pages deployment workflow"
git push origin main
```

Then check: `gh run list --limit 1`

Expected: Workflow runs, succeeds. Site live at `https://ernieambrose.github.io/cat-chaos/`

---

## Task 3: Level Data Format + LevelLoader

**Files:**
- Create: `src/utils/LevelLoader.js`
- Create: `tests/LevelLoader.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/LevelLoader.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { parseLevel, validateLevel } from '../src/utils/LevelLoader.js';

const validLevel = {
  id: 1,
  name: 'Wake-Up Call',
  catQueue: ['mittens', 'mittens', 'mittens'],
  napSpot: { x: 120, y: 490 },
  slingshot: { x: 220, y: 470 },
  structures: [
    { type: 'wood', x: 600, y: 490, width: 40, height: 80 }
  ],
  dogs: [{ x: 620, y: 450 }],
  tables: [],
  starThresholds: [0, 1, 2]
};

describe('parseLevel', () => {
  it('returns normalized level data', () => {
    const result = parseLevel(validLevel);
    expect(result.id).toBe(1);
    expect(result.catQueue).toEqual(['mittens', 'mittens', 'mittens']);
    expect(result.tables).toEqual([]);
  });

  it('defaults tables to empty array if missing', () => {
    const { tables, ...noTables } = validLevel;
    const result = parseLevel(noTables);
    expect(result.tables).toEqual([]);
  });
});

describe('validateLevel', () => {
  it('returns true for a valid level', () => {
    expect(validateLevel(validLevel)).toBe(true);
  });

  it('returns false when catQueue is empty', () => {
    expect(validateLevel({ ...validLevel, catQueue: [] })).toBe(false);
  });

  it('returns false when dogs array is missing', () => {
    const { dogs, ...noDogs } = validLevel;
    expect(validateLevel(noDogs)).toBe(false);
  });

  it('returns false when starThresholds does not have 3 entries', () => {
    expect(validateLevel({ ...validLevel, starThresholds: [0, 1] })).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../src/utils/LevelLoader.js'`

- [ ] **Step 3: Implement `src/utils/LevelLoader.js`**

```javascript
export function parseLevel(data) {
  return {
    id: data.id,
    name: data.name,
    catQueue: [...data.catQueue],
    napSpot: { ...data.napSpot },
    slingshot: { ...data.slingshot },
    structures: data.structures.map(s => ({ ...s })),
    dogs: data.dogs.map(d => ({ ...d })),
    tables: (data.tables || []).map(t => ({ ...t })),
    starThresholds: [...data.starThresholds]
  };
}

export function validateLevel(data) {
  if (!data.catQueue || data.catQueue.length === 0) return false;
  if (!data.dogs) return false;
  if (!data.starThresholds || data.starThresholds.length !== 3) return false;
  if (!data.napSpot) return false;
  if (!data.slingshot) return false;
  if (!data.structures) return false;
  return true;
}
```

- [ ] **Step 4: Run tests to confirm passing**

```bash
npm test
```

Expected: All 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/LevelLoader.js tests/LevelLoader.test.js
git commit -m "feat: add LevelLoader with parse and validate"
```

---

## Task 4: Star Rating Utility

**Files:**
- Create: `src/utils/Stars.js`
- Create: `tests/Stars.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/Stars.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { calculateStars } from '../src/utils/Stars.js';

// starThresholds: [minCatsFor1star, minCatsFor2stars, minCatsFor3stars]
// [0, 1, 2] means: 1 star if >=0 remaining, 2 if >=1, 3 if >=2

describe('calculateStars', () => {
  const thresholds = [0, 1, 2];

  it('returns 3 stars when cats remaining meets highest threshold', () => {
    expect(calculateStars(2, thresholds)).toBe(3);
    expect(calculateStars(5, thresholds)).toBe(3);
  });

  it('returns 2 stars when cats remaining meets middle threshold only', () => {
    expect(calculateStars(1, thresholds)).toBe(2);
  });

  it('returns 1 star when only lowest threshold is met', () => {
    expect(calculateStars(0, thresholds)).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to confirm failure**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../src/utils/Stars.js'`

- [ ] **Step 3: Implement `src/utils/Stars.js`**

```javascript
export function calculateStars(catsRemaining, starThresholds) {
  if (catsRemaining >= starThresholds[2]) return 3;
  if (catsRemaining >= starThresholds[1]) return 2;
  return 1;
}
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: All 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/Stars.js tests/Stars.test.js
git commit -m "feat: add star rating utility"
```

---

## Task 5: Progress (Unlock) Utility

**Files:**
- Create: `src/utils/Progress.js`
- Create: `tests/Progress.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/Progress.test.js`:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage for Node environment
const store = {};
global.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = v; },
  removeItem: (k) => { delete store[k]; }
};

import { saveResult, getBestStars, getHighestCompletedLevel, isLevelUnlocked } from '../src/utils/Progress.js';

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
});

describe('saveResult', () => {
  it('saves star count for a level', () => {
    saveResult(1, 2);
    expect(getBestStars(1)).toBe(2);
  });

  it('keeps highest star count on re-save', () => {
    saveResult(1, 3);
    saveResult(1, 1);
    expect(getBestStars(1)).toBe(3);
  });
});

describe('getHighestCompletedLevel', () => {
  it('returns 0 when no levels completed', () => {
    expect(getHighestCompletedLevel()).toBe(0);
  });

  it('returns max level with any stars', () => {
    saveResult(1, 1);
    saveResult(3, 2);
    expect(getHighestCompletedLevel()).toBe(3);
  });
});

describe('isLevelUnlocked', () => {
  it('level 1 is always unlocked', () => {
    expect(isLevelUnlocked(1)).toBe(true);
  });

  it('level N is unlocked if level N-1 is completed', () => {
    expect(isLevelUnlocked(2)).toBe(false);
    saveResult(1, 1);
    expect(isLevelUnlocked(2)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to confirm failure**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../src/utils/Progress.js'`

- [ ] **Step 3: Implement `src/utils/Progress.js`**

```javascript
const STORAGE_KEY = 'catChaosProgress';

function getProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function setProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveResult(levelId, stars) {
  const progress = getProgress();
  progress[levelId] = Math.max(progress[levelId] || 0, stars);
  setProgress(progress);
}

export function getBestStars(levelId) {
  return getProgress()[levelId] || 0;
}

export function getHighestCompletedLevel() {
  const progress = getProgress();
  const completedLevels = Object.keys(progress).map(Number);
  return completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
}

export function isLevelUnlocked(levelId) {
  if (levelId === 1) return true;
  return getHighestCompletedLevel() >= levelId - 1;
}
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: All 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/Progress.js tests/Progress.test.js
git commit -m "feat: add progress/unlock tracking via localStorage"
```

---

## Task 6: Cat Configuration

**Files:**
- Create: `src/config/cats.js`
- Create: `tests/cats.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/cats.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { CAT_TYPES, getCatConfig } from '../src/config/cats.js';

describe('CAT_TYPES', () => {
  it('defines mittens, colonel, and duchess', () => {
    expect(CAT_TYPES).toHaveProperty('mittens');
    expect(CAT_TYPES).toHaveProperty('colonel');
    expect(CAT_TYPES).toHaveProperty('duchess');
  });

  it('colonel has higher mass than mittens', () => {
    expect(CAT_TYPES.colonel.physics.mass).toBeGreaterThan(CAT_TYPES.mittens.physics.mass);
  });

  it('duchess has lower mass than mittens', () => {
    expect(CAT_TYPES.duchess.physics.mass).toBeLessThan(CAT_TYPES.mittens.physics.mass);
  });

  it('duchess has speedBurst ability', () => {
    expect(CAT_TYPES.duchess.ability).toBe('speedBurst');
  });

  it('mittens and colonel have no ability', () => {
    expect(CAT_TYPES.mittens.ability).toBeNull();
    expect(CAT_TYPES.colonel.ability).toBeNull();
  });
});

describe('getCatConfig', () => {
  it('returns config for valid type', () => {
    expect(getCatConfig('mittens').id).toBe('mittens');
  });

  it('throws for unknown type', () => {
    expect(() => getCatConfig('unknown')).toThrow();
  });
});
```

- [ ] **Step 2: Run test to confirm failure**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../src/config/cats.js'`

- [ ] **Step 3: Implement `src/config/cats.js`**

```javascript
export const CAT_TYPES = {
  mittens: {
    id: 'mittens',
    name: 'Mittens',
    textureKey: 'cat_mittens',
    physics: {
      mass: 1,
      restitution: 0.4,
      friction: 0.1,
      frictionAir: 0.01
    },
    ability: null,
    unlockAfterLevel: 0,
    color: 0xff6600,   // orange — placeholder color
    radius: 16
  },
  colonel: {
    id: 'colonel',
    name: 'Colonel Fluffington',
    textureKey: 'cat_colonel',
    physics: {
      mass: 3,
      restitution: 0.1,
      friction: 0.5,
      frictionAir: 0.02
    },
    ability: null,
    unlockAfterLevel: 2,
    color: 0x8B4513,   // brown
    radius: 22
  },
  duchess: {
    id: 'duchess',
    name: 'Duchess',
    textureKey: 'cat_duchess',
    physics: {
      mass: 0.5,
      restitution: 0.7,
      friction: 0.05,
      frictionAir: 0.005
    },
    ability: 'speedBurst',
    unlockAfterLevel: 5,
    color: 0xd4a0d4,   // lavender
    radius: 12
  }
};

export function getCatConfig(typeId) {
  if (!CAT_TYPES[typeId]) throw new Error(`Unknown cat type: ${typeId}`);
  return CAT_TYPES[typeId];
}
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: All 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/config/cats.js tests/cats.test.js
git commit -m "feat: add cat type config with physics properties"
```

---

## Task 7: Placeholder Textures in Preload Scene

**Files:**
- Modify: `src/scenes/Preload.js`

All graphics are generated programmatically — no image files needed yet. This lets physics and gameplay be tested with colored shapes before real pixel art exists.

- [ ] **Step 1: Replace `src/scenes/Preload.js` with full implementation**

```javascript
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  create() {
    this._generateCatTextures();
    this._generateStructureTextures();
    this._generateDogTexture();
    this._generateMiscTextures();
    this.scene.start('MainMenu');
  }

  _generateCatTextures() {
    // Mittens — orange circle
    const g1 = this.make.graphics({ add: false });
    g1.fillStyle(0xff6600);
    g1.fillCircle(16, 16, 16);
    g1.lineStyle(2, 0x000000);
    g1.strokeCircle(16, 16, 16);
    g1.generateTexture('cat_mittens', 32, 32);
    g1.destroy();

    // Colonel — big brown circle
    const g2 = this.make.graphics({ add: false });
    g2.fillStyle(0x8B4513);
    g2.fillCircle(22, 22, 22);
    g2.lineStyle(2, 0x000000);
    g2.strokeCircle(22, 22, 22);
    g2.generateTexture('cat_colonel', 44, 44);
    g2.destroy();

    // Duchess — small lavender circle
    const g3 = this.make.graphics({ add: false });
    g3.fillStyle(0xd4a0d4);
    g3.fillCircle(12, 12, 12);
    g3.lineStyle(2, 0x000000);
    g3.strokeCircle(12, 12, 12);
    g3.generateTexture('cat_duchess', 24, 24);
    g3.destroy();
  }

  _generateStructureTextures() {
    // Wood block
    const w = this.make.graphics({ add: false });
    w.fillStyle(0xc8843c);
    w.fillRect(0, 0, 40, 40);
    w.lineStyle(2, 0x8B5A2B);
    w.strokeRect(0, 0, 40, 40);
    w.generateTexture('block_wood', 40, 40);
    w.destroy();

    // Stone block
    const s = this.make.graphics({ add: false });
    s.fillStyle(0x888888);
    s.fillRect(0, 0, 40, 40);
    s.lineStyle(2, 0x555555);
    s.strokeRect(0, 0, 40, 40);
    s.generateTexture('block_stone', 40, 40);
    s.destroy();
  }

  _generateDogTexture() {
    const d = this.make.graphics({ add: false });
    d.fillStyle(0xf5cba7);
    d.fillRect(0, 0, 32, 32);
    d.lineStyle(2, 0xc0392b);
    d.strokeRect(0, 0, 32, 32);
    // Simple ears
    d.fillStyle(0xc0a070);
    d.fillTriangle(2, 0, 10, 0, 6, -8);
    d.fillTriangle(22, 0, 30, 0, 26, -8);
    d.generateTexture('dog', 32, 40);
    d.destroy();
  }

  _generateMiscTextures() {
    // Nap spot — cat bed
    const n = this.make.graphics({ add: false });
    n.fillStyle(0xffccaa);
    n.fillEllipse(40, 20, 80, 40);
    n.lineStyle(3, 0xff9966);
    n.strokeEllipse(40, 20, 80, 40);
    n.generateTexture('nap_spot', 80, 40);
    n.destroy();

    // Slingshot
    const sl = this.make.graphics({ add: false });
    sl.fillStyle(0x8B4513);
    sl.fillRect(15, 0, 10, 60);  // pole
    sl.fillRect(0, 0, 15, 10);   // left fork
    sl.fillRect(25, 0, 15, 10);  // right fork
    sl.generateTexture('slingshot', 40, 60);
    sl.destroy();

    // Table top
    const tt = this.make.graphics({ add: false });
    tt.fillStyle(0xdeb887);
    tt.fillRect(0, 0, 80, 12);
    tt.generateTexture('table_top', 80, 12);
    tt.destroy();

    // Table leg
    const tl = this.make.graphics({ add: false });
    tl.fillStyle(0xc4a96e);
    tl.fillRect(0, 0, 10, 40);
    tl.generateTexture('table_leg', 10, 40);
    tl.destroy();

    // Table item (vase/cup)
    const ti = this.make.graphics({ add: false });
    ti.fillStyle(0x3498db);
    ti.fillRect(0, 0, 16, 20);
    ti.generateTexture('table_item', 16, 20);
    ti.destroy();
  }
}
```

- [ ] **Step 2: Start dev server and verify no errors**

```bash
npm run dev
```

Expected: Game loads, reaches MainMenu showing "CAT CHAOS" text. No console errors.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/Preload.js
git commit -m "feat: generate placeholder textures programmatically in Preload"
```

---

## Task 8: Level JSON Files

**Files:**
- Create: `src/levels/level1.json` through `level6.json` and `levelBonus.json`

- [ ] **Step 1: Create `src/levels/level1.json`**

```json
{
  "id": 1,
  "name": "Wake-Up Call",
  "catQueue": ["mittens", "mittens", "mittens"],
  "napSpot": { "x": 120, "y": 490 },
  "slingshot": { "x": 220, "y": 460 },
  "structures": [
    { "type": "wood", "x": 620, "y": 460, "width": 40, "height": 80 },
    { "type": "wood", "x": 660, "y": 480, "width": 80, "height": 40 }
  ],
  "dogs": [
    { "x": 640, "y": 430 }
  ],
  "tables": [],
  "starThresholds": [0, 1, 2]
}
```

- [ ] **Step 2: Create `src/levels/level2.json`**

```json
{
  "id": 2,
  "name": "Table Trouble",
  "catQueue": ["mittens", "mittens", "mittens"],
  "napSpot": { "x": 120, "y": 490 },
  "slingshot": { "x": 220, "y": 460 },
  "structures": [
    { "type": "wood", "x": 640, "y": 440, "width": 40, "height": 100 },
    { "type": "wood", "x": 700, "y": 440, "width": 40, "height": 100 }
  ],
  "dogs": [
    { "x": 650, "y": 400 },
    { "x": 700, "y": 400 }
  ],
  "tables": [
    { "x": 480, "y": 430, "items": 2 }
  ],
  "starThresholds": [0, 1, 2]
}
```

- [ ] **Step 3: Create `src/levels/level3.json`**

```json
{
  "id": 3,
  "name": "The Colonel Arrives",
  "catQueue": ["mittens", "colonel", "mittens"],
  "napSpot": { "x": 120, "y": 490 },
  "slingshot": { "x": 220, "y": 460 },
  "structures": [
    { "type": "stone", "x": 620, "y": 430, "width": 40, "height": 120 },
    { "type": "wood", "x": 660, "y": 460, "width": 80, "height": 60 },
    { "type": "stone", "x": 700, "y": 430, "width": 40, "height": 120 }
  ],
  "dogs": [
    { "x": 650, "y": 390 },
    { "x": 690, "y": 390 }
  ],
  "tables": [
    { "x": 500, "y": 430, "items": 3 }
  ],
  "starThresholds": [0, 1, 2]
}
```

- [ ] **Step 4: Create `src/levels/level4.json`**

```json
{
  "id": 4,
  "name": "High Rise",
  "catQueue": ["mittens", "colonel", "colonel", "mittens"],
  "napSpot": { "x": 120, "y": 490 },
  "slingshot": { "x": 220, "y": 460 },
  "structures": [
    { "type": "wood", "x": 600, "y": 430, "width": 40, "height": 120 },
    { "type": "stone", "x": 640, "y": 380, "width": 80, "height": 40 },
    { "type": "wood", "x": 680, "y": 430, "width": 40, "height": 120 },
    { "type": "stone", "x": 640, "y": 340, "width": 80, "height": 40 }
  ],
  "dogs": [
    { "x": 640, "y": 350" },
    { "x": 640, "y": 440 },
    { "x": 680, "y": 440 }
  ],
  "tables": [
    { "x": 480, "y": 430, "items": 2 },
    { "x": 550, "y": 430, "items": 2 }
  ],
  "starThresholds": [0, 1, 3]
}
```

- [ ] **Step 5: Create `src/levels/level5.json`**

```json
{
  "id": 5,
  "name": "Chain Reaction",
  "catQueue": ["mittens", "colonel", "colonel", "mittens", "mittens"],
  "napSpot": { "x": 120, "y": 490 },
  "slingshot": { "x": 220, "y": 460 },
  "structures": [
    { "type": "wood", "x": 700, "y": 420, "width": 40, "height": 140 },
    { "type": "stone", "x": 740, "y": 460, "width": 80, "height": 60 },
    { "type": "wood", "x": 780, "y": 420, "width": 40, "height": 140 }
  ],
  "dogs": [
    { "x": 710, "y": 380 },
    { "x": 760, "y": 430 },
    { "x": 800, "y": 380 }
  ],
  "tables": [
    { "x": 450, "y": 430, "items": 3 },
    { "x": 560, "y": 430, "items": 3 },
    { "x": 630, "y": 430, "items": 2 }
  ],
  "starThresholds": [0, 2, 4]
}
```

- [ ] **Step 6: Create `src/levels/level6.json`**

```json
{
  "id": 6,
  "name": "The Big Nap Napper",
  "catQueue": ["mittens", "colonel", "duchess", "mittens", "colonel", "duchess"],
  "napSpot": { "x": 120, "y": 490 },
  "slingshot": { "x": 220, "y": 460 },
  "structures": [
    { "type": "stone", "x": 580, "y": 400, "width": 40, "height": 140 },
    { "type": "wood", "x": 620, "y": 450, "width": 80, "height": 40 },
    { "type": "stone", "x": 660, "y": 380, "width": 40, "height": 180 },
    { "type": "wood", "x": 700, "y": 420, "width": 40, "height": 120 },
    { "type": "stone", "x": 740, "y": 400, "width": 80, "height": 140 },
    { "type": "wood", "x": 820, "y": 440, "width": 40, "height": 100 }
  ],
  "dogs": [
    { "x": 600, "y": 360 },
    { "x": 650, "y": 340 },
    { "x": 710, "y": 380 },
    { "x": 760, "y": 360 },
    { "x": 840, "y": 400 }
  ],
  "tables": [
    { "x": 460, "y": 430, "items": 3 },
    { "x": 540, "y": 430, "items": 3 }
  ],
  "starThresholds": [0, 2, 4]
}
```

- [ ] **Step 7: Create `src/levels/levelBonus.json`**

```json
{
  "id": 7,
  "name": "Maximum Chaos",
  "catQueue": ["mittens", "colonel", "duchess", "mittens", "colonel", "duchess", "mittens"],
  "napSpot": { "x": 120, "y": 490 },
  "slingshot": { "x": 220, "y": 460 },
  "structures": [
    { "type": "wood", "x": 560, "y": 440, "width": 40, "height": 80 },
    { "type": "stone", "x": 600, "y": 380, "width": 40, "height": 200 },
    { "type": "wood", "x": 640, "y": 450, "width": 80, "height": 60 },
    { "type": "stone", "x": 680, "y": 360, "width": 40, "height": 200 },
    { "type": "wood", "x": 720, "y": 400, "width": 40, "height": 140 },
    { "type": "stone", "x": 760, "y": 380, "width": 80, "height": 160 },
    { "type": "wood", "x": 840, "y": 420, "width": 40, "height": 120 }
  ],
  "dogs": [
    { "x": 570, "y": 400 },
    { "x": 620, "y": 340 },
    { "x": 660, "y": 420 },
    { "x": 700, "y": 320 },
    { "x": 740, "y": 360 },
    { "x": 800, "y": 340 }
  ],
  "tables": [
    { "x": 430, "y": 430, "items": 3 },
    { "x": 510, "y": 430, "items": 3 }
  ],
  "starThresholds": [0, 3, 5]
}
```

- [ ] **Step 8: Fix typo in level4.json**

In `src/levels/level4.json`, the dog at `"x": 640, "y": 350"` has an extra quote in `350"`. Fix it:

```json
{ "x": 640, "y": 350 },
```

- [ ] **Step 9: Commit**

```bash
git add src/levels/
git commit -m "feat: add level JSON data for all 7 levels"
```

---

## Task 9: NapSpot + Dog Entities

**Files:**
- Create: `src/entities/NapSpot.js`
- Create: `src/entities/Dog.js`

- [ ] **Step 1: Create `src/entities/NapSpot.js`**

```javascript
export default class NapSpot {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    // Static sensor — detects contact but doesn't physically block
    this.body = scene.matter.add.image(x, y, 'nap_spot', null, {
      isStatic: true,
      isSensor: true,
      label: 'napSpot'
    });
  }
}
```

- [ ] **Step 2: Create `src/entities/Dog.js`**

```javascript
export default class Dog {
  constructor(scene, x, y) {
    this.scene = scene;
    this.defeated = false;
    this.speed = 1.2;

    this.sprite = scene.matter.add.image(x, y, 'dog', null, {
      mass: 1,
      restitution: 0.2,
      friction: 0.8,
      label: 'dog',
      frictionStatic: 1
    });

    // Store reference back to this instance for collision lookup
    this.sprite.setData('entity', this);
  }

  get body() {
    return this.sprite.body;
  }

  update(napSpotX) {
    if (this.defeated || !this.sprite.active) return;
    const dx = napSpotX - this.sprite.x;
    if (Math.abs(dx) > 5) {
      const vx = dx > 0 ? this.speed : -this.speed;
      this.scene.matter.body.setVelocity(this.sprite.body, {
        x: vx,
        y: this.sprite.body.velocity.y
      });
    }
  }

  defeat() {
    this.defeated = true;
    this.sprite.destroy();
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/entities/NapSpot.js src/entities/Dog.js
git commit -m "feat: add NapSpot and Dog entities"
```

---

## Task 10: Structure + Table Entities

**Files:**
- Create: `src/entities/Structure.js`
- Create: `src/entities/Table.js`

- [ ] **Step 1: Create `src/entities/Structure.js`**

```javascript
export default class Structure {
  constructor(scene, config) {
    const { type, x, y, width, height } = config;
    const textureKey = type === 'stone' ? 'block_stone' : 'block_wood';

    this.type = type;
    this.destroyed = false;

    this.sprite = scene.matter.add.image(x, y, textureKey, null, {
      mass: type === 'stone' ? 4 : 1,
      restitution: 0.1,
      friction: 0.8,
      label: 'structure'
    });

    // Scale texture to match declared dimensions
    this.sprite.setDisplaySize(width, height);

    // Set physics body size to match display size
    scene.matter.body.set(this.sprite.body, {
      vertices: scene.matter.verts.fromPath(
        `0 0 ${width} 0 ${width} ${height} 0 ${height}`
      )
    });

    this.sprite.setData('entity', this);
  }

  get body() {
    return this.sprite.body;
  }
}
```

- [ ] **Step 2: Create `src/entities/Table.js`**

```javascript
export default class Table {
  constructor(scene, config) {
    const { x, y, items = 2 } = config;
    this.scene = scene;
    this.items = [];

    // Table top — static
    this.top = scene.matter.add.image(x, y, 'table_top', null, {
      isStatic: true,
      label: 'tableTop',
      friction: 0.8
    });
    this.top.setDisplaySize(80, 12);

    // Left leg
    scene.matter.add.image(x - 30, y + 26, 'table_leg', null, {
      isStatic: true, label: 'tableLeg'
    }).setDisplaySize(10, 40);

    // Right leg
    scene.matter.add.image(x + 30, y + 26, 'table_leg', null, {
      isStatic: true, label: 'tableLeg'
    }).setDisplaySize(10, 40);

    // Place items on top
    const spacing = 60 / Math.max(items, 1);
    for (let i = 0; i < items; i++) {
      const itemX = x - 25 + i * spacing;
      const item = scene.matter.add.image(itemX, y - 20, 'table_item', null, {
        mass: 0.3,
        restitution: 0.3,
        friction: 0.6,
        label: 'tableItem'
      });
      this.items.push(item);
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/entities/Structure.js src/entities/Table.js
git commit -m "feat: add Structure and Table entities"
```

---

## Task 11: Cat Entities + Slingshot

**Files:**
- Create: `src/entities/Cat.js`
- Create: `src/entities/CatMittens.js`
- Create: `src/entities/CatColonel.js`
- Create: `src/entities/CatDuchess.js`
- Create: `src/entities/Slingshot.js`

- [ ] **Step 1: Create `src/entities/Cat.js`**

```javascript
import { getCatConfig } from '../config/cats.js';

export default class Cat {
  constructor(scene, x, y, typeId) {
    this.scene = scene;
    this.typeId = typeId;
    this.config = getCatConfig(typeId);
    this.launched = false;
    this.abilityUsed = false;
    this.active = true;

    const { physics, textureKey, radius } = this.config;

    this.sprite = scene.matter.add.image(x, y, textureKey, null, {
      mass: physics.mass,
      restitution: physics.restitution,
      friction: physics.friction,
      frictionAir: physics.frictionAir,
      label: 'cat',
      isStatic: true,  // static until launched
      circleRadius: radius
    });

    this.sprite.setCircle(radius);
    this.sprite.setData('entity', this);
  }

  get body() {
    return this.sprite.body;
  }

  launch(vx, vy) {
    this.launched = true;
    this.scene.matter.body.setStatic(this.sprite.body, false);
    this.scene.matter.body.setVelocity(this.sprite.body, { x: vx, y: vy });
  }

  // Override in subclasses for abilities
  useAbility() {}

  update() {}

  isOffScreen(width, height) {
    return (
      this.sprite.x < -100 ||
      this.sprite.x > width + 100 ||
      this.sprite.y > height + 100
    );
  }
}
```

- [ ] **Step 2: Create `src/entities/CatMittens.js`**

```javascript
import Cat from './Cat.js';

export default class CatMittens extends Cat {
  constructor(scene, x, y) {
    super(scene, x, y, 'mittens');
  }
  // No ability — base Cat behavior only
}
```

- [ ] **Step 3: Create `src/entities/CatColonel.js`**

```javascript
import Cat from './Cat.js';

export default class CatColonel extends Cat {
  constructor(scene, x, y) {
    super(scene, x, y, 'colonel');
  }
  // Ability is passive (high mass) — no override needed
}
```

- [ ] **Step 4: Create `src/entities/CatDuchess.js`**

```javascript
import Cat from './Cat.js';

const BURST_MULTIPLIER = 2.5;

export default class CatDuchess extends Cat {
  constructor(scene, x, y) {
    super(scene, x, y, 'duchess');
  }

  useAbility() {
    if (this.abilityUsed || !this.launched) return;
    this.abilityUsed = true;

    const vx = this.sprite.body.velocity.x * BURST_MULTIPLIER;
    const vy = this.sprite.body.velocity.y * BURST_MULTIPLIER;
    this.scene.matter.body.setVelocity(this.sprite.body, { x: vx, y: vy });

    // Visual feedback — brief tint flash
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(150, () => {
      if (this.sprite.active) this.sprite.clearTint();
    });
  }
}
```

- [ ] **Step 5: Create `src/entities/Slingshot.js`**

```javascript
import CatMittens from './CatMittens.js';
import CatColonel from './CatColonel.js';
import CatDuchess from './CatDuchess.js';

const CAT_CLASSES = {
  mittens: CatMittens,
  colonel: CatColonel,
  duchess: CatDuchess
};

const MAX_DRAG = 90;
const LAUNCH_POWER = 0.14;

export default class Slingshot {
  constructor(scene, x, y, catQueue) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.catQueue = [...catQueue];
    this.activeCat = null;
    this.isDragging = false;
    this.onCatLaunched = null;  // callback, set by Game scene

    // Draw slingshot sprite
    this.sprite = scene.add.image(x, y, 'slingshot').setDepth(1);

    this._spawnNextCat();
    this._setupInput();
  }

  _spawnNextCat() {
    if (this.catQueue.length === 0) {
      this.activeCat = null;
      return;
    }
    const typeId = this.catQueue.shift();
    const CatClass = CAT_CLASSES[typeId];
    this.activeCat = new CatClass(this.scene, this.x, this.y - 30);
  }

  _setupInput() {
    this.scene.input.on('pointerdown', this._onPointerDown, this);
    this.scene.input.on('pointermove', this._onPointerMove, this);
    this.scene.input.on('pointerup', this._onPointerUp, this);
  }

  _onPointerDown(pointer) {
    if (!this.activeCat || this.activeCat.launched) return;
    const dx = pointer.x - this.activeCat.sprite.x;
    const dy = pointer.y - this.activeCat.sprite.y;
    if (Math.sqrt(dx * dx + dy * dy) < 40) {
      this.isDragging = true;
    }
  }

  _onPointerMove(pointer) {
    if (!this.isDragging || !this.activeCat) return;
    const dx = pointer.x - this.x;
    const dy = pointer.y - (this.y - 30);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > MAX_DRAG) {
      const angle = Math.atan2(dy, dx);
      this.activeCat.sprite.x = this.x + Math.cos(angle) * MAX_DRAG;
      this.activeCat.sprite.y = (this.y - 30) + Math.sin(angle) * MAX_DRAG;
    } else {
      this.activeCat.sprite.x = pointer.x;
      this.activeCat.sprite.y = pointer.y;
    }
  }

  _onPointerUp() {
    if (!this.isDragging || !this.activeCat) return;
    this.isDragging = false;

    const vx = (this.x - this.activeCat.sprite.x) * LAUNCH_POWER;
    const vy = ((this.y - 30) - this.activeCat.sprite.y) * LAUNCH_POWER;

    // Only launch if there's meaningful velocity
    if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) return;

    const launched = this.activeCat;
    launched.launch(vx, vy);

    if (this.onCatLaunched) this.onCatLaunched(launched);

    // Spawn next cat after a short delay
    this.scene.time.delayedCall(1500, () => {
      this._spawnNextCat();
    });
  }

  get catsRemaining() {
    return this.catQueue.length + (this.activeCat ? 1 : 0);
  }

  destroy() {
    this.scene.input.off('pointerdown', this._onPointerDown, this);
    this.scene.input.off('pointermove', this._onPointerMove, this);
    this.scene.input.off('pointerup', this._onPointerUp, this);
    this.sprite.destroy();
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/entities/
git commit -m "feat: add Cat entities and Slingshot mechanic"
```

---

## Task 12: Game Scene — Level 1 Playable

**Files:**
- Modify: `src/scenes/Game.js`

This task wires everything together into a playable Level 1. Win/lose logic is handled in Task 13.

- [ ] **Step 1: Replace `src/scenes/Game.js`**

```javascript
import { parseLevel, validateLevel } from '../utils/LevelLoader.js';
import Slingshot from '../entities/Slingshot.js';
import Dog from '../entities/Dog.js';
import Structure from '../entities/Structure.js';
import Table from '../entities/Table.js';
import NapSpot from '../entities/NapSpot.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

const LEVEL_MODULES = {
  1: () => import('../levels/level1.json'),
  2: () => import('../levels/level2.json'),
  3: () => import('../levels/level3.json'),
  4: () => import('../levels/level4.json'),
  5: () => import('../levels/level5.json'),
  6: () => import('../levels/level6.json'),
  7: () => import('../levels/levelBonus.json')
};

export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.levelId = data.levelId || 1;
    this.levelData = null;
    this.dogs = [];
    this.slingshot = null;
    this.napSpot = null;
    this.activeCat = null;
    this.gameOver = false;
    this.win = false;
  }

  async create() {
    const raw = await LEVEL_MODULES[this.levelId]();
    this.levelData = parseLevel(raw.default || raw);

    this._buildGround();
    this._buildLevel();
    this._setupCollisions();
    this._setupAbilityInput();

    // Launch HUD scene on top
    this.scene.launch('HUD', { levelId: this.levelId });
  }

  _buildGround() {
    // Static ground platform
    this.matter.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 10, GAME_WIDTH, 20, {
      isStatic: true,
      label: 'ground',
      friction: 0.8
    });

    // Visual ground line
    const g = this.add.graphics();
    g.fillStyle(0x7ec850);
    g.fillRect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);
  }

  _buildLevel() {
    const { napSpot, slingshot, structures, dogs, tables, catQueue } = this.levelData;

    // Nap spot
    this.napSpot = new NapSpot(this, napSpot.x, napSpot.y);

    // Structures
    structures.forEach(cfg => new Structure(this, cfg));

    // Tables
    tables.forEach(cfg => new Table(this, cfg));

    // Dogs
    this.dogs = dogs.map(cfg => new Dog(this, cfg.x, cfg.y));

    // Slingshot
    this.slingshot = new Slingshot(this, slingshot.x, slingshot.y, catQueue);
    this.slingshot.onCatLaunched = (cat) => {
      this.activeCat = cat;
      this.scene.get('HUD').events.emit('catLaunched', {
        catsRemaining: this.slingshot.catsRemaining
      });
    };
  }

  _setupCollisions() {
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach(({ bodyA, bodyB }) => {
        this._handleCollision(bodyA, bodyB);
        this._handleCollision(bodyB, bodyA);
      });
    });
  }

  _handleCollision(bodyA, bodyB) {
    if (bodyA.label === 'cat' && bodyB.label === 'dog') {
      const dogEntity = bodyB.gameObject?.getData('entity');
      if (dogEntity && !dogEntity.defeated) {
        dogEntity.defeat();
        this._checkWin();
      }
    }

    if (bodyA.label === 'dog' && bodyB.label === 'napSpot') {
      this._triggerLose();
    }
  }

  _setupAbilityInput() {
    this.input.on('pointerdown', () => {
      if (this.activeCat && this.activeCat.launched) {
        this.activeCat.useAbility();
      }
    });
  }

  _checkWin() {
    const allDefeated = this.dogs.every(d => d.defeated);
    if (allDefeated && !this.gameOver) {
      this.win = true;
      this.gameOver = true;
      this.time.delayedCall(800, () => this._endLevel());
    }
  }

  _triggerLose() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.time.delayedCall(600, () => {
      this.scene.stop('HUD');
      this.scene.start('LevelComplete', {
        stars: 0,
        levelId: this.levelId,
        win: false
      });
    });
  }

  _endLevel() {
    const catsRemaining = this.slingshot.catsRemaining;
    this.scene.stop('HUD');
    this.scene.start('LevelComplete', {
      stars: null,  // calculated in LevelComplete using Stars utility
      catsRemaining,
      starThresholds: this.levelData.starThresholds,
      levelId: this.levelId,
      win: true
    });
  }

  update() {
    if (this.gameOver) return;
    this.dogs.forEach(dog => dog.update(this.napSpot.x));

    // Check if active cat left the screen with no dogs remaining after delay
    if (this.activeCat?.launched && this.activeCat.isOffScreen(GAME_WIDTH, GAME_HEIGHT)) {
      this.activeCat = null;
      // If no cats left and not all dogs defeated: delayed lose check
      if (this.slingshot.catsRemaining === 0) {
        this.time.delayedCall(2000, () => {
          if (!this.gameOver) this._triggerLose();
        });
      }
    }
  }
}
```

- [ ] **Step 2: Start dev server and manually test Level 1**

```bash
npm run dev
```

Navigate to the game. Note: MainMenu currently has no "Play" button — open browser console and run:
```javascript
game.scene.start('Game', { levelId: 1 });
```

Expected: Level 1 loads. Cats visible at slingshot. Dogs visible on right. Drag and release to launch. Cat should fly with physics arc.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/Game.js
git commit -m "feat: wire Game scene with full level loading and physics"
```

---

## Task 13: HUD Scene

**Files:**
- Modify: `src/scenes/HUD.js`

- [ ] **Step 1: Replace `src/scenes/HUD.js`**

```javascript
export default class HUD extends Phaser.Scene {
  constructor() {
    super('HUD');
  }

  init(data) {
    this.levelId = data.levelId;
  }

  create() {
    // Level label
    this.add.text(16, 16, `Level ${this.levelId}`, {
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });

    // Cat queue label
    this.catLabel = this.add.text(16, 44, 'Cats: ...', {
      fontSize: '18px',
      color: '#ffdd44',
      stroke: '#000000',
      strokeThickness: 3
    });

    // Listen for updates from Game scene
    const gameScene = this.scene.get('Game');
    gameScene.events.on('catQueueUpdate', ({ catsRemaining }) => {
      this.catLabel.setText(`Cats left: ${catsRemaining}`);
    });

    this.events.on('catLaunched', ({ catsRemaining }) => {
      this.catLabel.setText(`Cats left: ${catsRemaining}`);
    });
  }
}
```

- [ ] **Step 2: Update Game scene to emit queue updates**

In `src/scenes/Game.js`, inside `_buildLevel()`, after creating the slingshot add:

```javascript
// Initial HUD update
this.time.delayedCall(100, () => {
  this.scene.get('HUD').events.emit('catLaunched', {
    catsRemaining: this.slingshot.catsRemaining
  });
});
```

- [ ] **Step 3: Commit**

```bash
git add src/scenes/HUD.js src/scenes/Game.js
git commit -m "feat: add HUD overlay showing level and cat count"
```

---

## Task 14: LevelComplete Scene + Star Rating

**Files:**
- Modify: `src/scenes/LevelComplete.js`

- [ ] **Step 1: Replace `src/scenes/LevelComplete.js`**

```javascript
import { calculateStars } from '../utils/Stars.js';
import { saveResult, isLevelUnlocked } from '../utils/Progress.js';
import { CAT_TYPES } from '../config/cats.js';

const TOTAL_LEVELS = 6;
const UNLOCK_AFTER = { colonel: 2, duchess: 5 };

export default class LevelComplete extends Phaser.Scene {
  constructor() {
    super('LevelComplete');
  }

  init(data) {
    this.win = data.win;
    this.levelId = data.levelId;
    this.catsRemaining = data.catsRemaining || 0;
    this.starThresholds = data.starThresholds;
    this.stars = this.win ? calculateStars(this.catsRemaining, this.starThresholds) : 0;

    if (this.win) {
      saveResult(this.levelId, this.stars);
    }
  }

  create() {
    const cx = 480;

    // Dim background
    this.add.rectangle(cx, 270, 960, 540, 0x000000, 0.55);

    if (!this.win) {
      this._buildLoseScreen();
    } else {
      this._buildWinScreen();
    }
  }

  _buildLoseScreen() {
    const cx = 480;
    this.add.text(cx, 180, 'Uh oh! The nap spot was reached!', {
      fontSize: '28px', color: '#ff4444',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this._addButton(cx, 320, 'Try Again', () => {
      this.scene.start('Game', { levelId: this.levelId });
    });

    this._addButton(cx, 390, 'Main Menu', () => {
      this.scene.start('MainMenu');
    });
  }

  _buildWinScreen() {
    const cx = 480;
    this.add.text(cx, 150, 'Nap spot protected!', {
      fontSize: '32px', color: '#ffdd44',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    // Fish bone stars
    const starText = '🐟'.repeat(this.stars) + '🦴'.repeat(3 - this.stars);
    this.add.text(cx, 220, starText, { fontSize: '40px' }).setOrigin(0.5);

    this.add.text(cx, 280, `Cats remaining: ${this.catsRemaining}`, {
      fontSize: '20px', color: '#ffffff',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    // Check for unlock
    const unlock = this._checkUnlock();
    if (unlock) {
      this._addButton(cx, 350, `Meet ${CAT_TYPES[unlock].name}! →`, () => {
        this.scene.start('UnlockCelebration', { catTypeId: unlock, nextLevelId: this.levelId + 1 });
      });
    } else {
      const nextId = this.levelId + 1;
      const hasNext = nextId <= TOTAL_LEVELS || this.levelId === TOTAL_LEVELS;
      if (hasNext && nextId <= 7) {
        this._addButton(cx, 350, 'Next Level →', () => {
          this.scene.start('Game', { levelId: nextId });
        });
      }
      this._addButton(cx, 420, 'Main Menu', () => {
        this.scene.start('MainMenu');
      });
    }
  }

  _checkUnlock() {
    for (const [catId, afterLevel] of Object.entries(UNLOCK_AFTER)) {
      if (this.levelId === afterLevel) return catId;
    }
    return null;
  }

  _addButton(x, y, label, callback) {
    const btn = this.add.text(x, y, label, {
      fontSize: '26px', color: '#fff',
      backgroundColor: '#2255aa',
      padding: { x: 20, y: 10 },
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3377cc' }));
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2255aa' }));
    btn.on('pointerdown', callback);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scenes/LevelComplete.js
git commit -m "feat: add LevelComplete scene with stars and navigation"
```

---

## Task 15: Unlock Celebration Scene

**Files:**
- Modify: `src/scenes/UnlockCelebration.js`

- [ ] **Step 1: Replace `src/scenes/UnlockCelebration.js`**

```javascript
import { CAT_TYPES } from '../config/cats.js';

export default class UnlockCelebration extends Phaser.Scene {
  constructor() {
    super('UnlockCelebration');
  }

  init(data) {
    this.catTypeId = data.catTypeId;
    this.nextLevelId = data.nextLevelId;
    this.catConfig = CAT_TYPES[this.catTypeId];
  }

  create() {
    const cx = 480;

    // Festive background
    this.add.rectangle(cx, 270, 960, 540, 0x1a0a3c);

    // Particle-like stars (simple tween approach)
    for (let i = 0; i < 20; i++) {
      const star = this.add.text(
        Phaser.Math.Between(50, 910),
        Phaser.Math.Between(50, 490),
        '⭐', { fontSize: '20px' }
      );
      this.tweens.add({
        targets: star,
        alpha: { from: 0, to: 1 },
        scale: { from: 0.5, to: 1.2 },
        duration: 600,
        delay: i * 80,
        yoyo: true,
        repeat: -1
      });
    }

    this.add.text(cx, 100, '✨ New Cat Unlocked! ✨', {
      fontSize: '36px', color: '#ffdd44',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    // Big cat sprite
    const catSprite = this.add.image(cx, 240, this.catConfig.textureKey)
      .setScale(4)
      .setAlpha(0);

    this.tweens.add({
      targets: catSprite,
      alpha: 1,
      scale: 4,
      duration: 500,
      ease: 'Back.out'
    });

    this.add.text(cx, 340, this.catConfig.name, {
      fontSize: '40px', color: '#ffffff',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    // Ability description
    const abilityText = this.catConfig.ability === 'speedBurst'
      ? 'Tap mid-flight for a speed burst!'
      : this.catConfig.ability === null
        ? 'Massive weight — crashes through anything!'
        : '';

    this.add.text(cx, 390, abilityText, {
      fontSize: '22px', color: '#aaddff',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    // Continue button
    const btn = this.add.text(cx, 460, 'Let\'s go! →', {
      fontSize: '28px', color: '#fff',
      backgroundColor: '#2255aa',
      padding: { x: 24, y: 12 },
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3377cc' }));
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2255aa' }));
    btn.on('pointerdown', () => {
      this.scene.start('Game', { levelId: this.nextLevelId });
    });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scenes/UnlockCelebration.js
git commit -m "feat: add UnlockCelebration scene for new cat reveals"
```

---

## Task 16: Main Menu Scene

**Files:**
- Modify: `src/scenes/MainMenu.js`

- [ ] **Step 1: Replace `src/scenes/MainMenu.js`**

```javascript
import { isLevelUnlocked, getBestStars } from '../utils/Progress.js';

const TOTAL_LEVELS = 6;
const BONUS_LEVEL_ID = 7;

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const cx = 480;

    // Sky background
    this.add.rectangle(cx, 270, 960, 540, 0x87ceeb);

    // Title
    this.add.text(cx, 80, '🐱 CAT CHAOS 🐱', {
      fontSize: '56px', color: '#fff',
      stroke: '#334', strokeThickness: 6,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 145, 'Protect the nap spot!', {
      fontSize: '22px', color: '#ffffaa',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    // Level select grid
    this.add.text(cx, 200, 'Choose a level:', {
      fontSize: '20px', color: '#333'
    }).setOrigin(0.5);

    const levelIds = [...Array(TOTAL_LEVELS).keys()].map(i => i + 1);
    levelIds.forEach((id, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const bx = 330 + col * 110;
      const by = 250 + row * 90;
      this._addLevelButton(bx, by, id);
    });

    // Bonus level button
    this._addLevelButton(cx, 430, BONUS_LEVEL_ID, true);
  }

  _addLevelButton(x, y, levelId, isBonus = false) {
    const unlocked = isLevelUnlocked(levelId);
    const stars = getBestStars(levelId);
    const label = isBonus ? '★ Bonus' : `${levelId}`;

    const btn = this.add.text(x, y, label, {
      fontSize: '24px',
      color: unlocked ? '#ffffff' : '#888888',
      backgroundColor: unlocked ? '#2255aa' : '#444444',
      padding: { x: 16, y: 10 },
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5);

    if (unlocked) {
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3377cc' }));
      btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2255aa' }));
      btn.on('pointerdown', () => {
        this.scene.start('Game', { levelId });
      });

      if (stars > 0) {
        this.add.text(x, y + 30, '🐟'.repeat(stars), {
          fontSize: '12px'
        }).setOrigin(0.5);
      }
    }
  }
}
```

- [ ] **Step 2: Verify full flow works**

```bash
npm run dev
```

Expected: Main menu shows title and level grid. Level 1 is clickable. Completing Level 1 saves progress and unlocks Level 2 button.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/MainMenu.js
git commit -m "feat: add MainMenu with level select grid and progress display"
```

---

## Task 17: Full Build + Deployment Verification

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 2: Build for production**

```bash
npm run build
```

Expected: `dist/` folder created with no errors. Output includes `index.html` and bundled JS.

- [ ] **Step 3: Preview production build locally**

```bash
npm run preview
```

Open browser at the URL shown. Play through Levels 1–2 and verify the Colonel unlock screen appears after Level 2.

- [ ] **Step 4: Push to main to trigger deployment**

```bash
git push origin main
```

- [ ] **Step 5: Verify deployment**

```bash
gh run list --limit 1
```

Wait for the run to complete, then open `https://ernieambrose.github.io/cat-chaos/` and verify the game loads.

- [ ] **Step 6: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: production build adjustments"
git push origin main
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Browser game, Phaser + Matter.js
- ✅ Cats as projectiles (yarn-ball slingshot implied by Slingshot entity)
- ✅ Dogs in structures, nap spot to protect
- ✅ Tables with knockable items
- ✅ Cat breeds: Mittens, Colonel Fluffington, Duchess
- ✅ Duchess speed burst ability
- ✅ 2 unlock celebrations (after level 2 and level 5)
- ✅ 6 levels + bonus
- ✅ Fish bone star rating (1–3)
- ✅ Level progression with localStorage
- ✅ Placeholder art → swap for real pixel art later
- ✅ GitHub Pages CI/CD
- ✅ Private repo

**Known limitations (by design, not bugs):**
- Pixel art assets are colored shapes until replaced — swap texture keys in Preload.js
- Sound is out of scope for v1 per spec
- `vite.config.js` `base: '/cat-chaos/'` must match the repo name exactly
