import { Scene, Types, Physics, GameObjects } from "phaser";

import {
  LEVEL_COUNT,
  POM_SPEED,
  FARMER_SPEED,
  CORN_TOTAL_COUNT,
  CORN_SOIL_GAP,
  BROWNLAND_OFFSET_Y,
} from "../config";

// navigate how many corns are eaten
export const eatenCornLists: number[] = [];

export default class LevelBase extends Scene {
  // next scene
  nextSceneName = "LevelOne";
  // check if space key is pressed
  spaceKeyPressed = false;
  // current carrying corn
  currentCarryingCorn: GameObjects.Image | null = null;
  // current carrying index
  currentCarryingIndex = -1;
  // check if pompom overlap with brownland
  hasEnteredBrownland = false;
  // existing corn list
  existingCornLists: Types.Physics.Arcade.ImageWithDynamicBody[] = [];

  cursor: Types.Input.Keyboard.CursorKeys;
  brownland: Types.Physics.Arcade.ImageWithDynamicBody;
  fenceGroup: Physics.Arcade.StaticGroup;
  farmer: Types.Physics.Arcade.SpriteWithDynamicBody;
  pompom: Types.Physics.Arcade.SpriteWithDynamicBody;

  create() {
    const { scene, nextSceneName } = this;
    console.log(scene.key, nextSceneName, eatenCornLists);

    this.registerEvents();

    this.drawBackgroundAndBrownland();

    this.drawSoilAndCron();
    // this.drawEatenCorn()

    this.drawFarmer();
    this.drawPom();

    this.drawHealthBar();

    this.checkCollision();

    // @ts-expect-error
    window.scene = this;
  }

  update() {
    const {
      pompom,
      farmer,
      cursor,
      scene,
      physics,
      spaceKeyPressed,
      currentCarryingIndex,
      hasEnteredBrownland,
    } = this;

    if (cursor.space.isDown) {
      if (spaceKeyPressed) return;

      this.spaceKeyPressed = true;

      if (scene.isPaused()) scene.resume();
      else scene.pause();

      return;
    }

    if (cursor.up.isDown) {
      pompom.setVelocity(0, -POM_SPEED);
      pompom.anims.play("pompom-front", true);
      this.drawCarryingCorn();
    } else if (cursor.down.isDown) {
      pompom.setVelocity(0, POM_SPEED);
      pompom.anims.play("pompom-back", true);
      this.drawCarryingCorn();
    } else if (cursor.left.isDown) {
      pompom.setVelocity(-POM_SPEED, 0);
      pompom.anims.play("pompom-left", true);
      this.drawCarryingCorn();
    } else if (cursor.right.isDown) {
      pompom.setVelocity(POM_SPEED, 0);
      pompom.anims.play("pompom-right", true);
      this.drawCarryingCorn();
    } else {
      pompom.setVelocity(0, 0);
      pompom.anims.pause();
    }

    if (~currentCarryingIndex || hasEnteredBrownland) {
      physics.moveToObject(farmer, pompom, FARMER_SPEED);
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
    const { physics } = this;
    const {
      world: {
        bounds: { centerY },
      },
    } = physics;

    const existingCornLists = [];

    Array.from({ length: CORN_TOTAL_COUNT }).forEach((item, index) => {
      const x = 150 + CORN_SOIL_GAP + (128 + CORN_SOIL_GAP) * index;

      this.add.image(x, centerY + BROWNLAND_OFFSET_Y, "soil").setOrigin(0, 0.5);

      if (~eatenCornLists.indexOf(index)) return;

      const corn = physics.add
        .image(x + 45, centerY + BROWNLAND_OFFSET_Y, "corn")
        .setOrigin(0, 0.5);

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

    const pompom = physics.add.sprite(720, centerY + 180, "pompom", 2);

    this.pompom = pompom;

    pompom.setCollideWorldBounds(true);

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

  drawHealthBar(level = eatenCornLists.length) {
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
    const { physics } = this;
    const {
      world: {
        bounds: { width },
      },
    } = physics;

    eatenCornLists.forEach((item, index) => {
      this.add
        .image(width - 18, 248 + 36 * index, "corn")
        .setOrigin(0, 0)
        .setScale(0.36);
    });
  }

  drawCarryingCorn(isMoving = true) {
    const { pompom, currentCarryingCorn } = this;
    const { x, y } = pompom;

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

  checkCollision() {
    const {
      scene,
      physics,
      farmer,
      fenceGroup,
      brownland,
      pompom,
      existingCornLists,
    } = this;

    // pompom overlaps with brownland
    physics.add.overlap(pompom, brownland, (pompom, brownland) => {
      this.hasEnteredBrownland = true;
    });

    // pompom overlaps with corn
    physics.add.overlap(pompom, existingCornLists, (pompom, corn) => {
      const { currentCarryingIndex, currentCarryingCorn } = this;

      // pompom can only carry one corn at a time
      if (~currentCarryingIndex || currentCarryingCorn) return;

      corn.destroy();
      this.drawCarryingCorn(false);
      this.currentCarryingIndex = corn.index;
    });

    // pompom collide with fence
    physics.add.collider(pompom, fenceGroup, (pompom, fenceGroup) => {
      const { currentCarryingIndex, currentCarryingCorn, nextSceneName } = this;

      // When pompom is not carrying a corn, her collision with the fence doesn't count
      if (!~currentCarryingIndex || !currentCarryingCorn) return;

      currentCarryingCorn.destroy();
      this.currentCarryingCorn = null;

      eatenCornLists.push(currentCarryingIndex);

      if (nextSceneName) {
        scene.stop().start(nextSceneName);
      } else {
        this.drawHealthBar();
        // this.drawEatenCorn()

        setTimeout(() => {
          alert("Congratulations, you passed all three levels!");

          scene.stop().switch("LevelOne");
        }, 0);
      }
    });

    // When pompom overlaps with farmer, send alert 'Pompom is caught!'
    physics.add.overlap(pompom, farmer, (pompom, farmer) => {
      alert("Pompom is caught!");
      scene.restart();
    });
  }

  resetDataStatus() {
    this.spaceKeyPressed = false;
    this.currentCarryingCorn = null;
    this.currentCarryingIndex = -1;
    this.hasEnteredBrownland = false;
  }
}
