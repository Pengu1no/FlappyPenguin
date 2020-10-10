import styles from '../../styles/_variables.scss';
import { EGameState } from "../interfaces";
import { Pipe } from './pipe';
import { Bird } from "./bird";
import { interval, Observable, Subscription } from "rxjs";


export class Game {
  state: EGameState;
  score: number;
  speed: number;

  playerCoords: {x: number, y: number};

  bird: Bird;

  pipes: Pipe[] = [];

  updater$: Observable<number>;

  daytimeChange$: Observable<number>;
  daytimeSubscription$: Subscription = null;
  daytime: string;

  constructor() {
    this.bird = new Bird();
    this.reset();
  }

  private setScore() {
    const score = document.getElementById('score');

    const digits = this.score.toString().split('');
    const images = digits.map(digit => {
      const item = document.createElement('img');
      item.src = `assets/sprites/${digit}.png`;
      return item;
    })

    score.innerHTML = '';
    score.append(...images);
  }

  reset(): void {
    this.daytime = 'day';
    document.getElementById('background').className = 'day';
    this.menu();
    this.score = 0;
    this.bird.lives = 3;
    this.bird.drawLives();
    this.setScore();
    this.speed = 1;
    this.playerCoords = {
      x: 50,
      y: 300,
    }

    this.bird.position = this.playerCoords;
    this.bird.setPosition();

    this.pipes.forEach(pipe => pipe.destroy());
    this.pipes = [];
  }

  start(): void {
    if (this.state !== EGameState.menu) {
      return
    }

    this.daytimeChange$ = interval(10 * 1000);
    this.daytimeSubscription$ = this.daytimeChange$.subscribe(
      () => {
        if (this.daytime == 'day') {
          this.daytime = 'night';
          document.getElementById('background').className = 'night';
        } else {
          this.daytime = 'day';
          document.getElementById('background').className = 'day';
        }
        const color = this.daytime === 'day' ? 'green' : 'red';
        this.pipes.forEach(pipe => pipe.redraw(color))
      }
    )

    document.getElementById('start').className = 'message invisible';
    document.getElementById('game-over').className = 'message invisible';

    const color = this.daytime === 'day' ? 'green' : 'red';

    this.state = EGameState.playing;
    this.pipes = Array.from({length: 8}, (x, i) => i).map(idx => new Pipe((idx + 1) * 300, color, this.calculateHeight(idx)));
    this.bird.htmlElement.style.left = `${this.playerCoords.x}px`;
    this.bird.htmlElement.style.top = `${this.playerCoords.y}px`;
    this.bird.htmlElement.className = '';
    this.bird.htmlElement.classList.add('midflap');
    this.updater$ = interval(5);
    this.updater$.subscribe(() => this.tick());
  }

  gameOver(): void {
    this.state = EGameState.gameOver;
    this.daytimeSubscription$.unsubscribe();
    this.daytimeSubscription$ = null;
    document.getElementById('start').className = 'message invisible';
    document.getElementById('game-over').className = 'message';
  }

  menu(): void {
    this.state = EGameState.menu;
    document.getElementById('start').className = 'message';
    document.getElementById('game-over').className = 'message invisible';
  }

  passPipe(): void {
    const color = this.daytime === 'day' ? 'green' : 'red';
    this.pipes = [...this.pipes.slice(1), new Pipe(this.pipes.slice(-1)[0].position + 300, color, this.calculateHeight(8))];

    this.score += 1;
    this.speed *= 1 + 1 / this.score / 5;

    this.setScore();
  }

  calculateHeight(index: number): number {
    const baseHeight = +styles.scaleMultiplier * parseInt(styles.birdHeight) * +styles.windowDistanceMultiplier;
    return this.score + index < 20 ? baseHeight + Math.sqrt((20 - this.score - index) / 20) * baseHeight : baseHeight;
  }

  tick() {
    if (this.pipes[0]?.overlaps(this.bird) || this.bird.onFloor()) {
      this.bird.die();
      this.speed = 1;
      this.playerCoords = {
        x: 50,
        y: 300,
      }

      this.bird.position = this.playerCoords;
      this.bird.setPosition();

      this.pipes.forEach(pipe => pipe.destroy());
      this.pipes = [];
      const color = this.daytime === 'day' ? 'green' : 'red';
      this.pipes = Array.from({length: 8}, (x, i) => i).map(idx => new Pipe((idx + 1) * 300, color, this.calculateHeight(idx)));
    }
    if (this.bird.lives == 0) {
      return this.gameOver();
    }

    const move = this.speed;
    this.bird.tick();
    this.pipes.forEach(pipe => pipe.tick(move));
    if (this.pipes[0]?.exited()) {
      this.passPipe();
    }
  }
}
