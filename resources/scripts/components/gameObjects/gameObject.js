export default class GameObject {
    constructor(serial, type, display, sprite, x, y, colWidth, colHeight){
        this.serial = serial;
        this.type = type;
        this.display = display;
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.colWidth = colWidth;
        this.colHeight = colHeight;
    }
    *[Symbol.iterator](){
        yield this.sprite.source;
        yield this.sprite.sX;
        yield this.sprite.sY;
        yield this.sprite.sWidth;
        yield this.sprite.sHeight;
        yield this.x;
        yield this.y;
        yield this.sprite.sWidth;
        yield this.sprite.sHeight;
    }
}