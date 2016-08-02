// variable to configure the position on the board,the speed multiplier for the random part, the number of column,
// row and enemy

var colWidth = 101;
var rowHeight = 83;
var padding = 30;
var speedMultiplier = 200;
var enemyRows = 3;
var playerRow = enemyRows + 3;
var colNum = 7;
var enemyNum = 4;
var score = 0;



// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.initPosition();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};
Enemy.prototype.initPosition = function() {
    this.positionX = - colWidth;
    this.positionY = rowHeight * (Math.floor(Math.random() * enemyRows) + 2) - padding;
    this.speed = 100 + Math.random() * speedMultiplier;
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
// movement
    if (this.positionX <= colNum * colWidth) {
        this.positionX += this.speed * dt;
    }
// reinitialisation of enemy once out of the board
    if (this.positionX > colNum * colWidth) {
        this.initPosition();
    }
//Anti collision between enemies
    for (var i = 0; i < allEnemies.length; i++) {
        if (i != allEnemies.indexOf(this)){
            if (allEnemies[i].positionY == this.positionY) {
                if (this.positionX >= allEnemies[i].positionX - colWidth && this.positionX <= allEnemies[i].positionX) {
                    this.speed = allEnemies[i].speed;
                    this.positionX -= this.speed * dt;
                }
            }
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};
// When all gems are gathered the boss appear and shoot one star toward the player
var EnemyBoss = function() {
    this.positionX = Math.floor(colNum / 2) * colWidth;
    this.positionY = rowHeight - padding;
    this.speed = speedMultiplier;
    this.sprite = 'images/char-princess-girl.png'
};

EnemyBoss.prototype.update = function(dt) {
    if (this.positionX < player.positionX) {
        this.positionX += this.speed * dt;
    }
    if (this.positionX > player.positionX) {
        this.positionX -= this.speed * dt;
    }
};

EnemyBoss.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};
var boss = new EnemyBoss();
// Projectile used by the boss
var EnemyStar = function() {
    this.initPosition();
    this.speed = 400;
    this.sprite = 'images/Star.png';
};
EnemyStar.prototype.initPosition = function() {
    this.positionX = boss.positionX;
    this.positionY = rowHeight - padding;
};
EnemyStar.prototype.update = function(dt) {
    if (this.positionY < playerRow * rowHeight - padding) {
        this.positionY += this.speed * dt;
    }
    if (this.positionY >= playerRow * rowHeight - padding) {
        this.initPosition();
    }
    if (this.positionX <= player.positionX + 50 && this.positionX >= player.positionX - 50) {
        if (this.positionY <= player.positionY + 50 && this.positionY >= player.positionY - 50) {
            this.initPosition();
            player.initPosition();
            player.life -= 1;
        }
    }
};
EnemyStar.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};
var star = new EnemyStar()
// Gem to grab to win
var Gem = function(color) {
    this.positionY = rowHeight - padding;
    if (color == "blue") {
        this.color = "blue";
        this.point = 300;
        this.sprite = 'images/Gem Blue.png';
    }
    if (color == "orange") {
        this.color = "orange"
        this.point = 400;
        this.sprite = 'images/Gem Orange.png';
    }
    if (color == "green") {
        this.color = "green";
        this.point = 200;
        this.sprite = 'images/Gem Green.png';
    }
};

Gem.prototype.initPosition = function(color) {
    if (this.color == "blue") {
        this.positionX = Math.floor((Math.random() + 1) * (colNum / 3)) * colWidth;
        this.notCollected = true;
    }
    if (this.color == "orange") {
        this.positionX = Math.floor(Math.random() * (colNum / 3)) * colWidth;
        this.notCollected = true;
    }
    if (this.color == "green") {
        this.positionX = Math.floor((Math.random() + 2) * (colNum / 3)) * colWidth;
        this.notCollected = true;
    }
};

Gem.prototype.update = function() {
//
    if (gemArray != []) {
        for (var i = 0; i < gemArray.length; i++) {
            if (i != gemArray.indexOf(this)){
                if (gemArray[i].positionX == this.positionX) {
                        this.initPosition();
                }
            }
        }
    }
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.initPosition();
    this.initLife();
    this.bossFight = false;
    this.sprite = 'images/char-boy.png';
    this.heartSprite = 'images/Heart.png'
};

Player.prototype.initGems = function() {
    gemArray = [];
    blue.initPosition();
    orange.initPosition();
    green.initPosition();
    gemArray.push(blue);
    gemArray.push(orange);
    gemArray.push(green);
    this.gemCount = 0;
};

Player.prototype.initLife = function() {
    this.life = 3;
    this.initGems();
    if (this.bossFight) {
        allEnemies.splice(allEnemies.indexOf(boss),1);
        allEnemies.splice(allEnemies.indexOf(star),1);
        this.bossFight = false;
    }

};

Player.prototype.initPosition = function() {
    //Start on column of the middle and last row
    this.positionX = Math.floor(colNum / 2) * colWidth;
    this.positionY = playerRow * rowHeight - padding;
};

Player.prototype.update = function() {
// win condition
    if (this.positionY < 2 * rowHeight - padding ) {
        if (this.positionX == blue.positionX && blue.notCollected) {
            this.initPosition();
            score += blue.point;
            gemArray.splice(gemArray.indexOf(blue), 1);
            blue.notCollected = false;
            this.gemCount += 1;
        }
        if (this.positionX == orange.positionX && orange.notCollected) {
            this.initPosition();
            score += orange.point;
            gemArray.splice(gemArray.indexOf(orange), 1);
            orange.notCollected = false;
            this.gemCount += 1;
        }
        if (this.positionX == green.positionX && green.notCollected) {
            this.initPosition();
            score += green.point;
            gemArray.splice(gemArray.indexOf(green), 1);
            green.notCollected = false;
            this.gemCount += 1;
        }
        if (this.bossFight) {
            if (this.positionX <= boss.positionX + 50 && this.positionX >= boss.positionX - 50) {
                this.initPosition();
                score += 500;
                allEnemies.splice(allEnemies.indexOf(boss),1);
                allEnemies.splice(allEnemies.indexOf(star),1);
                this.initGems();
                this.bossFight = false;
                if (this.life < 4) {
                    this.life += 1;
                }
            }
        }
        this.initPosition();

    }
// enemy collision
    for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].positionY == this.positionY) {
            if (this.positionX <= allEnemies[i].positionX + 50 && this.positionX >= allEnemies[i].positionX - 50) {
                this.initPosition();
                this.life -= 1;
            }
        }
    }
// Boss appearance
    if (this.gemCount == 3) {
        this.bossFight = true;
        this.gemCount = 0;
        allEnemies.push(boss);
        allEnemies.push(star);

    }
// Lose
    if (this.life == -1) {
        this.initLife();
        score = 0;
    }
};
//Draw the player in the game and the number of life
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
    for (i = 1; i <= this.life; i++) {
        ctx.drawImage(Resources.get(this.heartSprite), (colNum - i) * colWidth, (playerRow + 1) * rowHeight);
    }
    ctx.font = "50px Arial"
    ctx.fillText("" + score, 0, (playerRow +1) * rowHeight + 101);
};
//Handle the input of the keyboard to move the player
Player.prototype.handleInput = function(key) {
    if (key == 'up') {
        this.positionY -= rowHeight;
    }
    if (key == 'down' && this.positionY != playerRow * rowHeight - padding) {
        this.positionY += rowHeight;
    }
    if (key == 'left' && this.positionX !== 0) {
        this.positionX -= colWidth;
    }
    if (key == 'right' && this.positionX != (colNum - 1) * colWidth) {
        this.positionX += colWidth;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var blue = new Gem("blue");
var orange = new Gem("orange");
var green = new Gem("green");
var gemArray = new Array();
var player = new Player();
var allEnemies = new Array();
for (i = 1; i <= enemyNum; i++) {
    allEnemies.push(new Enemy());
}




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
