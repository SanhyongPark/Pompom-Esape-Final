import { Scene } from "phaser";

import {
  POM_SPRITE_WIDTH,
  POM_SPRITE_HEIGHT,
  FARMER_SPRITE_WIDTH,
  FARMER_SPRITE_HEIGHT,
  HEALTHBAR_SPRITE_WIDTH,
  HEALTHBAR_SPRITE_HEIGHT,
} from "../config";

export default class PreloadResource extends Scene {
  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("brownland", "assets/brownland.png");

    this.load.image("corn", "assets/corn.png");
    this.load.image("soil", "assets/soil.png");
    this.load.image("fence", "assets/fence.png");

    this.load.spritesheet("pompom", "assets/pompom.png", {
      frameWidth: POM_SPRITE_WIDTH,
      frameHeight: POM_SPRITE_HEIGHT,
    });
    this.load.spritesheet("farmer", "assets/farmer.png", {
      frameWidth: FARMER_SPRITE_WIDTH,
      frameHeight: FARMER_SPRITE_HEIGHT,
    });

    this.load.image("bar", "assets/bar.png");
    this.load.spritesheet("healthbar", "assets/healthbar/healthbar.png", {
      frameWidth: HEALTHBAR_SPRITE_WIDTH,
      frameHeight: HEALTHBAR_SPRITE_HEIGHT,
    });

    this.load.atlas(
      "healthbar-json",
      "assets/healthbar/healthbar.png",
      "assets/healthbar/healthbar.json"
    );

    // audio
    this.load.audio("background_music", "assets/audio/background.ogg");
    this.load.audio("pick", "assets/audio/pick.mp3");
    this.load.audio("caught", "assets/audio/caught.mp3");
    this.load.audio("alarm", "assets/audio/alarm.wav");
  }

  create() {
    this.scene.start("LevelOne");
  }
}
