import { Scene, Types, Sound, Physics, GameObjects, Math as PMath } from "phaser";

import {
  LEVEL_COUNT,
  POM_SPEED,
  FARMER_SPEED,
  CORN_TOTAL_COUNT,
  CORN_SOIL_GAP,
  BROWNLAND_OFFSET_Y,
} from "../config";

export interface ISceneData {
  isPassed?: boolean;
}

// Navigate how many corns are eaten
export const eatenCornLists: number[] = [];

export default class LevelBase extends Scene {
  // Next scene
  nextSceneName = "LevelOne";
  currentLevel = 1
  pomSpeed = POM_SPEED;
  farmerSpeed = FARMER_SPEED;
  cornSoilGap = CORN_SOIL_GAP
  cornTotalCount = CORN_TOTAL_COUNT
  firstCornOffsetX = 0

  // Check if space key is pressed
  spaceKeyPressed = false;
  // Current carrying corn
  currentCarryingCorn: GameObjects.Image | null = null;
  // Current carrying index
  currentCarryingIndex = -1;
  // Check if pompom overlap with brownland
  hasEnteredBrownland = false;
  // Existing corn list
  existingCornLists: Types.Physics.Arcade.ImageWithDynamicBody[] = [];
  eatenCornLists: number[] = []

  cursor: Types.Input.Keyboard.CursorKeys;
  brownland: Types.Physics.Arcade.ImageWithDynamicBody;
  fenceGroup: Physics.Arcade.StaticGroup;
  farmer: Types.Physics.Arcade.SpriteWithDynamicBody;
  pom: Types.Physics.Arcade.SpriteWithDynamicBody;

  backgroundSound: Sound.BaseSound;
  alarmSound: Sound.BaseSound;
  pickSound: Sound.BaseSound;
  caughtSound: Sound.BaseSound;
  winSound: Sound.BaseSound;

  init(sceneData: ISceneData = {}) {
    console.log(sceneData, sceneData.isPassed !== false)

    this.loadMusicResource();
  }

  create() {
    const { scene, nextSceneName, eatenCornLists } = this;
    console.log(scene.key, nextSceneName, eatenCornLists);

    this.registerEvents();

    this.drawBackgroundAndBrownland();

    this.drawSoilAndCron();

    this.drawFarmer();

    this.drawPom();

    this.drawHealthBar();

    this.checkCollision();

    // @ts-expect-error
    window.scene = this;
    // @ts-expect-error
    window.Scene = Scene;
  }

  update() {
    const {
      pom,
      farmer,
      cursor,
      scene,
      physics,
      spaceKeyPressed,
      currentCarryingIndex,
      hasEnteredBrownland,
      farmerSpeed,
      pomSpeed
    } = this;

    if (cursor.space.isDown) {
      if (spaceKeyPressed) return;

      this.spaceKeyPressed = true;

      if (scene.isPaused()) scene.resume();
      else scene.pause();

      return;
    }

    if (cursor.up.isDown) {
      pom.setVelocity(0, -pomSpeed);
      pom.anims.play("pompom-front", true);
      this.drawCarryingCorn();
    } else if (cursor.down.isDown) {
      pom.setVelocity(0, pomSpeed);
      pom.anims.play("pompom-back", true);
      this.drawCarryingCorn();
    } else if (cursor.left.isDown) {
      pom.setVelocity(-pomSpeed, 0);
      pom.anims.play("pompom-left", true);
      this.drawCarryingCorn();
    } else if (cursor.right.isDown) {
      pom.setVelocity(pomSpeed, 0);
      pom.anims.play("pompom-right", true);
      this.drawCarryingCorn();
    } else {
      pom.setVelocity(0, 0);
      pom.anims.pause();
    }

    if ( ~currentCarryingIndex || hasEnteredBrownland ) {
      const angle = PMath.Angle.Between( pom.x, pom.y, farmer.x, farmer.y )
      let direction = 'front'

      if (Math.abs(angle) > Math.PI *3/4)direction='right'
      else if (Math.abs(angle) < Math.PI / 4 )direction='left'
      else if ( angle >= Math.PI / 4 && angle <= Math.PI * 3 / 4 ) direction = 'back'

      const _farmer = farmer.anims.play( `farmer-${direction}`, true )

      physics.moveToObject(_farmer, pom, farmerSpeed);
    }
  }

  registerEvents() {
    const {
      input: { keyboard },
    } = this;

    const cursor = keyboard.createCursorKeys();

    this.cursor = cursor;
  }

  drawBackgroundAndBrownland() {
    this.drawBackground();
    this.drawBrownlandAndFence();
  }

  drawBackground() {
    const { physics } = this;
    const {
      world: {
        bounds: { centerX, centerY },
      },
    } = physics;

    this.add.image(centerX, centerY, "background");
  }

  drawBrownlandAndFence() {
    const { physics } = this;
    const {
      world: {
        bounds: { width, centerX, centerY },
      },
    } = physics;

    const brownland = physics.add.image(
      centerX,
      centerY + BROWNLAND_OFFSET_Y,
      "brownland"
    );

    const fenceGroup = physics.add.staticGroup();

    fenceGroup
      .create(width - 25, centerY + BROWNLAND_OFFSET_Y, "fence")
      .setOrigin(0, 0.5)
      .refreshBody();

    this.brownland = brownland;
    this.fenceGroup = fenceGroup;
  }

  drawSoilAndCron() {
    const { physics, cornTotalCount, cornSoilGap, eatenCornLists,firstCornOffsetX } = this;
    const {
      world: {
        bounds: { centerY },
      },
    } = physics;

    const existingCornLists: Types.Physics.Arcade.ImageWithDynamicBody[] = [];

    Array.from({ length: cornTotalCount }).forEach((_item, index) => {
      const x = 150 + firstCornOffsetX + cornSoilGap + (100 + cornSoilGap) * index;

      this.add.image(x, centerY + BROWNLAND_OFFSET_Y, "soil").setOrigin(0, 0.5);

      if (~eatenCornLists.indexOf(index)) return;

      const corn = physics.add
        .image(x + 45, centerY + BROWNLAND_OFFSET_Y, "corn")
        .setOrigin( 0, 0.5 )
        .setScale(0.78)
      // @ts-expect-error
      corn.index = index;

      existingCornLists.push(corn);
    });

    this.existingCornLists = existingCornLists;
  }

  drawFarmer() {
    const { anims, physics } = this;

    const farmer = physics.add.sprite(72, 96, "farmer", 0);

    this.farmer = farmer;

    farmer.setCollideWorldBounds(true);

    anims.create({
      key: "farmer-front",
      frames: anims.generateFrameNumbers("farmer", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "farmer-back",
      frames: anims.generateFrameNumbers("farmer", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "farmer-left",
      frames: anims.generateFrameNumbers("farmer", { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "farmer-right",
      frames: anims.generateFrameNumbers("farmer", { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  drawPom() {
    const { anims, physics } = this;
    const {
      world: {
        bounds: { centerY },
      },
    } = physics;

    const pom = physics.add.sprite(720, centerY + 180, "pompom", 2);

    this.pom = pom;

    pom.setCollideWorldBounds(true);

    anims.create({
      key: "pompom-front",
      frames: anims.generateFrameNumbers("pompom", { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "pompom-back",
      frames: anims.generateFrameNumbers("pompom", { start: 7, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "pompom-left",
      frames: anims.generateFrameNumbers("pompom", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "pompom-right",
      frames: anims.generateFrameNumbers("pompom", { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  drawHealthBar(level = this.currentLevel - 1) {
    const { physics } = this;
    const {
      world: {
        bounds: { width },
      },
    } = physics;

    this.add
      .sprite(width - 136, 0, "healthbar", LEVEL_COUNT - level)
      .setOrigin(0, 0)
      .setScale(0.75);
  }

  drawEatenCorn() {
    const { physics, eatenCornLists } = this;
    const {
      world: {
        bounds: { width },
      },
    } = physics;

    eatenCornLists.forEach((_item, index) => {
      this.add
        .image(width - 18, 248 + 36 * index, "corn")
        .setOrigin(0, 0)
        .setScale(0.36);
    });
  }

  drawCarryingCorn(isMoving = true) {
    const { pom, currentCarryingCorn } = this;
    const { x, y } = pom;

    const _y = y + 18;

    if (currentCarryingCorn) {
      currentCarryingCorn.x = x;
      currentCarryingCorn.y = _y;
      return;
    }

    if (isMoving) return;

    const _currentCarryingCorn = this.add.image(x, _y, "corn");
    _currentCarryingCorn.setScale(0.5).setAngle(90);

    this.currentCarryingCorn = _currentCarryingCorn;
  }

  loadMusicResource(autoPlay = true) {
    this.backgroundSound = this.sound.add("background-music", { loop: true });
    this.alarmSound = this.sound.add( "alarm", { loop: true } );

    this.pickSound = this.sound.add("pick", { loop: false });
    this.caughtSound = this.sound.add("caught", { loop: false });
    this.winSound = this.sound.add("win", { loop: false });

    if (!autoPlay) return

    this.backgroundSound.play();
  }

  checkCollision() {
    const {
      scene,
      sound,
      physics,
      farmer,
      fenceGroup,
      brownland,
      pom,
      existingCornLists,
      backgroundSound,
      alarmSound,
      pickSound,
      caughtSound,
      winSound
    } = this;

    // When pompom overlaps with brownland
    physics.add.overlap(pom, brownland, () => {
      if (!alarmSound.isPlaying) {
        alarmSound.play();
        backgroundSound.stop();
      }

      this.hasEnteredBrownland = true;
    });

    // When pompom overlaps with corn
    physics.add.overlap(pom, existingCornLists, (_pom, corn) => {
      const { currentCarryingIndex, currentCarryingCorn } = this;

      // Pompom can only carry one corn at a time
      if ( ~currentCarryingIndex || currentCarryingCorn ) return;

      pickSound.play();

      corn.destroy();
      this.drawCarryingCorn(false);
      // @ts-expect-error
      this.currentCarryingIndex = corn.index;
    });

    // When pompom collides with fence
    physics.add.collider(pom, fenceGroup, () => {
      const { currentCarryingIndex, currentCarryingCorn, eatenCornLists, nextSceneName, cornTotalCount } = this;

      // When pompom is not carrying a corn, her collision with the fence doesn't count
      if (!~currentCarryingIndex || !currentCarryingCorn) return;

      currentCarryingCorn.destroy();
      this.currentCarryingCorn = null;

      eatenCornLists.push(currentCarryingIndex);

      if (eatenCornLists.length !== cornTotalCount) {
        scene.restart({ isPassed: false });

        return
      }

      if (nextSceneName) {
        scene.stop().start(nextSceneName, { isPassed: true });
      } else {
        this.drawHealthBar();

        setTimeout(() => {
          alert( "Congratulations!" )

          sound.stopAll()
          scene.stop().switch( 'Start' )
        }, 0);

        alarmSound.stop();
        winSound.play();
      }
    });

    // When pompom overlaps with farmer, send alert 'Pompom is caught!'
    physics.add.overlap(pom, farmer, () => {
      alarmSound.stop();
      backgroundSound.stop();
      caughtSound.play();

      alert("Pompom is caught!");
      scene.restart({ isPassed: false });
    });
  }

  resetDataStatus ( isPassed = true ) {
    const { sound, backgroundSound } = this

    sound.stopAll();
    backgroundSound.play()

    this.spaceKeyPressed = false;
    this.currentCarryingCorn = null;
    this.currentCarryingIndex = -1;
    this.hasEnteredBrownland = false;

    if ( !isPassed ) return

    this.eatenCornLists = []
  }
}
