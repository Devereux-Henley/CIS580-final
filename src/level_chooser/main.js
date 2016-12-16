

const CELLSIZE = 150;
class Level {
    hasEnded()/*: bool */ {
        return false;
    }

    hasWon()/*: bool */ {
        return false;
    }

    update(dt/*: number */) {

    }

    render(dt/*: number */, ctx/*: CanvasRenderingContext2D */) {

    }

    start() {

    }

    getTitle()/*: string */ {
        return "Some title";
    }
}

function inBlock(
    xy/*: {x: number, y: number} */,
    block
)/*: bool */ {
    return (
        xy.x > block.x && xy.x <= block.x + block.width
    ) && (
        xy.y > block.y && xy.y <= block.y + block.height
    )
}

class Button {
    /*::
    x: number
    y: number
    width: number
    height: number
    level: Level
    state: {} */
    constructor(
        x, y, width, height, level/*: Level */, state, winCondition, inGame
    ) {
        this.x = x;
        this.y = y;
        this.height = width;
        this.width = height;
        this.level = level;
        this.state = state;
        this.won = winCondition;
        this.inGame = inGame;
    }

    render(
        ctx/*: CanvasRenderingContext2D */
    ) {
      if(this.inGame == null){
        if(this.won == null){
          ctx.fillStyle = 'black';
        }
        else if(this.won == false){
          ctx.fillStyle = '#990000';
        }
        else if(this.won == true){
          ctx.fillStyle = 'green';
        }
          ctx.fillRect(this.x, this.y, this.width, this.height);
          ctx.fillStyle = 'red';
          if(this.won == false || this.won == true){
              ctx.fillStyle = 'white';
          }
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText(this.level.getTitle(), this.x + 6, this.y + this.height - 6, CELLSIZE - 12);

          if (this.state[this.level.getTitle()] || 0 > 0) {
              ctx.fillStyle = 'black';
              ctx.fillText('✓', this.x-16, this.y+8);
          }
      }
    }
}

class LevelSwitcher {
    /*::
    _buttons: Button[]
    _mouseXY: {x: number, y: number}
    _currentLevel: Level | null
    _levels: Level[]
    _state: {} */
    constructor(
        canvas/*: HTMLCanvasElement */,
        levels/*: Level[] */
    ) {
        this._mouseXY = {x: 0, y: 0};
        this._buttons = [];
        this._currentLevel = null;
        this._levels = levels;
        this.loadState();
        this.won = null;
        this.currentButton = null;

        canvas.onmousedown = this._mouseClick.bind(this);
        canvas.onmousemove = this._mouseMove.bind(this);
        let padding = (canvas.width - CELLSIZE * 5) / 6;
        let row_y = -CELLSIZE;
        let row_x = padding;
        let i = 0;
        for (let level of this._levels) {
            if (i%5 == 0) {
                row_y += CELLSIZE + 40;
                row_x = padding;
            }
            this._buttons.push(
                new Button(row_x, row_y, CELLSIZE, CELLSIZE, level, this._state, this.won, this._currentLevel));
            row_x += CELLSIZE + padding;
            i += 1;
        }
    }

    _mouseMove(
        ev/*: MouseEvent */
    ) {
        this._mouseXY = {x: ev.offsetX, y: ev.offsetY};
    }

    _mouseClick(
        ev/*: MouseEvent */
    ) {
        this._mouseXY = {x: ev.offsetX, y: ev.offsetY};
        let buttonOver = this._buttonOver();
        if (buttonOver !== null && this._currentLevel == null) {
            this._currentLevel = buttonOver.level;
            this._currentLevel.start();
            this.currentButton = buttonOver;
            chooseLevel.play();
        }
    }

    _buttonOver()/*: Button | null */ {
        for (let button of this._buttons) {
            if (inBlock(this._mouseXY, button)) {
                return button;
            }
        }
        return null;
    }

    render(
        dt/*: number */,
        ctx/*: CanvasRenderingContext2D */
    ) {
        if (this._currentLevel === null) {
            ctx.fillStyle = 'gray';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            let padding = (ctx.canvas.width - CELLSIZE * 5) / 6;
            for (let button of this._buttons) {
                button.render(ctx);
            }
            ctx.fillStyle = 'white';
            ctx.fillRect(this._mouseXY.x, this._mouseXY.y, 2, 2);
        } else {
            this._currentLevel.render(dt, ctx);
        }
    }

    update(
        dt/*: number */
    ) {
        if (this._currentLevel === null) {

        } else {
            this._currentLevel.update(dt);
            if (this._currentLevel !== null && this._currentLevel.hasEnded()) {
                this._currentLevel = null;
                for (var i = 0; i < this._buttons.length; i++) {
                  if(this._buttons[i] == this.currentButton){
                    this._buttons[i].won = false;
                  }
                }
            }
            else if(this._currentLevel !== null && this._currentLevel.hasWon()){
              this._currentLevel = null;
              for (var i = 0; i < this._buttons.length; i++) {
                if(this._buttons[i] == this.currentButton){
                  this._buttons[i].won = true;
                }
              }
            }
        }
    }

    loadState() {
        this._state = JSON.parse(localStorage.getItem("DankSoulsGame") || "{}");
    }

    saveState() {
        localStorage.setItem("DankSoulGame", JSON.stringify(this._state));
    }
}


module.exports = {
    LevelSwitcher: LevelSwitcher,
    Level: Level,
};
