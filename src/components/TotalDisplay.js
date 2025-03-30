import React, { useEffect, useRef, useState } from "react";
import MyRect from "../shapes/MyRect";
import FabricCanvas from "./FabricCanvas";
import MyCircle from "../shapes/MyCircle";
import { SliderPicker, TwitterPicker } from "react-color";

const TotalDisplay = () => {

    const idRef = useRef(0);
    const [objects, setObjects] = useState([]);
    const [color, setColor] = useState("#000000");
    const [activeTool, setActiveTool] = useState("select");
    const [clearing, setClearing] = useState(false);
    const [penWidth, setPenWidth] = useState(5);

    const addRectangle = () => {
      setActiveTool("select");
      idRef.current += 1;
      const newRect = new MyRect(idRef.current, "rectangle", color);
      const addRect = newRect.createShape();
      setObjects((prev) => [...prev, addRect]);
    }

    const addCircle = () => {
      setActiveTool("select");
      idRef.current += 1;
      const newCircle = new MyCircle(idRef.current, "circle", color);
      const addCircle = newCircle.createShape();
      setObjects((prev) => [...prev, addCircle]);
    }

    const toClear = () => {
      setClearing(!clearing);
    }

    const handleChangeColor = (color) => {
      setColor(color.hex);
    }


    return (
    <div>
      &nbsp;
      <button onClick={() => setActiveTool("select")} disabled={ activeTool === "select"}
        style={{ marginBottom: "10px", padding: "10px" }}>선택</button>
      &nbsp;
      <button onClick={() => setActiveTool("pen")} disabled={ activeTool === "pen"}
        style={{ marginBottom: "10px", padding: "10px" }}>그리기</button>
      &nbsp;
      <button onClick={addRectangle} style={{ marginBottom: "10px", padding: "10px" }}>사각형</button>
      &nbsp;
      <button onClick={addCircle} style={{ marginBottom: "10px", padding: "10px" }}>  원  </button>
      &nbsp;
      <label>굵기: </label>
        <input type="range" value={penWidth} min="0" max="10" step="1" onChange={(e) => setPenWidth(e.target.value)} />
      &nbsp;
      <button onClick={toClear} style={{ marginBottom: "10px", padding: "10px" }}>지우기</button>
      &nbsp;
      <TwitterPicker color={color} onChangeComplete={handleChangeColor}/>
      
      <FabricCanvas objects={objects} setObjects={setObjects} activeTool={activeTool} color={color} clearing={clearing}
          penWidth={penWidth} />
    </div>
    );

}
export default TotalDisplay;

