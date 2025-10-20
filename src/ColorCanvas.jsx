import React, { useRef, useState, useEffect } from "react";
import { initAudio } from "./Soundinteraction";

export default function ColorCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#f4064d"); // default brush color
  const [lineWidth, setLineWidth] = useState(5);
  const [eraserSize, setEraserSize] = useState(20);
  const [usingEraser, setUsingEraser] = useState(false);
  const audioRef = useRef(null);

  const defaultSong = "sounds/Hitori no Yoru (2).mp3";

  const colorCategorySongMap = {
    red: "sounds/Elvis Presley - Can't Help Falling in Love.mp3",
    green: "sounds/Green Tea & Honey.mp3",
    darkblue: "sounds/yung kai - blue (with MINNIE).mp3",
    skyblue: "sounds/Ocean View (feat. Kelsey Kuan & prettyhappy).mp3",
    purple: "sounds/Surfing in the Moonlight.mp3",
    pink: "sounds/My Love Mine All Mine.mp3",
    default: defaultSong,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.offsetWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;

    initAudio();

    audioRef.current = new Audio(defaultSong);
    audioRef.current.loop = true;
  }, []);

  const getColorCategory = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (r > 150 && g < 60 && b < 31) return "red";
    if (r < 180 && g > 150 && b < 142) return "green";
    if (r < 100 && g < 100 && b > 150) return "darkblue";
    if (r < 30 && g > 120 && b < 245) return "skyblue";
    if (r > 100 && g < 50 && b > 155) return "purple";
    if (r > 200 && g < 150 && b > 30) return "pink";
    return "default";
  };

  const playSongByColor = (hexColor) => {
    const category = getColorCategory(hexColor);
    const songPath = colorCategorySongMap[category];

    if (!audioRef.current) {
      audioRef.current = new Audio(songPath);
      audioRef.current.loop = true;
      audioRef.current.play();
    } else if (audioRef.current.src.includes(songPath)) {
      if (audioRef.current.paused) audioRef.current.play();
    } else {
      const currentTime = audioRef.current.currentTime;
      audioRef.current.pause();
      audioRef.current.src = songPath;
      audioRef.current.currentTime = currentTime;
      audioRef.current.play();
    }
  };

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
    if (!usingEraser) playSongByColor(color);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.lineCap = "round";

    if (usingEraser) {
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = eraserSize;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);
    if (!usingEraser) audioRef.current.pause();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stop any playing song
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="canvas-container">
      <h1>🎨 Color Symphony</h1>

      <div className="controls">
        <div>
          <label>Brush Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div>
          <label>Brush Size:</label>
          <input
            type="range"
            min="1"
            max="30"
            value={lineWidth}
            onChange={(e) => setLineWidth(e.target.value)}
          />
        </div>

        <div>
          <label>🩹 Eraser Size:</label>
          <input
            type="range"
            min="5"
            max="50"
            value={eraserSize}
            onChange={(e) => setEraserSize(e.target.value)}
          />
          <button
            onClick={() => setUsingEraser(!usingEraser)}
            style={{
              backgroundColor: usingEraser ? "#fcbad3" : "#a7d8ff",
              borderRadius: "10px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "#333",
              marginLeft: "8px",
            }}
          >
            {usingEraser ? "Eraser Active" : "Use Eraser"}
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>

      <div className="buttons">
        <button onClick={clearCanvas} className="clear-btn">
          Clear Canvas
        </button>
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = "MyColorSymphony.png";
            link.click();
          }}
          className="save-btn"
        >
          Save Drawing
        </button>
      </div>
    </div>
  );
}
