import { useRef } from "react";

export default class Shape {
    constructor(){
    }

    createShape(){
        throw new Error("자식 클래스에서 실행되어야 합니다.");
    }
}