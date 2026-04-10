import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';
import Boot from './scenes/Boot.js';
import Preload from './scenes/Preload.js';
import MainMenu from './scenes/MainMenu.js';
import Game from './scenes/Game.js';
import HUD from './scenes/HUD.js';
import LevelComplete from './scenes/LevelComplete.js';
import UnlockCelebration from './scenes/UnlockCelebration.js';

const config = {
  ...gameConfig,
  scene: [Boot, Preload, MainMenu, Game, HUD, LevelComplete, UnlockCelebration]
};

new Phaser.Game(config);
