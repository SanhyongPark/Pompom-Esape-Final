//import { Scene } from 'phaser';

import LevelBase from './LevelBase'

export default class LevelTwo extends LevelBase {
  constructor() {
    super('LevelTwo')

    this.nextSceneName = 'LevelThree'
  }

  init () {
    this.resetDataStatus()
    console.log('LevelTwo inited')
  }

  create() {
    super.create()
    console.log('LevelTwo created')
  }
}
