import GameObject from "./gameObject.js";

export default class Moveable extends GameObject {
    constructor(serial, type, display, sprite, x, y, colWidth, colHeight){
        super(serial, type, display, sprite, x, y, colWidth, colHeight);
    }
    move(distance, direction){
        if(direction === "up"){
            this.y = this.y - distance;
        }
        if(direction === "down"){
            this.y = this.y + distance;
        }
        if(direction === "left"){
            this.x = this.x - distance;
        }
        if(direction === "right"){
            this.x = this.x + distance;
        }
    }
    gotoLocation(x, y){
        this.x = x;
        this.y = y;
    }
}