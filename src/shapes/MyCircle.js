import { Ellipse } from "fabric";
import Shape from "./Shape";

export default class MyCircle extends Shape {
    constructor(id, type, color){
        super();
        this.id = id;
        this.type = type;
        this.color = color;
    }

    createShape(){
        return new Ellipse({
            left: Math.random() * 700, // x좌표
            top: Math.random() * 400, // y좌표
            fill: this.color,
            rx: 50,
            ry: 50,
            selectable: true,
        })
    }
}