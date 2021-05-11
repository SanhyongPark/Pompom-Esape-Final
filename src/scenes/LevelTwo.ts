import LevelBase, { ISceneData } from "./LevelBase";

import { POM_SPEED, FARMER_SPEED } from "../config";

export default class LevelTwo extends LevelBase {
  constructor() {
    super("LevelTwo");

    this.nextSceneName = "LevelThree";
    this.currentLevel = 2
    this.pomSpeed = POM_SPEED;
    this.farmerSpeed = FARMER_SPEED * 4 / 3;
    this.cornSoilGap = 48
    this.cornTotalCount = 3
    this.firstCornOffsetX = -12
  }

  init(sceneData: ISceneData = {}) {
    const { isPassed } = sceneData

    super.init(sceneData);

    this.resetDataStatus(isPassed !== false);
    console.log("LevelTwo inited");
  }

  create() {
    super.create();
    console.log("LevelTwo created");
  }
}
