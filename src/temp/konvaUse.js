import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";
import RectObject from "../shapes/RectObject";
import CircleObject from "../shapes/CircleObject"
import styled from "styled-components";
import square from "../images/square.png";
import circle from "../images/circle.png";


const KonvaUse = () => {
  // 📌 상태(state): 도형(객체) 목록을 관리
  const [objects, setObjects] = useState([]);
  const [color, setColor] = useState("#000000");
  const [selectedObject, setSelectedObject] = useState();


  const RectButton = styled.button`
    width: 40px;
    height: 40px;
    background-image: url(${square});
    background-size: cover;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
  `;

  const CircleButton = styled.button`
    width: 40px;
    height: 40px;
    background-image: url(${circle});
    background-size: cover;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
  `;

  // ✅ 새로운 도형을 추가하는 함수
  const addObject = (type) => {
    const newObject = {
      id: objects.length + 1,
      type: type,
      x: Math.random() * 400,
      y: Math.random() * 400,
      width: 100,
      height: 100,
      color: color,
      radius: 50,
    };
    setObjects([...objects, newObject]); // 기존 객체 배열에 새 객체 추가
  };

  return (

    <div>
      {/* 도형 추가 버튼 */}
      &nbsp;
      <RectButton style={{ margin: '20px 0'}} onClick={() => addObject("rectangle")}/> &nbsp;
      <CircleButton style={{ margin: '20px 0'}} onClick={() => addObject("circle")}/> &nbsp;
      <label>색상: </label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />

    <div style={{ display: "flex" }}>
      {/* 캔버스 영역 */}
      <Stage width={window.innerWidth} height={window.innerHeight} style={{ border: "4px solid black", margin: '20px 0' }}>
        <Layer>
          {objects.map((obj) => {
            switch (obj.type) {
                case "rectangle": return (
                    <RectObject
                    key={obj.id}
                    {...obj}
                    onSelect={() => setSelectedObject(obj)} // 🔹 클릭 시 선택된 도형 설정
                    onChange={(newAttrs) => {
                    const updatedObjects = objects.map((item) =>
                      item.id === obj.id ? { ...item, ...newAttrs } : item
                    );
                    setObjects(updatedObjects);
                  }}
                />
                );
                case "circle": return (
                    <CircleObject
                    key={obj.id}
                    {...obj}
                />
                )
            }
          }
        )
        }

        </Layer>
      </Stage>

      {/* 속성 창 */}
      <div style={{ width: "300px", padding: "50px", borderRight: "2px solid black" }}>
        <h3>도형 속성</h3>
        {selectedObject ? (
          <>
            <p>X: {selectedObject.x}</p>
            <p>Y: {selectedObject.y}</p>
            <p>Width: {selectedObject.width}</p>
            <p>Height: {selectedObject.height}</p>
          </>
        ) : (
          <p>도형을 선택하세요</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default KonvaUse;
