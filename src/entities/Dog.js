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
