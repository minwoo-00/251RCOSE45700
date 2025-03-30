import React, { useEffect, useRef, useState } from "react";
import { Canvas, Circle, CircleBrush, Ellipse, PencilBrush } from "fabric";

const FabricCanvas = ( { objects=[], setObjects ,activeTool, color, clearing, penWidth } ) => {

  const canvasRef = useRef(null); // HTMLCanvasElement 참조
  const fabricCanvasRef = useRef(null);  // Fabric.js Canvas 객체 관리

  const [selectedObject, setSelectedObject] = useState(null); // 선택한 오브젝트  
  const [zIndexObject, setZIndexObject] = useState(null); // z-index 조절할 오브젝트

  const leftValue = useRef(null);
  const topValue = useRef(null);
  const widthValue = useRef(null);
  const heightValue = useRef(null);

  
  // ┌----------------- 캔버스 생성 ------------------------┐
  useEffect(() => {
    if (!canvasRef.current) return;

    // Fabric.js Canvas 초기화
    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 1300,
      height: 600,
      backgroundColor: "#ffffff",
      selectionBorderColor: "black",
    });

    fabricCanvasRef.current = fabricCanvas;

    // ┌------------------속성창 업데이트-------------------------┐
    const handleObjectSelected = (event) => {
      const clickedObject = event.selected ? event.selected[0] : null;
      
      //console.log("선택된 객체:", clickedObject);
      
      if (!event.selected) return;

      setSelectedObject({ 
        left: (clickedObject.left || 0), 
        top: (clickedObject.top || 0),
        width: (clickedObject.width || 0) * (clickedObject.scaleX || 1), 
        height: (clickedObject.height || 0) * (clickedObject.scaleY || 1),
      });
      setZIndexObject(clickedObject);
    };

    const handleObjectModified = (event) => {
      //console.log("선택된 객체:", event.target);
      if (!event.target) return;

      const modifiedObject = event.target;
      setSelectedObject({
        left: modifiedObject.left || 0,
        top: modifiedObject.top || 0,
        width: (modifiedObject.width || 0) * (modifiedObject.scaleX || 1), 
        height: (modifiedObject.height || 0) * (modifiedObject.scaleY || 1),
      });
      setZIndexObject(modifiedObject);
    };

    const handleSelectionCleared = () => {
      //console.log("선택 해제");
      setSelectedObject(null);
      setZIndexObject(null);
    };

    fabricCanvas.on("") 
    fabricCanvas.on("selection:created", handleObjectSelected);
    fabricCanvas.on("selection:updated", handleObjectSelected);
    fabricCanvas.on("selection:cleared", handleSelectionCleared);
    fabricCanvas.on("object:modified", handleObjectModified);     // 위치 움직이거나 크기 조절 시 감지

    // └-------------------속성창 업데이트-------------------┘

    return () => {
      fabricCanvas.dispose(); // 컴포넌트 언마운트 시 캔버스 정리
      fabricCanvas.off("selection:created", handleObjectSelected);
      fabricCanvas.off("selection:updated", handleObjectSelected);
      fabricCanvas.off("selection:cleared", handleSelectionCleared);
      fabricCanvas.off("object:modified", handleObjectModified);
    };
  }, []);
  // └------------------캔버스 생성-------------------------┘
    
  // ┌--------- objects에 객체 추가될 때마다 캔버스 리랜더링 ------┐
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    //canvas.clear();

    objects.forEach((obj) => {
      if (obj) canvas.add(obj);
    });

    canvas.renderAll();
  }, [objects]);

  // └----------------객체 추가 리렌더링---------------------┘

  // ┌--------- Canvas clear ---------┐
  useEffect(() => {
    setObjects([]);
    fabricCanvasRef.current.clear();
  },[clearing]);

  // └---------Canvas clear-----------┘

  // ┌--------------도형의 z-index, 그림자 조절------------------┐

  const moveObjectTop = () => {
    // console.log(zIndexObject); // 선택된 객체 출력
    // console.log(zIndexObject instanceof FabricObject);
    if (zIndexObject === null) return;

    fabricCanvasRef.current.bringObjectToFront(zIndexObject);
    
  }

  const makeObjectShadow = () => {
    if (zIndexObject === null) return;

    if (zIndexObject.shadow === null){
      zIndexObject.set("shadow", {
        color: "rgba(0,0,0,0.5)",
        blur: 10,
        offsetX: 5,
        offsetY: 5,
      });
    } else if (zIndexObject.shadow !== null){
      zIndexObject.set("shadow", null);
    }
  }

  // └--------------도형의 z-index, 그림자 조절------------------┘

  // ┌--------------속성값 변경을 도형에 반영------------------┐

  const changeX = () => {
    if (zIndexObject === null || leftValue.current === null) return;

    zIndexObject.setX(leftValue.current);
    zIndexObject.scale(1);      // selection box를 오브젝트 크기에 맞춰 갱신해주기
    fabricCanvasRef.current.renderAll();
  }
  const changeY = () => {
    if (zIndexObject === null || topValue.current === null) return;

    zIndexObject.setY(topValue.current);
    zIndexObject.scale(1);
    fabricCanvasRef.current.renderAll();
  }
  const changeWidth = () => {
    if (zIndexObject === null || widthValue.current === null) return;

     if (zIndexObject instanceof Ellipse) {
       zIndexObject.set("rx", widthValue.current / 2);
     } else {
      zIndexObject.set("width", widthValue.current);
     }
    zIndexObject.scale(1);        
    fabricCanvasRef.current.renderAll();
  }
  const changeHeight = () => {
    if (zIndexObject === null || heightValue.current === null) return;

     if (zIndexObject instanceof Ellipse) {
      zIndexObject.set("ry", heightValue.current / 2);
     } else {
      zIndexObject.set("height", heightValue.current);
     }

    zIndexObject.scale(1);
    fabricCanvasRef.current.renderAll();
  }

  // └--------------속성값 변경을 도형에 반영------------------┘


  // ┌--------------그리기 모드 전환----------------------┐

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    //console.log(activeTool);

    switch (activeTool) {
      case "select": 
        canvas.isDrawingMode = false;
        break;
      case "pen":
        canvas.isDrawingMode = true;

        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = penWidth;
        break;
    }
    fabricCanvasRef.current.renderAll();

  }, [activeTool, color, penWidth]);

  // └--------------그리기 모드 전환----------------------┘

  useEffect(() => {
    if (zIndexObject === null) return;

    zIndexObject.set("fill", color);
    fabricCanvasRef.current.renderAll();
  },[color]);



  return (
    <div>
      <canvas ref={canvasRef} style={{ border: "2px solid black", margin: "10px"}} />
      &nbsp;
       <table border="1" style={{margin: "10px"}} >
        <tr>
          <th>x좌표</th>
          <th>y좌표</th>
          <th>width</th>
          <th>height</th>
        </tr>
        <tr>
          <td>{ selectedObject ? selectedObject.left.toFixed(0) : '-' }</td>
          <td>{ selectedObject ? selectedObject.top.toFixed(0) : '-' }</td>
          <td>{ selectedObject ? selectedObject.width.toFixed(0) : '-' }</td>
          <td>{ selectedObject ? selectedObject.height.toFixed(0) : '-' }</td>
        </tr>
        <tr>
          <td>
          <input
           type="number" name="left" min="0" max="1500" step="10"
           onChange={(e) => leftValue.current = parseInt(e.target.value)}
          />
          <button onClick={changeX}>변경</button>
          </td>
          <td>
          <input
           type="number" name="top" min="0" max="800" step="10"
           onChange={(e) => topValue.current = parseInt(e.target.value)}
          />
          <button onClick={changeY}>변경</button>
          </td>
          <td>
          <input
           type="number" name="width" min="1" step="10"
           onChange={(e) => widthValue.current = parseInt(e.target.value)}
          />
          <button onClick={changeWidth}>변경</button>
          </td>
          <td>
          <input
           type="number" name="height" min="1" step="10"
           onChange={(e) => heightValue.current = parseInt(e.target.value)}
          />
          <button onClick={changeHeight}>변경</button>
          </td>
        </tr>
      </table> 
      <button onClick={moveObjectTop} style={{ marginBottom: "5px", padding: "5px" }}>맨 위로 이동</button>
      &nbsp;
      <button onClick={makeObjectShadow} style={{ marginBottom: "5px", padding: "5px" }}>그림자</button>
    </div>
  );
};

export default FabricCanvas;
