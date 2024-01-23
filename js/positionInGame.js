function InGamePosition(setting, level){
    this.setting = setting;
    this.level = level;
    this.object = null;
    this.spaceship = null;
    this.bullets = [];
    this.lastBulletTime = null;
    this.ufos = [];
    this.bombs = [];
}

InGamePosition.prototype.update = function (play) {

    const spaceship = this.spaceship;
    const spaceshipSpeed = this.spaceshipSpeed;
    const upSec = this.setting.updateSeconds;
    const bullets = this.bullets;

    if(play.pressedKeys[37]){
     spaceship.x -= spaceshipSpeed * upSec;
    }
    if(play.pressedKeys[39]){
        spaceship.x += spaceshipSpeed * upSec;
    }

    if(play.pressedKeys[32]){
        this.shoot();
    }

    if(this.spaceship.x < play.playBoundaries.left){
        spaceship.x = play.playBoundaries.left;
    }
    if(this.spaceship.x > play.playBoundaries.right){
        spaceship.x = play.playBoundaries.right;
    }

    for(let i = 0; i < bullets.length; i++){
        let bullet = bullets[i];
        bullet.y -= upSec * this.setting.bulletSpeed;
        if(bullet.y < 0){
            bullets.splice(i--, 1);
        }
    }

    let reachedSide = false;

    for(let i = 0; i < this.ufos.length; i++){
        let ufo = this.ufos[i];
        let fresh_x = ufo.x + this.ufoSpeed * upSec * this.turnAround * this.horizontalMoving;
        let fresh_y = ufo.y + this.ufoSpeed * upSec * this.verticalMoving;

        if(fresh_x > play.playBoundaries.right || fresh_x < play.playBoundaries.left){
            this.turnAround *= -1;
            reachedSide = true;
            this.horizontalMoving = 0;
            this.verticalMoving = 1;
            this.ufoAreSinking = true;
        }

        if (reachedSide !== true){
            ufo.x = fresh_x;
            ufo.y = fresh_y;
        }

        if(this.ufoAreSinking === true){
            this.ufoPresentSinkingValue += this.ufoSpeed * upSec;
            if(this.ufoPresentSinkingValue >= this.setting.ufoSinkingValue){
                this.ufoAreSinking = false;
                this.verticalMoving = 0;
                this.horizontalMoving = 1;
                this.ufoPresentSinkingValue = 0;
            }
        }
        const frontLineUFOs = [];
        for(let i = 0; i < this.ufos.length; i++){
            let ufo = this.ufos[i];
            if(!frontLineUFOs[ufo.column] || frontLineUFOs[ufo.column].line < ufo.line){
                frontLineUFOs[ufo.column] = ufo;
            }
        }
        for(let i = 0; i < this.setting.ufoColumns; i++){
            let ufo = frontLineUFOs[i];
            if(!ufo) continue;
            let chance = this.bombFrequency * upSec;
            this.object = new Objects();
            if(chance > Math.random()){
                this.bombs.push(this.object.bomb(ufo.x, ufo.y + ufo.height / 2));
            }
        }

        for(let i = 0; i < this.bombs.length; i++){
            let bomb = this.bombs[i];
            bomb.y += upSec * this.bombSpeed;
            if(bomb.y > this.height){
                this.bombs.splice(i--, 1);
            }
        }

        for(let i = 0; i < this.ufos.length; i++){
            let ufo = this.ufos[i];
            let collision = false;
            for (let j = 0; j < bullets.length; j++){
                let bullet = bullets[j];
                if(bullet.x >= (ufo.x - ufo.width / 2) && bullet.x <= (ufo.x + ufo.width / 2) &&
                    bullet.y >= (ufo.y - ufo.height / 2) && bullet.y <= (ufo.y + ufo.height / 2)){
                    bullets.splice(j--, 1);
                    collision = true;
                }
            }
            if(collision === true){
                this.ufos.splice(i--, 1);
            }
        }

        for(let i = 0; i < this.bombs.length; i++){
            let bomb = this.bombs[i];
            if(bomb.x + 2 >= (spaceship.x - spaceship.width / 2) &&
                bomb.x - 2 <= (spaceship.x + spaceship.width / 2) &&
                bomb.y + 6 >= (spaceship.y - spaceship.height / 2) &&
                bomb.y <= (spaceship.y + spaceship.height / 2)){
                this.bombs.splice(i--, 1);
                play.goToPosition(new OpeningPosition());
            }
        }

        for(let i = 0; i < this.ufos.length; i++){
            let ufo = this.ufos[i];
            if((ufo.x + ufo.width / 2) > (spaceship.x - spaceship.width / 2) &&
                (ufo.x - ufo.width / 2) < (spaceship.x + spaceship.width / 2) &&
                (ufo.x + ufo.height / 2) > (spaceship.y - spaceship.height / 2) &&
                (ufo.x - ufo.height / 2) > (spaceship.y + spaceship.height / 2)){
                play.goToPosition(new OpeningPosition());
            }
        }
    }
}

InGamePosition.prototype.shoot = function () {
    if(this.lastBulletTime === null || ((new Date()).getTime()- this.lastBulletTime) > (this.setting.bulletMaxFrequency)){
        this.object = new Objects();
        this.bullets.push(this.object.bullet(this.spaceship.x, this.spaceship.y -this.spaceship.height / 2, this.setting.bulletSpeed));
        this.lastBulletTime = (new Date()).getTime();
    }
}

InGamePosition.prototype.entry = function (play) {
    this.horizontalMoving = 1;
    this.verticalMoving = 0;
    this.ufoAreSinking = false;
    this.ufoPresentSinkingValue = 0;
    this.turnAround = 1;
    this.upSec = this.setting.updateSeconds;
    this.spaceshipSpeed = this.setting.spaceshipSpeed;
    this.spaceship_img = new Image();
    this.ufo_img = new Image();
    this.object = new Objects();
    this.spaceship = this.object.spaceship((play.width/2), play.playBoundaries.bottom, this.spaceship_img);

    let presentLevel = this.level;
    this.ufoSpeed = this.setting.ufoSpeed + (presentLevel * 7);

    this.bombSpeed = this.setting.bombSpeed + (presentLevel * 0.00001);
    this.bombFrequency = this.setting.bombFrequency + (presentLevel * 0.005);

    const lines = this.setting.ufoLines;
    const columns = this.setting.ufoColumns;
    const ufosInitial = [];

    let line, column;

    for(line = 0; line < lines; line++){
        for(column = 0; column < columns; column++) {
            this.object = new Objects();
            let x, y;
            x = (play.width / 2) + (column * 50) - ((columns -1) * 25);
            y = (play.playBoundaries.top + 30) +(line * 30);
            ufosInitial.push(this.object.ufo(
                x,
                y,
                line,
                column,
                this.ufo_img
            ));
        }
    }
    this.ufos = ufosInitial;

}

InGamePosition.prototype.keyDown = function (play, keyboardCode) {

}

InGamePosition.prototype.draw = function (play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.drawImage(this.spaceship_img, this.spaceship.x - (this.spaceship.width/2), this.spaceship.y - (this.spaceship.height/2));

    ctx.fillStyle = '#ff0000';
    for (let i = 0; i < this.bullets .length; i++) {
        const bullet = this.bullets[i];
        ctx.fillRect(bullet.x-1, bullet.y-6, 2, 6);
    }

    for(let i = 0; i < this.ufos.length; i++){
        const ufo = this.ufos[i];
        ctx.drawImage(ufo.ufo_img, ufo.x - (ufo.width/2), ufo.y - (ufo.height/2));
    }

    ctx.fillStyle = '#FE2EF7';
    for(let i = 0; i < this.bombs.length; i++){
        const bomb = this.bombs[i];
        ctx.fillRect(bomb.x, bomb.y, 4, 10);
    }

}