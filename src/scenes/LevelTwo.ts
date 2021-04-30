import Phaser from "phaser";

import LevelBase from "./LevelBase";

export default class LevelTwo extends LevelBase {
  background_music: Phaser.Sound.BaseSound;
  constructor() {
    super("LevelTwo");

    this.nextSceneName = "LevelThree";
  }

  init() {
    this.resetDataStatus();
    console.log("LevelTwo inited");
  }

  create() {
    super.create();
    console.log("LevelTwo created");
  }
}
