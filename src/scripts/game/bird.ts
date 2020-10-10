import styles from '../../styles/_variables.scss'
import { EBirdState } from "../interfaces";

export class Bird {
  position: { x: number, y: number };
  state: EBirdState;
  force: number;

  lives: number;
  livesElement: HTMLDivElement;

  htmlElement: HTMLDivElement;

  constructor() {
    this.lives = 3;
    this.livesElement = document.getElementById('lives') as HTMLDivElement;
    this.drawLives();
    this.htmlElement = document.getElementById('bird') as HTMLDivElement;
    this.position = { x: 50, y: 300 };
    this.setPosition();
    this.state = EBirdState.midflap;
    this.force = 0;
  }

  setPosition() {
    this.htmlElement.style.left = `${this.position.x}px`;
    this.htmlElement.style.top = `${this.position.y}px`;
  }

  flap() {
    this.force = 5;
    this.state = EBirdState.upflap;
    this.setClass('downflap');
  }

  private setClass(newClass: string) {
    this.htmlElement.className = newClass;
  }

  tick() {
    switch (this.state) {
      case EBirdState.upflap:
        if (this.force > 0) {
          this.position.y -= this.force * 0.9;
        }
        if (this.force < 0.1) {
          this.setClass('midflap');
          this.state = EBirdState.midflap;
        }
        break;
      case EBirdState.midflap:
        if (this.force < -0.1) {
          this.state = EBirdState.downflap;
          this.setClass('upflap');
        }
        break;
      case EBirdState.downflap:
        this.position.y -= this.force * 0.9;
        break;
    }
    this.force = Math.max(-5, this.force - 0.15);
    this.setPosition();
  }

  onFloor() {
    const birdHeight = this.htmlElement.getBoundingClientRect().height;
    const bgHeight = document.getElementById('background').getBoundingClientRect().height;
    return this.position.y + birdHeight > bgHeight;
  }

  die() {
    this.lives -= 1;
    this.drawLives();
  }

  drawLives() {
    const digits = this.lives.toString().split('');
    const images = digits.map(digit => {
      const item = document.createElement('img');
      item.src = `assets/sprites/${digit}.png`;
      return item;
    })

    this.livesElement.innerHTML = '';
    this.livesElement.append(...images);
  }

}
