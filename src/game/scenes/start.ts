import { Scene } from 'phaser';

import bg from '../../assets/sprites/bg.png';
import cat from '../../assets/sprites/cat.png';
import catCry from '../../assets/sprites/cat_cry.png';
import catRun from '../../assets/sprites/cat_run.png';
import cloud1 from '../../assets/sprites/cloud1.png';
import cloud2 from '../../assets/sprites/cloud2.png';
import cloud3 from '../../assets/sprites/cloud3.png';

import sun from '../../assets/sprites/sun.png';

import bgm from '../../assets/sounds/bgm.mp3';
import jump from '../../assets/sounds/jump.mp3';
import gameOver from '../../assets/sounds/game_over.mp3';
import {
  CLOUD_PIC_NAME1,
  CLOUD_PIC_NAME2,
  CLOUD_PIC_NAME3,
  GAME_BG_PIC_NAME,
  PLAYER_CONFIG,
  SUN_PIC_NAME,
} from '../config';

export default class StartScene extends Scene {
  constructor() {
    super('start');
  }
  //加载游戏资源
  preload() {
    const { width, height } = this.sys.canvas;

    const progressText = this.add
      .text(width / 2, (height / 5) * 4, '0%')
      .setFontSize(42)
      .setColor('#fff');

    this.load.on('progress', (a: number) => {
      progressText.setText(Math.floor(a * 100) + '%');
    });

    this.load.image(GAME_BG_PIC_NAME, bg);
    this.load.image(PLAYER_CONFIG.pic, cat);
    this.load.image(PLAYER_CONFIG.cryPic, catCry);
    this.load.image(CLOUD_PIC_NAME1, cloud1);
    this.load.image(CLOUD_PIC_NAME2, cloud2);
    this.load.image(CLOUD_PIC_NAME3, cloud3);
    this.load.image(SUN_PIC_NAME, sun);

    this.load.spritesheet(PLAYER_CONFIG.sprite, catRun, {
      frameWidth: PLAYER_CONFIG.width,
      frameHeight: PLAYER_CONFIG.height,
    });

    this.load.audio('bgm', bgm);
    this.load.audio('jump', jump);
    this.load.audio('game_over', gameOver);
  }

  create() {
    this.gameStart();
  }

  gameStart() {
    this.scene.start('round');
  }
}
