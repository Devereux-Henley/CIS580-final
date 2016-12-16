"use strict";

const input = require('./inputHandler').inputState;
//const Gui = require('./gui');

/* Constants */
const PLAYER_SPEED = 2.0;
const DODGE_SPEED = 1.5 * PLAYER_SPEED;
const SPRINT_SPEED = 2.0 * PLAYER_SPEED;
const RENDER_TIMER = 200;
const STAMINA_DECAY = 2;
const STAMINA_RECHARGE = 1;
const DODGE_END = 4 * RENDER_TIMER;
const DODGE_DELAY = 10 * RENDER_TIMER;
const PLAYER_SHAPE = "circle";
const PLAYER_RADIUS = 16;

const EAST_WALK = [new SheetPosition(0, 96),
    new SheetPosition(24, 96),
    new SheetPosition(48, 96),
    new SheetPosition(72, 96),
    new SheetPosition(96, 96),
    new SheetPosition(120, 96),
    new SheetPosition(144, 96),
    new SheetPosition(168, 96)
];

const NORTH_WALK = [new SheetPosition(0, 32),
    new SheetPosition(24, 32),
    new SheetPosition(48, 32),
    new SheetPosition(72, 32),
    new SheetPosition(96, 32),
    new SheetPosition(120, 32),
    new SheetPosition(144, 32),
    new SheetPosition(168, 32)
];

const WEST_WALK = [new SheetPosition(0, 64),
    new SheetPosition(24, 64),
    new SheetPosition(48, 64),
    new SheetPosition(72, 64),
    new SheetPosition(96, 64),
    new SheetPosition(120, 64),
    new SheetPosition(144, 64),
    new SheetPosition(168, 64)
];

const SOUTH_WALK = [new SheetPosition(0, 0),
    new SheetPosition(24, 0),
    new SheetPosition(48, 0),
    new SheetPosition(72, 0),
    new SheetPosition(96, 0),
    new SheetPosition(120, 0),
    new SheetPosition(144, 0),
    new SheetPosition(168, 0)
];

const EAST_DODGE = [new SheetPosition(0, 96),
    new SheetPosition(0, 0),
    new SheetPosition(0, 64),
    new SheetPosition(0, 32)
];

const NORTH_DODGE = [new SheetPosition(0, 32),
    new SheetPosition(0, 96),
    new SheetPosition(0, 0),
    new SheetPosition(0, 64)
];

const WEST_DODGE = [new SheetPosition(0, 64),
    new SheetPosition(0, 96),
    new SheetPosition(0, 32),
    new SheetPosition(0, 0)
];

const SOUTH_DODGE = [new SheetPosition(0, 0),
    new SheetPosition(0, 64),
    new SheetPosition(0, 32),
    new SheetPosition(0, 96)
];

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

function PlayerState(initDirection, ty) {
    this.moveState = initDirection;
    this.moveType = ty;
}

function SheetPosition(x, y) {
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 32;
}

function MoveStyleRenders(normal, sprinting, dodging) {
    this.NORMAL = normal;
    this.SPRINTING = sprinting;
    this.DODGING = dodging;
}

/**
 * @constructor Player
 * Creates a player
 * @param {Position} starting location of the player;
 */
function Player(position) {
	this.position = position;
	this.velocity = {x: 0, y: 0};
	this.state = new PlayerState('STILL', 'NORMAL');
	this.renderSource = new Image();
	this.renderSource.src = 'assets/rpg_sprite_walk.png';
  this.width = 24;
  this.height = 32;
  this.radius = PLAYER_RADIUS;
	this.timer = 0;
    this.dodgeTimer = 0;
	this.renderPosition = 0;
	this.renderSources =
		{'STILL':
			new MoveStyleRenders(
				[new SheetPosition(0, 0)],
				[new SheetPosition(0, 0)],
			  SOUTH_DODGE
			),
		 'EAST':
			new MoveStyleRenders(
				EAST_WALK,
				EAST_WALK,
				EAST_DODGE
		 ),
		 'NORTH':
			new MoveStyleRenders(
				NORTH_WALK,
				NORTH_WALK,
				NORTH_DODGE
		 ),
		 'SOUTH':
		  new MoveStyleRenders(
			  SOUTH_WALK,
				SOUTH_WALK,
				SOUTH_DODGE
			),
		 'WEST':
			new MoveStyleRenders(
				WEST_WALK,
				WEST_WALK,
				WEST_DODGE
			),
		 'NORTHWEST':
		  new MoveStyleRenders(
			  WEST_WALK,
			  WEST_WALK,
			  WEST_DODGE
		 ),
		 'NORTHEAST':
		  new MoveStyleRenders(
			  EAST_WALK,
			  EAST_WALK,
			  EAST_DODGE
		),
		 'SOUTHWEST':
		  new MoveStyleRenders(
			  WEST_WALK,
			  WEST_WALK,
			  WEST_DODGE
		 ),
		 'SOUTHEAST':
		  new MoveStyleRenders(
			  EAST_WALK,
			  EAST_WALK,
			  EAST_DODGE
		),
	};
  this.currentRender = this.renderSources[this.state.moveState][this.state.moveType][this.renderPosition];
  this.health = 6;
  this.stamina = 100;
  // COLLISIONS
  this.shape = PLAYER_SHAPE;
  this.tag = "player";
  this.points = [
	{
	  // TOP LEFT CORNER
	  x: this.position.x,
	  y: this.position.y
	},
	{
	  // TOP RIGHT CORNER
	  x: this.position.x + this.width,
	  y: this.position.y
	},
	{
	  // BOTTOM LEFT CORNER
	  x: this.position.x,
	  y: this.position.y + this.height
	},
	{
	  // BOTTOM RIGHT CORNER
	  x: this.position.x + this.width,
	  y: this.position.y + this.height
	}
  ];

  //this.gui = new Gui(this);
}

Player.prototype.walk = function() {
    if (this.dodgeTimer > 0 && this.dodgeTimer < DODGE_END) return;
    this.state.moveType = 'NORMAL';
}

Player.prototype.sprint = function() {
    if (this.state.moveType == 'DODGING') return;
    this.state.moveType = 'SPRINTING';
}

Player.prototype.dodge = function() {
    if (DODGE_END < this.dodgeTimer && this.dodgeTimer < DODGE_DELAY) {
        this.walk();
    } else {
        this.state.moveType = 'DODGING';
    }
}

Player.prototype.moveWest = function() {
    this.state.moveState = 'WEST';
}

Player.prototype.moveEast = function() {
    this.state.moveState = 'EAST';
}

Player.prototype.moveNorth = function() {
    this.state.moveState = 'NORTH';
}

Player.prototype.moveSouth = function() {
    this.state.moveState = 'SOUTH';
}

Player.prototype.moveNorthEast = function() {
    this.state.moveState = 'NORTHEAST';
}

Player.prototype.moveNorthWest = function() {
    this.state.moveState = 'NORTHWEST';
}

Player.prototype.moveSouthEast = function() {
    this.state.moveState = 'SOUTHEAST';
}

Player.prototype.moveSouthWest = function() {
    this.state.moveState = 'SOUTHWEST';
}

Player.prototype.still = function() {
    this.state.moveState = 'STILL';
}

Player.prototype.damage = function() {
    this.health--;
	if(this.health == 0) {
		// gameover
	}
	else {
		//this.gui.damage();
	}
}

Player.prototype.getHealth = function() {
    return this.health;
}

// Handle Collisions
Player.prototype.onCollision = function(entity) {
	switch(entity.tag) {
		case "player":
		case "":
		case "asdf":
		case "boss":
			this.damage();
      console.log("ahh real monsters!");
			break;
		case "boss2":
			this.damage();
			break;
		case "spear":
			break;
		case "pillar":
			break;
		case "crate":
			break;
		case "boulder":
			break;
    case "spike":
      break;
		case "switch":  // Check name of tag with boss group.
			break;
		default:
			console.log("Invalid.");
			break;
		}
	}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime) {
    this.checkMoveState();

    // set the velocity
    this.velocity.x = 0;
    this.velocity.y = 0;

    var updateSpeed = PLAYER_SPEED;

    if (this.state.moveType == 'DODGING') {
        updateSpeed = DODGE_SPEED;
        this.dodgeTimer += elapsedTime;
    } else if (this.state.moveType == 'SPRINTING') {
        if (this.stamina >= STAMINA_DECAY) {
          updateSpeed = SPRINT_SPEED;
          this.stamina -= STAMINA_DECAY;
        } else {
          this.walk();
        }
    } else if (this.stamina < 100) {
      this.stamina += STAMINA_RECHARGE;
    }

    switch (this.state.moveState) {
        case 'NORTH':
            this.velocity.y -= updateSpeed;
            break;
        case 'EAST':
            this.velocity.x += updateSpeed;
            break;
        case 'SOUTH':
            this.velocity.y += updateSpeed;
            break;
        case 'WEST':
            this.velocity.x -= updateSpeed;
            break;
        case 'NORTHEAST':
            this.velocity.x += updateSpeed;
            this.velocity.y -= updateSpeed;
            break;
        case 'NORTHWEST':
            this.velocity.x -= updateSpeed;
            this.velocity.y -= updateSpeed;
            break;
        case 'SOUTHEAST':
            this.velocity.x += updateSpeed;
            this.velocity.y += updateSpeed;
            break;
        case 'SOUTHWEST':
            this.velocity.x -= updateSpeed;
            this.velocity.y += updateSpeed;
            break;
    }

    // move the player
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.timer += elapsedTime;

    if (this.dodgeTimer > DODGE_END) {
        this.walk();
        this.dodgeTimer += elapsedTime;
    }

    if (this.dodgeTimer > DODGE_DELAY) {
        this.dodgeTimer = 0;
    }

    if (this.state.moveType == 'DODGING') {

    }

    if (this.timer > RENDER_TIMER) {
        this.renderPosition++;
        this.timer = 0;
    }

    var nextRender = this.renderSources[this.state.moveState][this.state.moveType][this.renderPosition];

    if (nextRender == undefined) {
        this.renderPosition = 0;
        nextRender = this.renderSources[this.state.moveState][this.state.moveType][this.renderPosition];
    } else {
        this.currentRender = nextRender;
    }

	//this.gui.update(elapsedTime);
}

/**
 * @function render
 * Renders the player in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapsedTime, ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);

    //Select rendersheet based on time passed since starting this state.
    ctx.drawImage(
        this.renderSource,
        this.currentRender.x, this.currentRender.y, this.currentRender.width, this.currentRender.height,
        0, 0, this.width, this.height);
    ctx.restore();

	//this.gui.render(elapsedTime, ctx);
}


Player.prototype.checkMoveState = function() {

	this.walk();

	if(input.shift) {
		this.sprint();
	}
	else if(input.space) {
		this.dodge();
	}

	if(input.up) {
		if(input.right) {
			this.moveNorthEast();
		}
		else if (input.left) {
			this.moveNorthWest();
		}
		else if (input.down) {
			this.still();
		}
		else {
			this.moveNorth();
		}
		return;
	}
	else if(input.right) {
		if(input.left) {
			this.still();
		}
		else if (input.down) {
			this.moveSouthEast();
		}
		else {
			this.moveEast();
		}
		return;
	}
	else if(input.down) {
		if(input.left) {
			this.moveSouthWest();
		}
		else {
			this.moveSouth();
		}
		return;
	}
	else if(input.left) {
		this.moveWest();
		return;
	}
	else {
		this.still();
		return;
	}
}
