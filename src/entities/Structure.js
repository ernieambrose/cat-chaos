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
