// variable to configure the position on the board,the speed multiplier for the random part, the number of column,
// row and enemy

var colWidth = 101;
var rowHeight = 83;
var padding = 30;
var speedMultiplier = 200;
var enemyNumArray = ["enemy",4,6,8];
var enemyRowsArray = ["row of enemy",3,4,5];
var colNumArray = ["column",5,7,9];
var optionArray = [enemyNumArray, enemyRowsArray, colNumArray];
var enemyRows = 3;
var colNum = 5;
var enemyNum = 4;
var selectedOption = [enemyNum, enemyRows, colNum];
var score = 0;
var charArray = ['images/char-boy.png',
                'images/char-cat-girl.png',
                'images/char-horn-girl.png',
                'images/char-pink-girl.png'];
var selectedChar = 'images/char-boy.png';
// Just to make the code a bit clearer, build the option of one line
var optionRender = function (array, index) {
    ctx.textAlign = "left";
    ctx.fillText("Number of " + array[0] + ":", 0, colWidth * (2 * index + 1) - 50);
    for (i = 1; i < array.length ; i++) {
        ctx.fillText('' + array[i], 2 * (i - 1) * colWidth + 50, colWidth * (1 + index * 2) -10);
        ctx.fillRect(2 * (i - 1) * colWidth, (2 * index + 1) * colWidth, colWidth, colWidth);
        // Red square for the option selected
        if (array[i] == selectedOption[index]) {
            ctx.save();
            ctx.fillStyle = "red";
            ctx.fillRect(2 * (i - 1) * colWidth + 10, (2 * index + 1) * colWidth + 10, colWidth - 20, colWidth -20);
            ctx.restore();
            }
    }
};


var Menu = function() {
    this.isUp = true;
    this.optionUp = true;
    this.gameRun = false;
    this.input = 3;
    this.inputX = 0;
    this.inputY = 0;
};

// To reinitialise every entities when the game start, applying change
Menu.prototype.initGame = function () {
    player.initPosition();
    boss.initPosition();
    blue.initPosition();
    orange.initPosition();
    green.initPosition();
    star.initPosition();
}
Menu.prototype.render = function() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    //Render the option
    if (this.optionUp) {
        ctx.clearRect (0, 0, colNum * colWidth, (enemyRows + 5) * colWidth);
        for (index = 0; index < optionArray.length; index ++) {
            optionRender(optionArray[index], index);
        }
        ctx.fillRect(3 * colWidth, 7 * colWidth, 2 * colWidth, colWidth);
        ctx.save();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "red";
        ctx.lineWidth = 8;
        ctx.textAlign = "center";
        ctx.fillText("Next", 4 * colWidth , 7 * colWidth + 50);
        if (this.inputY != 3) {
            ctx.strokeRect(this.inputX * 2 * colWidth, (2 * this.inputY + 1) * colWidth, colWidth, colWidth);
        }
        if (this.inputY == 3) {
            ctx.strokeRect(3 * colWidth, 7 * colWidth, 2 * colWidth, colWidth);
        }
        ctx.restore();
    }
    //Render selection of character
    if (!this.optionUp) {
        ctx.clearRect (0, 0, colNum * colWidth, (enemyRows + 5) * colWidth);
        ctx.save();
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Select your Character", colWidth * 5 / 2, colWidth);
        ctx.drawImage(Resources.get('images/Selector.png'), colWidth * 2 , colWidth * 2);
        for (i = 0; i < charArray.length; i++) {
            ctx.drawImage(Resources.get(charArray[i]), colWidth * (i + this.input - 1), colWidth * 2);
        }
        ctx.fillRect(3 * colWidth, 7 * colWidth, 2 * colWidth, colWidth);
        ctx.fillStyle = "black";
        ctx.fillText("Next", 4 * colWidth , 7 * colWidth + 50);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 8;
        if (this.inputY == 1) {
            ctx.strokeRect(3 * colWidth, 7 * colWidth, 2 * colWidth, colWidth);
        }
        ctx.restore();

    }
};

Menu.prototype.handleInput = function(key) {
    //menu option input
    if (this.optionUp) {
        if (key == "left" && this.inputX !== 0) {
            this.inputX -= 1;
        }
        if (key == "right" && this.inputX != 2) {
            this.inputX += 1;
        }
        if (key == "up" && this.inputY !== 0) {
            this.inputY -= 1;
        }
        if (key == "down" && this.inputY != 3) {
            this.inputY += 1;
        }
        if (key == "enter") {
            if (this.inputY === 0) {
                enemyNum = enemyNumArray[this.inputX + 1];
                selectedOption[0] = enemyNum;
            }
            if (this.inputY == 1) {
                enemyRows = enemyRowsArray[this.inputX +1];
                selectedOption[1] = enemyRows;
            }
            if (this.inputY == 2) {
                colNum = colNumArray[this.inputX + 1];
                selectedOption[2] = colNum;
            }
            if (this.inputY == 3) {
                this.optionUp = false;
                this.inputY = 0;
            }
        }
    }
    // menu select character input
    if (!this.optionUp) {
        if (key == "left" && this.input != 3) {
            this.input += 1;
        }
        if (key == "right" && this.input !== 0) {
            this.input -= 1;
        }
        if (key == "up" && this.inputY !== 0) {
            this.inputY -= 1;
        }
        if (key == "down" && this.inputY != 1) {
            this.inputY += 1
        }
        if (this.inputY == 1) {
            if (key == "enter") {
                selectedChar = charArray[3 - this.input];
                this.isUp = false;
                ctx.clearRect (0, 0, colNum * colWidth, (enemyRows + 5) * colWidth);
                this.initGame();
            }
        }
    }
};
var menu = new Menu();

// Enemies our player must avoid

var Enemy = function() {
    this.initPosition();
    this.sprite = 'images/enemy-bug.png';
};
//Initialise and randomize the position and speed of an enemy
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
// movement X
    if (this.positionX <= colNum * colWidth) {
        this.positionX += this.speed * dt;
    }
// reinitialisation of enemy once out of the board
    if (this.positionX > colNum * colWidth) {
        this.initPosition();
    }
//Anti collision/overlaps between enemies
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
// Add enemy during a game
    if (!player.bossFight) {
        if (allEnemies.length < enemyNum) {
            for (i = allEnemies.length; i < enemyNum; i++) {
                allEnemies.push(new Enemy);
            }
        }
    }
// Remove enemy during a game
    if (!player.bossFight) {
        if (allEnemies.length > enemyNum) {
            allEnemies.splice(Enemy, (allEnemies.length - enemyNum));
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};
// When all gems are gathered the boss appear and shoot one star toward the player
var EnemyBoss = function() {
    this.initPosition();
    this.positionY = rowHeight - padding;
    this.speed = speedMultiplier;
    this.sprite = 'images/char-princess-girl.png';
};
EnemyBoss.prototype.initPosition = function() {
    this.positionX = Math.floor(colNum / 2) * colWidth;
};

EnemyBoss.prototype.update = function(dt) {
    // To follow the player positionX
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
// Projectile used by the boss
var EnemyStar = function() {
    this.initPosition();
    this.speed = speedMultiplier;
    this.sprite = 'images/Star.png';
};
EnemyStar.prototype.initPosition = function() {
    this.positionX = boss.positionX;
    this.positionY = rowHeight - padding;
};
EnemyStar.prototype.update = function(dt) {
    if (this.positionY < (enemyRows + 3) * rowHeight - padding) {
        this.positionY += this.speed * dt;
    }
    if (this.positionY >= (enemyRows + 3) * rowHeight - padding) {
        this.initPosition();
    }
    // collision on x and y
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
// Gem to grab to improve score
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
// Initialise position given color, and bring the boolean notCollected to not allow the player to get extra score
// by passing multiple time at the gem position
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
//To avoid overlapping of gems
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
    this.sprite = selectedChar;
    this.heartSprite = 'images/Heart.png'
};
// Initialise gems
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
// Initialise life and gems, and check if boss is up to reinitialise it
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
    //Start on column of the middle and before last row
    this.positionX = Math.floor(colNum / 2) * colWidth;
    this.positionY = (enemyRows + 3) * rowHeight - padding;
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
        // During boss fight, win only occur if the player goes on the boss
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
// enemy collision, the +50 and -50 is for the actual size of enemy (101) so that there is collision based on the
// appearance rather than the position
    for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].positionY == this.positionY && allEnemies[i] != boss) {
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
        //Reinitialise the position of the boss
        boss.initPosition();
        star.initPosition();
        allEnemies.push(boss);
        allEnemies.push(star);

    }
// Lose
    if (this.life == -1) {
        this.initLife();
        score = 0;
    }
};
//Draw the player in the game, the number of life and score
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(selectedChar), this.positionX, this.positionY);
    for (i = 1; i <= this.life; i++) {
        ctx.drawImage(Resources.get(this.heartSprite), (colNum - i) * colWidth, (enemyRows + 4) * rowHeight);
    }
    ctx.font = "50px Arial"
    ctx.fillText("" + score, 0, (enemyRows + 4) * rowHeight + 101);
};
//Handle the input of the keyboard to move the player
Player.prototype.handleInput = function(key) {
    if (key == 'up') {
        this.positionY -= rowHeight;
    }
    if (key == 'down' && this.positionY != (enemyRows + 3) * rowHeight - padding) {
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
var boss = new EnemyBoss();
var star = new EnemyStar();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    // to make sure nothing is changed before the game start
    if (!menu.isUp) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
    // to make sure nothing is changed after the game start
    if (menu.isUp) {
        menu.handleInput(allowedKeys[e.keyCode]);
    }
});
