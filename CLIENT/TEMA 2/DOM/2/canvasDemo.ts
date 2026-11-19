import {
    drawCircle,
    drawPolygon,
    drawRectangle,
    drawSector,
    drawText
} from "./CanvasFuncs.js";

const canvas = document.getElementById("drawingCanvas");
if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("No s'ha trobat el canvas de dibuix.");
}

const context = canvas.getContext("2d");
if (context === null) {
    throw new Error("No s'ha pogut obtenir el context 2D del canvas.");
}

const outline = { strokeStyle: "#10108a", lineWidth: 5 };
const orange = { fillStyle: "#ff9020", strokeStyle: "#10108a", lineWidth: 5 };
const orangeFill = { fillStyle: "#ff9020" };

// Primera filera: formes només amb contorn.
drawPolygon(context, [{ x: 10, y: 120 }, { x: 90, y: 120 }, { x: 10, y: 200 }], outline);
drawRectangle(context, 110, 120, 80, 80, outline);
drawCircle(context, 250, 160, 40, outline);
drawSector(context, 360, 160, 40, 45, 315, outline);
drawText(context, "Hello", 420, 172, "48px Arial", "#111111");

// Segona filera: formes taronges amb contorn blau.
drawPolygon(context, [{ x: 10, y: 220 }, { x: 90, y: 220 }, { x: 10, y: 300 }], orange);
drawRectangle(context, 110, 220, 80, 80, orange);
drawCircle(context, 250, 260, 40, orange);
drawSector(context, 360, 260, 40, 45, 315, orange);
drawText(context, "Hello", 420, 272, "48px Georgia", "#ff9020");

// Tercera filera: formes i text només amb farciment.
drawPolygon(context, [{ x: 10, y: 320 }, { x: 90, y: 320 }, { x: 10, y: 400 }], orangeFill);
drawRectangle(context, 110, 320, 80, 80, orangeFill);
drawCircle(context, 250, 360, 40, orangeFill);
drawSector(context, 360, 360, 40, 45, 315, orangeFill);
drawText(context, "Hello", 420, 372, "48px Georgia", "#ff9020");
