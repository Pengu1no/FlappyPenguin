import styles from '../../styles/_variables.scss';
import { Bird } from "./bird";

export class Pipe {
  position: number;
  height: number;

  game = document.getElementById('game');

  htmlEntities: { top: HTMLDivElement, bottom: HTMLDivElement };

  constructor(position: number,
              color: string,
              windowHeight: number,
              height: number = Math.random() * 0.4 + 0.3) {
    this.position = position;
    this.height = height;

    this.htmlEntities = {
      top: document.createElement('div') as HTMLDivElement,
      bottom: document.createElement('div') as HTMLDivElement,
    }

    const totalHeight = document.documentElement.clientHeight * parseInt(styles.bgHeight) / 100;
    const windowCenter = totalHeight * height;
    const topPipeHeight = windowCenter - windowHeight / 2;

    this.htmlEntities.top.style.left = `${position}px`;
    this.htmlEntities.top.style.height = `${topPipeHeight}px`;
    this.htmlEntities.top.classList.add('pipe', color, 'top');

    this.htmlEntities.bottom.style.left = `${position}px`;
    this.htmlEntities.bottom.style.height = `${totalHeight - topPipeHeight - windowHeight}px`;
    this.htmlEntities.bottom.classList.add('pipe', color, 'bottom');

    this.game.appendChild(this.htmlEntities.top);
    this.game.appendChild(this.htmlEntities.bottom);
  }

  redraw(color: string) {
    this.htmlEntities.top.className = '';
    this.htmlEntities.bottom.className = '';
    this.htmlEntities.top.classList.add('pipe', color, 'top');
    this.htmlEntities.bottom.classList.add('pipe', color, 'bottom');
  }

  overlaps(bird: Bird): boolean {
    const rectTop = this.htmlEntities.top.getBoundingClientRect();
    const rectBottom = this.htmlEntities.bottom.getBoundingClientRect();
    const rectBird = bird.htmlElement.getBoundingClientRect();

    const width = rectBird.width * .9;
    const height = rectBird.height * .9;

    const isInHorizontalBoundsTop =
      rectTop.x < rectBird.x + rectBird.width * .95 && rectTop.x + rectTop.width > rectBird.x + rectBird.width * .05;
    const isInVerticalBoundsTop =
      rectTop.y < rectBird.y + rectBird.height * .95 && rectTop.y + rectTop.height > rectBird.y + rectBird.height * .05;

    const isInHorizontalBoundsBottom =
      rectBottom.x < rectBird.x + rectBird.width * .95 && rectBottom.x + rectBottom.width > rectBird.x + rectBird.width * .05;
    const isInVerticalBoundsBottom =
      rectBottom.y < rectBird.y + rectBird.height * .95 && rectBottom.y + rectBottom.height > rectBird.y + rectBird.height * .05;

    return isInHorizontalBoundsTop && isInVerticalBoundsTop || isInHorizontalBoundsBottom && isInVerticalBoundsBottom;
  }

  tick(step: number): void {
    this.position -= step;
    this.htmlEntities.top.style.left = `${this.position}px`;
    this.htmlEntities.bottom.style.left = `${this.position}px`;

    if (this.exited()) {
      this.destroy();
    }
  }

  destroy(): void {
    this.htmlEntities.top.remove();
    this.htmlEntities.bottom.remove();
  }

  exited(): boolean {
    return this.rightCorner() <= 0;
  }

  rightCorner(): number {
    const pipe = this.htmlEntities.top;
    const currentPos = parseInt(pipe.style.left);
    return currentPos + pipe.getBoundingClientRect().width;
  }
}
