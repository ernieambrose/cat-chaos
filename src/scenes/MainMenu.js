export default class MainMenu extends Phaser.Scene {
  constructor() { super('MainMenu'); }
  create() {
    this.add.text(480, 270, 'CAT CHAOS', { fontSize: '48px', color: '#fff' }).setOrigin(0.5);
  }
}
