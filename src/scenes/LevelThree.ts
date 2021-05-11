import LevelBase, { ISceneData } from "./LevelBase";

import { POM_SPEED, FARMER_SPEED } from "../config";

export default class LevelThree extends LevelBase {
  FARMER_SPEED: number;
  constructor() {
    super("LevelThree");

    this.nextSceneName = "";
    this.currentLevel = 3
    this.pomSpeed = POM_SPEED;
    this.farmerSpeed = FARMER_SPEED * 20 / 11;
    this.cornSoilGap = 25
    this.cornTotalCount = 4
    this.firstCornOffsetX = -28
  }

  init(sceneData: ISceneData = {}) {
    const { isPassed } = sceneData

    super.init(sceneData);

    this.resetDataStatus(isPassed !== false);
    console.log("LevelThree inited");
  }

  create() {
    super.create();
    console.log("LevelThree created");
  }
}
