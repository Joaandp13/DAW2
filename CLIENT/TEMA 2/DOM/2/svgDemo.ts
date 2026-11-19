import {
    createSvg,
    drawSvgCircle,
    drawSvgPolygon,
    drawSvgRectangle,
    drawSvgSector,
    drawSvgText
} from "./SVGFuncs.js";

const container = document.getElementById("svgContainer");
if (!(container instanceof HTMLElement)) {
    throw new Error("No s'ha trobat el contenidor del dibuix SVG.");
}

const svg = createSvg(container, 640, 400);
const outline = { stroke: "#10108a", strokeWidth: 5 };
const orange = { fill: "#ff9020", stroke: "#10108a", strokeWidth: 5 };
const orangeFill = { fill: "#ff9020" };

// Primera filera: formes només amb contorn.
drawSvgPolygon(svg, [{ x: 10, y: 120 }, { x: 90, y: 120 }, { x: 10, y: 200 }], outline);
drawSvgRectangle(svg, 110, 120, 80, 80, outline);
drawSvgCircle(svg, 250, 160, 40, outline);
drawSvgSector(svg, 360, 160, 40, 45, 315, outline);
drawSvgText(svg, "Hello", 420, 172, 48, "Arial", "#111111");

// Segona filera: formes taronges amb contorn blau.
drawSvgPolygon(svg, [{ x: 10, y: 220 }, { x: 90, y: 220 }, { x: 10, y: 300 }], orange);
drawSvgRectangle(svg, 110, 220, 80, 80, orange);
drawSvgCircle(svg, 250, 260, 40, orange);
drawSvgSector(svg, 360, 260, 40, 45, 315, orange);
drawSvgText(svg, "Hello", 420, 272, 48, "Georgia", "#ff9020");

// Tercera filera: formes i text només amb farciment.
drawSvgPolygon(svg, [{ x: 10, y: 320 }, { x: 90, y: 320 }, { x: 10, y: 400 }], orangeFill);
drawSvgRectangle(svg, 110, 320, 80, 80, orangeFill);
drawSvgCircle(svg, 250, 360, 40, orangeFill);
drawSvgSector(svg, 360, 360, 40, 45, 315, orangeFill);
drawSvgText(svg, "Hello", 420, 372, 48, "Georgia", "#ff9020");
