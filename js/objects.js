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

Objects.prototype.ufo = function (x, y, line, column, ufo_img){
    this.x = x;
    this.y = y;
    this.line = line;
    this.column = column;
    this.width = 32;
    this.height = 24;
    this.ufo_img = ufo_img;
    this.ufo_img.src = "img/ufo.png";
    return this;
};