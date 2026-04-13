export default class Structure {
  constructor(scene, config) {
    const { type, x, y, width, height } = config;
    const textureKey = type === 'stone' ? 'block_stone' : 'block_wood';

    this.type = type;
    this.destroyed = false;

    const area = width * height;
    const woodMass = Math.max(0.3, area / 1600);  // 40×40 ref block = 1

    this.sprite = scene.matter.add.image(x, y, textureKey, null, {
      mass: type === 'stone' ? woodMass * 4 : woodMass,
      restitution: 0.1,
      friction: 0.8,
      label: 'structure'
    });

    this.sprite.setDisplaySize(width, height);

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
