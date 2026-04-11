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
