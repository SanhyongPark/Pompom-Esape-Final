import { Scene, Sound } from "phaser";

export default class Start extends Scene {
  backgroundSound: Sound.BaseSound;

  constructor() {
    super("Start");
  }

  create() {
    this.add.image(0, 0, "start-background").setOrigin(0, 0);

    //Background music
    const backgroundSound = this.sound.add( "background-music", { loop: true } );
    this.backgroundSound = backgroundSound

    backgroundSound.play()

    // Start button
    const startButton = this.add.image(225, 480, "start-button").setScale(0.6);

    // Press start to go to level selection
    startButton.setInteractive();
    startButton.input.cursor = 'pointer'

    startButton.on("pointerdown", () => {
      backgroundSound.destroy();

      this.scene.stop().start("LevelOne", { isPassed: true });
    } );

    this.dispatchClick()
  }

  dispatchClick () {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    } );

    // Target can be any Element or other EventTarget.
    document.body.dispatchEvent( event );
  }
}
