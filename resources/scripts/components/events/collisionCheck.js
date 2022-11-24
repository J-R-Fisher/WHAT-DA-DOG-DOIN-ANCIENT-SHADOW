export default function collisionCheck(object1, object2){
    if(//checking each corner of the collision areas for a match
        object1.x < object2.x + object2.colWidth &&
        object1.x + object1.colWidth > object2.x &&
        object1.y < object2.y + object2.colHeight &&
        object1.y + object1.colHeight > object2.y
    ){
        return true;
    } else {
        return false;
    }
}
