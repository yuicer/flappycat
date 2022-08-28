import Phaser from 'phaser';
import start from './scenes/start';
import round from './scenes/round';

export function gameStart() {
  return new Phaser.Game({
    title: 'flappy cat',
    version: '1.0.0',
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'app',
    autoFocus: true,
    physics: {
      default: 'arcade',
      arcade: {
        debug: process.env.NODE_ENV === 'production' ? false : true,
      },
    },
    scene: [start, round],
  });
}
