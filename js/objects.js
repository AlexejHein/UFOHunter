function Objects(){

}

Objects.prototype.spaceship = function (x, y, spaceship_img){
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 28;
    this.spaceship_img = spaceship_img;
    this.spaceship_img.src = 'img/ship.png';
    return this;
};

Objects.prototype.bullet = function (x, y){
    this.x = x;
    this.y = y;
    this.width = 6;
    this.height = 14;
    return this;
};