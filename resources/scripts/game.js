import EventEmitter from './components/events/eventEmitter.js';
import Sprite from './components/animations/sprite.js';
import Moveable from './components/gameObjects/moveable.js';
import collisionCheck from './components/events/collisionCheck.js';
import GameObject from './components/gameObjects/gameObject.js';

const events = new EventEmitter();
const messages = {
    MOVE_LEFT: "MOVE_LEFT",
    MOVE_RIGHT: "MOVE_RIGHT",
    JUMP: "JUMP",
    INTERACT: "INTERACT",
    HITGROUND: "HITGROUND",
    GUY: "GUY",
    GUYOFF: "GUYOFF",
};
const imgLoad = (src) => //promise for each individual image from imageURLs
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
});
const imageUrls = [
    './resources/images/phoebe.png',//0
    './resources/images/crystal.png',//1
    './resources/images/guy.png',//2
    './resources/images/door_closed.png',//3
    './resources/images/door_open.png',//4
    './resources/images/floorTile.png'//5
];
class Player extends Moveable {
    constructor(serial, type, display, sprite, x, y, colWidth, colHeight){
        super(serial, type, display, sprite, x, y, colWidth, colHeight);
        this.speed = 5;
        this.yVelocity = 0;
        this.gravity = 2;
        this.jumping = false;

        events.on(messages.MOVE_LEFT, ()=>{
            this.move(this.speed, "left");
        });
        events.on(messages.MOVE_RIGHT, ()=>{
            this.move(this.speed, "right");
        });
        events.on(messages.JUMP, ()=>{
            if(!this.jumping) this.yVelocity = -27;
            this.jumping = true;
        });
        events.on(messages.INTERACT, ()=>{
            this.move(this.speed, "down");
        });
        events.on(messages.HITGROUND, ()=>{
            this.yVelocity = -2;
            this.jumping = false;
        });
    }
}
class Enemy extends Moveable {
    constructor(serial, type, display, sprite, x, y, colWidth, colHeight){
        super(serial, type, display, sprite, x, y, colWidth, colHeight);
        this.direction = "right";
        this.distanceTraveled = 0;
        this.speed = 2;
    }
}
class Door extends GameObject {
    constructor(serial, type, display, openSprite, closeSprite, x, y, colWidth, colHeight){
        super(serial, type, display, closeSprite, x, y, colWidth, colHeight);
        this.openSprite = openSprite;
        this.closeSprite = closeSprite;
        this.state = false;

        events.on(this.serial+"on", ()=>{
            if(!this.state){
                this.state = !this.state;
                this.sprite = this.openSprite;
                this.x-=60;
            }
        });
        events.on(this.serial+"off", ()=>{
            if(this.state){
                this.state = !this.state;
                this.sprite = this.closeSprite;
                this.x+=60;
            }
        });
    }
    open(){
        this.sprite = this.openSprite;
        this.state = true;
    }
    close(){
        this.sprite = this.closeSprite;
        this.state = false;
    }
}
class Guy extends GameObject {
    constructor(serial, type, display, sprite, x, y, colWidth, colHeight){
        super(serial, type, display, sprite, x, y, colWidth, colHeight);
        events.on(messages.GUY, ()=>{
            this.display = true;
        });
        events.on(messages.GUYOFF, ()=>{
            this.display = false;
        });
    }
}
function handleInput(keyDown){
    if(keyDown.includes("a")){
        events.emit(messages.MOVE_LEFT);
    }
    if(keyDown.includes("d")){
        events.emit(messages.MOVE_RIGHT);
    }
    if(keyDown.includes("w")){
        events.emit(messages.JUMP);
    }
}

document.addEventListener("DOMContentLoaded", event => {
    const canvas = document.getElementById("gamePanel");
    const context = canvas.getContext('2d');
    const objects = [];
    const sources = [];
    const keyDown = [];
    var guyDrawn = false;

    document.addEventListener('keydown', event => {
        if(!keyDown.includes(event.key)){
            keyDown.push(event.key);
        }
    });
    document.addEventListener('keyup', event => {
        if(keyDown.includes(event.key)){
            keyDown.splice(keyDown.indexOf(event.key), 1);
        }
    });
    Promise.all(imageUrls.map(imgLoad)).then(images => { //once all images are loaded, add them to the available sources array
        images.forEach(function(img){
            sources.push(new Sprite(img, 0, 0, img.width, img.height));
        });//beginning of game logic
        var serial = 0;

        objects.push(new Door(serial++, "door", true, sources[4], sources[3], 0, 560, 80, 120));
        objects.push(new Door(serial++, "door", true, sources[4], sources[3], 200, 560, 80, 120));
        objects.push(new Door(serial++, "door", true, sources[4], sources[3], 400, 560, 80, 120));
        objects.push(new Door(serial++, "door", true, sources[4], sources[3], 600, 560, 80, 120));
        objects.push(new Player(serial++, "player", true, sources[0], 0, 0, 120, 80));
        objects.push(new Enemy(serial++, "enemy", true, sources[1], 60, 540, 140, 140));
        objects.push(new GameObject(serial++, "floor", true, sources[5], 0, 680, 120, 120));
        objects.push(new GameObject(serial++, "floor", true, sources[5], 120, 680, 120, 120));
        objects.push(new GameObject(serial++, "floor", true, sources[5], 240, 680, 120, 120));
        objects.push(new GameObject(serial++, "floor", true, sources[5], 360, 680, 120, 120));
        objects.push(new GameObject(serial++, "floor", true, sources[5], 480, 680, 120, 120));
        objects.push(new GameObject(serial++, "floor", true, sources[5], 600, 680, 120, 120));
        objects.push(new Guy(serial++, "guy", false, sources[2], 60, 560, 0, 0));

        function animate(){
            context.clearRect(0, 0, canvas.width, canvas.height);
            if(guyDrawn){
                alert("WHAT DA DOG DOIN?!");
                guyDrawn = false;
                events.emit(messages.GUYOFF);
                keyDown.splice(0, keyDown.length);
            }
            //beginning of collision detection
            objects.forEach( object1 => {
                objects.forEach( object2 => {
                    if(object1 != object2){//collision logic goes here
                        if(object2.type === "door"){
                            if(Math.floor(Math.random() * 2500) === 0){
                                events.emit(object2.serial+"off");
                            }
                        }
                        if(collisionCheck(object1, object2)){
                            if(object1.type === "player" && object2.type === "floor"){
                                events.emit(messages.HITGROUND);
                            }
                            if(object1.type === "player" && object2.type === "enemy"){
                                alert('uh oh!!!!!');
                                alert("STINKYYYYYYYY");
                                object1.y = 0;
                                object1.x = 0;
                                keyDown.splice(0, keyDown.length);
                            }
                            if(object1.type === "player" && object2.type === "door"){
                                if(keyDown.includes('e')) {
                                    keyDown.splice(keyDown.indexOf('e'), 1);
                                    if(Math.floor(Math.random() * 20) === 0 && object2.state === false){
                                        events.emit(messages.GUY);
                                    }
                                    events.emit(object2.serial+"on");
                                }
                            }
                        }//end of collision logic
                    }
                });
            });
            //end of collision detection

            //handles gravity for player
            objects[4].yVelocity++;
            if(objects[4].yVelocity > 12) objects[4].yVelocity = 12;
            objects[4].move(objects[4].yVelocity, "down");

            //cat patrolls
            objects[5].move(objects[5].speed, objects[5].direction);
            objects[5].distanceTraveled+=objects[5].speed;
            if(objects[5].distanceTraveled >= 600 && objects[5].direction === "right"){
                objects[5].direction = "left";
                objects[5].distanceTraveled = 0;
            }
            if(objects[5].distanceTraveled >= 600 && objects[5].direction === "left"){
                objects[5].direction = "right";
                objects[5].distanceTraveled = 0;
            }

            //doors close
            
            handleInput(keyDown);
            //draw all game objects to the screen
            objects.forEach( element => { 
                if(element.display === true){
                    context.drawImage(...element);
                    if(element.type === "guy"){
                        guyDrawn = true;
                    }
                }
            });
        window.requestAnimationFrame(animate);
        } animate();
    });//end of game loop
});

