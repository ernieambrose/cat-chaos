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
