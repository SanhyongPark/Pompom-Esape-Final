import { Game } from 'phaser';

import { GAME_CONFIG } from './config'

import PreloadResource from './scenes/PreloadResource';
import LevelOne from './scenes/LevelOne';
import LevelTwo from './scenes/LevelTwo';
import LevelThree from './scenes/LevelThree';

class MainGame extends Game {
  constructor(options) {
    super(options)

    this.initialize()
  }

  initialize () {
    this.scene.add('PreloadResource', PreloadResource, true)

    this.scene.add('LevelOne', LevelOne)
    this.scene.add('LevelTwo', LevelTwo)
    this.scene.add('LevelThree', LevelThree)
  }
}

const mainGame = new MainGame(GAME_CONFIG);
// @ts-expect-error
window.mainGame = mainGame

export default mainGame;
