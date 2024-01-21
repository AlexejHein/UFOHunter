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