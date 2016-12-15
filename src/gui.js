// @flow

const Player = require('./player');

const img = new Image();
img.src = 'assets/heart_full.png';
const HEART_PADDING = 2;
const HEART_SIZE = 24;
const HEART_NUM = 3;
const HEART_IMG = createHeartImage();

class Gui {
    /*::
    player: Player
    */
    constructor(player/*: Player */) {
        this.player = player;
    }

    render(
        dt/*: number */,
        ctx/*: CanvasRenderingContext2D */
    ) {
        let h = this.player.health;
        let p = 6;
        let max_width = HEART_IMG.width;
        let o = max_width - (HEART_PADDING * (h - 1) + HEART_SIZE * h) / 2;
        let x = ctx.canvas.width - HEART_IMG.width;
        ctx.drawImage(
            HEART_IMG,
            o, 0, max_width, HEART_SIZE,
            x - p + o, p, max_width, HEART_SIZE
        );
    }
}

module.exports.Gui = Gui;


function createHeartImage() {
    const canvas = document.createElement("canvas");
    canvas.width = HEART_PADDING * (HEART_NUM - 1) + HEART_SIZE * HEART_NUM;
    canvas.height = HEART_SIZE;
    let ctx = canvas.getContext('2d');
    if (!ctx) throw "";

    let x = -HEART_PADDING;
    for (let i=0; i<HEART_NUM; i++) {
        ctx.drawImage(
            img,
            0, 0, img.width, img.height,
            (i*(HEART_PADDING+HEART_SIZE)), 0, HEART_SIZE, HEART_SIZE
        );
    }
    return canvas;
}
