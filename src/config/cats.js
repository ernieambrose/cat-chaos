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
    color: 0xff6600,
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
    color: 0x8B4513,
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
    color: 0xd4a0d4,
    radius: 12
  }
};

export function getCatConfig(typeId) {
  if (!CAT_TYPES[typeId]) throw new Error(`Unknown cat type: ${typeId}`);
  return CAT_TYPES[typeId];
}
