import React, { useRef, useState, useEffect } from "react";
import { initAudio } from "./Soundinteraction";

export default function ColorCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#f4064d"); // default brush color
  const [lineWidth, setLineWidth] = useState(5);
  const [eraserSize, setEraserSize] = useState(20);
  const [usingEraser, setUsingEraser] = useState(false);
  const audioRefs = useRef({}); // store preloaded audio objects

  const defaultSong = "public/sounds/Hitori no Yoru (2).mp3";

  const colorCategorySongMap = {
    red: "public/sounds/Elvis Presley - Can't Help Falling in Love.mp3",
    green: "public/sounds/Green Tea & Honey.mp3",
    darkblue: "public/sounds/yung kai - blue (with MINNIE).mp3",
    skyblue: "public/sounds/Ocean View (feat. Kelsey Kuan & prettyhappy).mp3",
    purple: "public/sounds/Surfing in the Moonlight.mp3",
    pink: "public/sounds/My Love Mine All Mine.mp3",
    default: defaultSong,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.offsetWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;

    initAudio();

    // Preload all audio files
    Object.keys(colorCategorySongMap).forEach((key) => {
      const audio = new Audio(colorCategorySongMap[key]);
      audio.loop = true;
      audioRefs.current[key] = audio;
    });
  }, []);

  const getColorCategory = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (r > 150 && g < 60 && b < 31) return "red";
    if (r < 180 && g > 150 && b < 100) return "green";
    if (r < 100 && g < 100 && b > 150) return "darkblue";
    if (r < 30 && g > 150 && b < 245) return "skyblue";
    if (r > 100 && g < 50 && b > 155) return "purple";
    if (r > 200 && g < 150 && b > 30) return "pink";
    return "default";
  };

  const playSongByColor = (hexColor) => {
    const category = getColorCategory(hexColor);

    // pause all other songs
    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== category && audioRefs.current[key]) {
        audioRefs.current[key].pause();
        audioRefs.current[key].currentTime = 0;
      }
    });

    // play the selected song
    const song = audioRefs.current[category];
    if (song && song.paused) {
      song.play().catch((e) => console.log("Audio play blocked:", e));
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

    if (!usingEraser) {
      Object.values(audioRefs.current).forEach((a) => a.pause());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // stop all songs without playing default
    Object.values(audioRefs.current).forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
  };

  return (
    <div className="canvas-container">
      <h1>🎨 Color Symphony</h1>

      <div className="controls">
        <div>
          <label>Brush Color:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div>
          <label>Brush Size:</label>
          <input type="range" min="1" max="30" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} />
        </div>

        <div>
          <label>🩹 Eraser Size:</label>
          <input type="range" min="5" max="50" value={eraserSize} onChange={(e) => setEraserSize(e.target.value)} />
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
