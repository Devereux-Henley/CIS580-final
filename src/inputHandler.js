// @flow


const input = module.exports.inputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false,
    dodge: false,
    space: false,
}


window.onkeydown = function(event) {
    input.shift = event.shiftKey;
    switch(event.key) {
        case "W":
        case "ArrowUp":
        case "w":
            input.up = true;
            event.preventDefault();
            break;
        case "S":
        case "ArrowDown":
        case "s":
            input.down = true;
            event.preventDefault();
            break;
        case "A":
        case "ArrowLeft":
        case "a":
            input.left = true;
            event.preventDefault();
            break;
        case "D":
        case "ArrowRight":
        case "d":
            input.right = true;
            event.preventDefault();
            break;
        case " ":
            input.space = true;
            event.preventDefault();
            break;
        // Decrement health - test
        case "T":
        case "t":
            //   damagePlayer();
            break;
    }
}

window.onkeyup = function(event) {
    input.shift = event.shiftKey;
    switch(event.key) {
        case "W":
        case "ArrowUp":
        case "w":
            input.up = false;
            event.preventDefault();
            break;
        case "S":
        case "ArrowDown":
        case "s":
            input.down = false;
            event.preventDefault();
            break;
        case "A":
        case "ArrowLeft":
        case "a":
            input.left = false;
            event.preventDefault();
            break;
        case "D":
        case "ArrowRight":
        case "d":
            input.right = false;
            event.preventDefault();
            break;
        case " ":
            input.space = false;
            event.preventDefault();
            break;
    }
}
