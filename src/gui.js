"use strict"
module.exports = exports = Gui;

var hearts = [3];
for (var i = 0; i < 3; i++) {
		hearts[i] = new Image();
		hearts[i].src = 'assets/heart_full.png';
}

function Gui(p){
	this.player = p;
	this.health = this.player.getHealth();
}

Gui.prototype.damage = function() {
	if (hearts != null){
		if (this.health % 2 == 0){
			hearts[hearts.length - 1].src = 'assets/heart_half.png';
		}
		else {
			hearts.splice(hearts.length - 1, 1);
		}
	}
	this.health -= 1;
}

Gui.prototype.update = function(elapsedTime) {
	this.health = this.player.getHealth();

}

Gui.prototype.render = function(elapsedTime, ctx) {
	for (var i = 0; i < hearts.length; i++ ) {
		ctx.drawImage(
			hearts[i],
			0, 0, 120, 120,
		900+(40*i), 5, 40, 40
		);
	}

	// Render stamina bar.
	ctx.fillStyle = "black";
	ctx.fillRect(900, 44, 120, 20);
	ctx.fillStyle = "green";
	ctx.fillRect(902, 46, 1.16 * this.player.stamina, 16);
}
