import Phaser from 'phaser';
import {
  GAME_BG_SPEED,
  WORLD_POWER,
  PLAYER_CONFIG,
  CLOUD_CONFIG,
  GAME_BG_HEIGHT,
  GAME_BG_WIDTH,
  GAME_BG_PIC_NAME,
  SUN_PIC_NAME,
  SUN_ROTATE_ANFLE,
  SUN_HEIGHT,
  SUN_WIDTH,
  CLOUD_PIC_NAME1,
  CLOUD_PIC_NAME2,
  CLOUD_PIC_NAME3,
} from '../config';

export default class Round extends Phaser.Scene {
  private point = 0;

  private soundBgm!: Phaser.Sound.BaseSound;
  private soundJump!: Phaser.Sound.BaseSound;
  private soundGameOver!: Phaser.Sound.BaseSound;

  private bg!: Phaser.GameObjects.TileSprite;
  private startWord!: Phaser.GameObjects.Text;
  private sun!: Phaser.GameObjects.Image;
  private score!: Phaser.GameObjects.Text;
  private player!: Phaser.Physics.Arcade.Sprite;
  private pipes!: Phaser.Physics.Arcade.Group;

  private playerAlive!: boolean;
  private isStart = false;

  constructor() {
    super('round');
  }

  create() {
    this.setSound();
    this.setBg();
    this.setContrler();
    this.setAnimes();
    this.setPoint();
    this.setCloud();
    this.setPlayer();
    this.setStartWord();

    this.physics.add.overlap(this.player, this.pipes, this.gameOver);
  }

  update() {
    this.bg.tilePositionX += GAME_BG_SPEED;
    this.sun.angle += SUN_ROTATE_ANFLE;

    // 旋转掉落
    if (this.isStart && this.player.angle < PLAYER_CONFIG.maxDropAngle) {
      this.player.angle += PLAYER_CONFIG.dropAngleSpeed;
    }

    // 上下边界
    if (
      (this.player.y > this.sys.canvas.height || this.player.y < 0) &&
      this.playerAlive
    ) {
      this.gameOver();
    }
    this.destroyOutOfBoundsPipe();
  }

  setSound() {
    this.soundBgm = this.sound.add('bgm');
    this.soundJump = this.sound.add('jump');
    this.soundGameOver = this.sound.add('game_over');
    this.soundBgm.play({ loop: true });
  }

  setBg() {
    const { width, height } = this.sys.canvas;
    const scaley = height / GAME_BG_HEIGHT;
    const scalex = Math.max(width / GAME_BG_WIDTH, scaley);
    this.bg = this.add
      .tileSprite(0, 0, width, height, GAME_BG_PIC_NAME)
      .setOrigin(0, 0)
      .setTileScale(scalex, scaley);
  }

  setPoint() {
    const scoreGroup = this.add
      .container(SUN_WIDTH / 8, SUN_HEIGHT / 8)
      .setDepth(1);

    this.sun = this.add
      .image(0, 0, SUN_PIC_NAME)
      .setDisplaySize(SUN_WIDTH, SUN_HEIGHT);

    this.score = this.add
      .text(-6, -12, `${this.point}`)
      .setFontSize(52)
      .setAlign('center')
      .setFontStyle('bold')
      .setColor('#e69005');

    scoreGroup.add(this.sun);
    scoreGroup.add(this.score);
  }

  setStartWord() {
    const { width, height } = this.sys.canvas;
    this.startWord = this.add
      .text(width / 2, height / 2, '点击/键盘空格开始游戏~')
      .setAlign('center')
      .setOrigin(0.5, 0.5)
      .setFontSize(28)
      .setColor('#f4fcff');
  }

  setAnimes() {
    this.anims.create({
      key: PLAYER_CONFIG.sprite,
      // @ts-ignore
      hideOncomplete: false,
      frames: PLAYER_CONFIG.sprite,
      duration: PLAYER_CONFIG.annimeDuration,
      repeat: -1,
    });
  }

  setPlayer() {
    const { width } = this.sys.canvas;
    this.player = this.physics.add
      .sprite(width / 3, (this.sys.canvas.height / 3) * 1, PLAYER_CONFIG.pic)
      .setDisplaySize(PLAYER_CONFIG.width, PLAYER_CONFIG.height)
      .setSize(PLAYER_CONFIG.boundWidth, PLAYER_CONFIG.boundHeight)
      .setOffset(PLAYER_CONFIG.boundOffsetX, PLAYER_CONFIG.boundOffsetY)
      .play('cat-run')
      .setDepth(1);

    this.playerAlive = true;
  }

  setContrler() {
    this.input.once('pointerdown', this.start, this);
    const keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    keySpace.once('down', this.start, this);

    this.input.on('pointerdown', this.jump, this);
    keySpace.on('down', this.jump, this);
  }

  // 需要一个事件再触发逻辑，避免没反应过来就死了
  start() {
    this.player.setGravityY(WORLD_POWER);
    this.isStart = true;
    this.startWord.destroy();
  }

  jump() {
    if (!this.playerAlive) return;

    this.soundJump.play();
    this.add.tween({
      targets: this.player,
      props: {
        angle: {
          value: PLAYER_CONFIG.jumpAngle,
          duration: PLAYER_CONFIG.jumpTime,
        },
      },
    });
    this.player.setVelocityY(-PLAYER_CONFIG.jumpPower);
  }

  setCloud() {
    this.pipes = this.physics.add.group();

    this.time.addEvent({
      delay: CLOUD_CONFIG.interval,
      loop: true,
      startAt: 0,
      callback: () => {
        if (!this.isStart || !this.playerAlive) return;

        const height = this.sys.canvas.height;
        const width = this.sys.canvas.width + CLOUD_CONFIG.width;

        const offset = height / 5;

        const randomYOffset = Math.floor((Math.random() + 0.5) * offset);
        const randomXOffset = Math.floor((Math.random() - 0.5) * offset);
        const randomSpacing = Math.floor(
          ((Math.random() - 0.5) * CLOUD_CONFIG.spacing) / 4
        );
        const pic = this.getCloudPicName();
        // top cloud
        this.pipes
          .get(width + randomXOffset, randomYOffset, pic)
          .setDisplaySize(CLOUD_CONFIG.width, CLOUD_CONFIG.height)
          .setVelocityX(this.levelSpeed());

        // bottom cloud
        this.pipes
          .get(
            width + randomXOffset,
            randomYOffset +
              CLOUD_CONFIG.height +
              CLOUD_CONFIG.spacing +
              randomSpacing,
            pic
          )
          .setDisplaySize(CLOUD_CONFIG.width, CLOUD_CONFIG.height)
          .setVelocityX(this.levelSpeed());
      },
    });
  }

  getCloudPicName() {
    return [CLOUD_PIC_NAME1, CLOUD_PIC_NAME2, CLOUD_PIC_NAME3][
      Math.floor(Math.random() * 2) + 1
    ];
  }

  levelSpeed() {
    const speed =
      CLOUD_CONFIG.speed +
      (Math.floor(this.point / 10) *
        (CLOUD_CONFIG.maxSpeed - CLOUD_CONFIG.speed)) /
        CLOUD_CONFIG.levelConter;

    if (speed > CLOUD_CONFIG.maxSpeed) return -CLOUD_CONFIG.maxSpeed;
    return -speed;
  }

  destroyOutOfBoundsPipe() {
    this.pipes.getChildren().forEach((pipe) => {
      const bounds = (pipe as Phaser.Physics.Arcade.Sprite).getBounds();
      if (
        bounds.right < this.sys.canvas.width / 3 - PLAYER_CONFIG.width / 3 &&
        // @ts-ignore
        !pipe.scored
      ) {
        // @ts-ignore
        pipe.scored = true;
        this.point += 0.5;
        this.score.setText(`${this.point}`);
      }
      if (bounds.right < 0) {
        pipe.destroy();
      }
    });
  }

  gameOver = () => {
    if (!this.playerAlive) return;

    this.player.anims.pause();

    this.player.setTexture('cat-cry');
    // 给一个类似与跳的动作
    this.player.setVelocityY(-PLAYER_CONFIG.jumpPower / 2);

    // 重置状态
    this.playerAlive = false;
    this.isStart = false;

    // 停止柱子运动
    this.time.removeAllEvents();
    this.pipes.getChildren().forEach((pipe) => {
      (pipe as Phaser.Physics.Arcade.Sprite).setVelocityX(0);
    });

    // 音乐切换
    this.soundBgm.pause();
    this.soundGameOver.play();
    this.soundGameOver.once('complete', () => {
      this.sound.stopAll();
      this.point = 0;
      // 游戏结束，其他逻辑
      this.scene.start('start');
    });
  };
}
