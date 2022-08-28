// 世界重力动量
export const WORLD_POWER = 800;

// 游戏背景
export const GAME_BG_PIC_NAME = 'bg';
export const GAME_BG_WIDTH = 1356;
export const GAME_BG_HEIGHT = 768;
// 背景移动速度
export const GAME_BG_SPEED = 1;

export const SUN_PIC_NAME = 'sun';
export const SUN_WIDTH = 270;
export const SUN_HEIGHT = 270;
export const SUN_ROTATE_ANFLE = 0.3;

export const CLOUD_PIC_NAME1 = 'cloud1';
export const CLOUD_PIC_NAME2 = 'cloud2';
export const CLOUD_PIC_NAME3 = 'cloud3';
export const CLOUD_CONFIG = {
  width: 192,
  height: 96,
  speed: 300,
  // 难度上限
  maxSpeed: 400,
  interval: 2100,
  spacing: 260,
  // 40 次等级提升后到达最大难度 // 400 分
  levelConter: 40,
};

export const PLAYER_CONFIG = {
  width: 132,
  height: 108,

  boundWidth: 100,
  boundHeight: 66,
  boundOffsetX: 22,
  boundOffsetY: 18,

  animeWidth: 660,
  animeHeight: 108,
  annimeDuration: 600,

  pic: 'cat',
  cryPic: 'cat-cry',
  sprite: 'cat-run',

  // 玩家跳跃动量
  jumpPower: 500,
  jumpAngle: -20,
  jumpTime: 100,
  maxDropAngle: 20,
  dropAngleSpeed: 1.1,
};
