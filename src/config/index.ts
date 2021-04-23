import { AUTO, Types } from 'phaser'

// 是否 调试模式
export const IS_DEBUG = false

// 游戏状态
export const GAME_STATUS_IDLE = 'idle'
export const GAME_STATUS_RUNNING = 'running'
export const GAME_STATUS_PAUSED = 'paused'
export const GAME_STATUS_CAUGHT = 'caught'
export const GAME_STATUS_EATEN = 'eaten'
export const GAME_STATUS_OVER = 'over'

// 游戏级数
export const LEVEL_COUNT = 3

// 土地 垂直偏移
export const BROWNLAND_OFFSET_Y = 0

// 单个 小鸡精灵 尺寸
export const POM_SPEED = 160
export const POM_SPRITE_WIDTH = 80
export const POM_SPRITE_HEIGHT = 120

// 单个 农夫精灵 尺寸
export const FARMER_SPEED = 80
export const FARMER_SPRITE_WIDTH = 84
export const FARMER_SPRITE_HEIGHT = 98

// 单个 进度条精灵 尺寸
export const HEALTHBAR_SPRITE_WIDTH = 160
export const HEALTHBAR_SPRITE_HEIGHT = 80

// 玉米总数
export const CORN_TOTAL_COUNT = 3
export const CORN_SOIL_GAP = 29

export const GAME_CONFIG: Types.Core.GameConfig = {
  title: 'PomPom PK Farmer',
  type: AUTO,
  width: 800,
  height: 600,
  transparent: true,
  disableContextMenu: true,
  canvasStyle: `display: block; margin: 24px auto 0`,
  physics: {
    default: 'arcade',
    arcade: {
      debug: IS_DEBUG,
      debugShowBody: true,
      debugShowStaticBody: true,
      gravity: { x: 0, y: 0 }
    }
  }
}
