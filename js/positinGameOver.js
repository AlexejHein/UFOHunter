function InGamePosition(settings, level){
    this.settings = settings;
    this.level = level;
    this.object = null;
    this.spaceship = null;
}

InGamePosition.prototype.update = function (play) {

}

InGamePosition.prototype.entry = function (play) {
    this.spaceship_img = new Image();
    this.object = new Objects();
    this.spaceship = this.object.spaceship((play.width/2), play.playBoundaries.bottom, this.spaceship_img);
}

InGamePosition.prototype.keyDown = function (play) {

}

InGamePosition.prototype.draw = function (play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.drawImage(this.spaceship_img, this.spaceship.x - (this.spaceship.width/2), this.spaceship.y - (this.spaceship.height/2));
}