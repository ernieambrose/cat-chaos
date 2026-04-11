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
    sl.fillRect(15, 0, 10, 60);
    sl.fillRect(0, 0, 15, 10);
    sl.fillRect(25, 0, 15, 10);
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
