const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
export function createSvg(parent, width, height) {
    const svg = document.createElementNS(SVG_NAMESPACE, "svg");
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("role", "img");
    parent.appendChild(svg);
    return svg;
}
export function drawSvgPolyline(parent, points, style = {}) {
    validatePoints(points, 2);
    return appendStyledElement(parent, "polyline", {
        points: points.map(point => `${point.x},${point.y}`).join(" "),
        fill: "none"
    }, style);
}
export function drawSvgPolygon(parent, points, style = {}) {
    validatePoints(points, 3);
    return appendStyledElement(parent, "polygon", {
        points: points.map(point => `${point.x},${point.y}`).join(" ")
    }, style);
}
export function drawSvgRectangle(parent, x, y, width, height, style = {}) {
    return appendStyledElement(parent, "rect", {
        x: String(x),
        y: String(y),
        width: String(width),
        height: String(height)
    }, style);
}
export function drawSvgCircle(parent, centerX, centerY, radius, style = {}) {
    if (!Number.isFinite(radius) || radius < 0) {
        throw new RangeError("El radi ha de ser un nombre no negatiu.");
    }
    return appendStyledElement(parent, "circle", {
        cx: String(centerX),
        cy: String(centerY),
        r: String(radius)
    }, style);
}
export function drawSvgSector(parent, centerX, centerY, radius, startAngle, endAngle, style = {}) {
    if (!Number.isFinite(radius) || radius < 0) {
        throw new RangeError("El radi ha de ser un nombre no negatiu.");
    }
    const start = pointOnCircle(centerX, centerY, radius, startAngle);
    const end = pointOnCircle(centerX, centerY, radius, endAngle);
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const direction = endAngle >= startAngle ? 1 : 0;
    const path = `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${direction} ${end.x} ${end.y} Z`;
    return appendStyledElement(parent, "path", { d: path }, style);
}
export function drawSvgText(parent, text, x, y, fontSize = 32, fontFamily = "Arial", fill = "#000000") {
    const element = document.createElementNS(SVG_NAMESPACE, "text");
    element.setAttribute("x", String(x));
    element.setAttribute("y", String(y));
    element.setAttribute("font-size", String(fontSize));
    element.setAttribute("font-family", fontFamily);
    element.setAttribute("fill", fill);
    element.textContent = text;
    parent.appendChild(element);
    return element;
}
function appendStyledElement(parent, tagName, attributes, style) {
    const element = document.createElementNS(SVG_NAMESPACE, tagName);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    element.setAttribute("stroke", style.stroke ?? (style.fill === undefined ? "#000000" : "none"));
    element.setAttribute("fill", style.fill ?? "none");
    if (style.strokeWidth !== undefined) {
        element.setAttribute("stroke-width", String(style.strokeWidth));
    }
    parent.appendChild(element);
    return element;
}
function pointOnCircle(centerX, centerY, radius, angle) {
    const radians = angle * Math.PI / 180;
    return {
        x: centerX + radius * Math.cos(radians),
        y: centerY + radius * Math.sin(radians)
    };
}
function validatePoints(points, minimumCount) {
    if (points.length < minimumCount) {
        throw new RangeError(`Calen com a mínim ${minimumCount} punts per dibuixar la forma.`);
    }
}
//# sourceMappingURL=SVGFuncs.js.map