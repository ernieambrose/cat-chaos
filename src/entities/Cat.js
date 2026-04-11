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
      isStatic: true,
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
