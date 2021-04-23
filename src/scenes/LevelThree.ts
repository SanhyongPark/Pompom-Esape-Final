import { Scene } from 'phaser';

import LevelBase from './LevelBase'

export default class LevelThree extends LevelBase {
  constructor() {
    super('LevelThree')

    this.nextSceneName = ''
  }

  init () {
    this.resetDataStatus()
    console.log('LevelThree inited')
  }

  create() {
    super.create()
    console.log('LevelThree created')
  }
}
