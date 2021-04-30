import Phaser from 'phaser';

import LevelBase, { eatenCornLists } from './LevelBase'

export default class LevelOne extends LevelBase {
  background_music: Phaser.Sound.BaseSound
  constructor() {
    super('LevelOne')

    this.nextSceneName = 'LevelTwo'
  }

  init () {
    eatenCornLists.length = 0

    this.resetDataStatus()
    console.log('LevelOne inited')
  }

  create () {
    this.background_music = this.sound.add("background_music", { loop: true});
    this.background_music.play();
    
    super.create();
    console.log("LevelOne created");
  }
}
