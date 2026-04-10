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
