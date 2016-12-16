"use strict"
module.exports = exports = Gui;


function Gui(p){
	this.player = p;
	this.health = this.player.getHealth();
	this.hearts = [3];
	for (var i = 0; i < 3; i++) {
			this.hearts[i] = new Image();
			this.hearts[i].src = 'assets/heart_full.png';
	}
}

Gui.prototype.damage = function() {
	if (this.hearts != null){
		if (this.health % 2 == 0){
			this.hearts[this.hearts.length - 1].src = 'assets/heart_half.png';
		}
		else {
			this.hearts.splice(this.hearts.length - 1, 1);
		}
	}
	this.health -= 1;
}

Gui.prototype.update = function(elapsedTime) {
	this.health = this.player.getHealth();

}

Gui.prototype.render = function(elapsedTime, ctx) {
	for (var i = 0; i < this.hearts.length; i++ ) {
		ctx.drawImage(
			this.hearts[i],
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
