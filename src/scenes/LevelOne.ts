import { Scene } from 'phaser';

import LevelBase, { eatenCornLists } from './LevelBase'

export default class LevelOne extends LevelBase {
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
    super.create()
    console.log('LevelOne created')
  }
}
