import LevelBase, { ISceneData } from "./LevelBase";

import { POM_SPEED, FARMER_SPEED } from "../config";

export default class LevelOne extends LevelBase {
  FARMER_SPEED: number;
  constructor() {
    super("LevelOne");

    this.nextSceneName = "LevelTwo"
    this.currentLevel = 1
    this.pomSpeed = POM_SPEED;
    this.farmerSpeed = FARMER_SPEED;
    this.cornSoilGap = 72
    this.cornTotalCount = 2
    this.firstCornOffsetX = 24
  }

  init(sceneData: ISceneData = {}) {
    const { isPassed } = sceneData

    super.init(sceneData);

    this.resetDataStatus(isPassed !== false);
    console.log("LevelOne inited");
  }

  create() {
    super.create();
    console.log("LevelOne created");
  }
}
