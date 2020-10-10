import { fromEvent } from "rxjs";
import { Game } from "./scripts/game/game";
import { EGameState } from "./scripts/interfaces";


window.onload = () => {
  let keyPress = fromEvent(document, 'keypress');
  let click = fromEvent(document, 'click');

  const game = new Game();

  keyPress.subscribe((event: KeyboardEvent) => {
    switch (event.key) {
      case ' ':
      case 'Enter':
        if (game.state === EGameState.menu) {
          game.start();
        } else if (game.state === EGameState.playing) {
          game.bird.flap();
        } else if (game.state === EGameState.gameOver) {
          game.reset();
        }
        break;
      default:
        break;
    }
  })

  click.subscribe(() => {
    if (game.state === EGameState.menu) {
      game.start();
    } else if (game.state === EGameState.playing) {
      game.bird.flap();
    }
  })
}
