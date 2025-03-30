import { Rect } from "fabric";
import Shape from "./Shape";

export default class MyRect extends Shape {
    constructor(id, type, color){
        super();
        this.id = id;
        this.type = type;
        this.color = color;
    }

    createShape(){
        return new Rect({
            left: Math.random() * 700,
            top: Math.random() * 400,
            fill: this.color,
            width: 100,
            height: 100,
            selectable: true,
        })
    }
}