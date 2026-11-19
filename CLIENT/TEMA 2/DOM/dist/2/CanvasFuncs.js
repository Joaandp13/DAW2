export function drawPolyline(context, points, style = {}) {
    validatePoints(points, 2);
    applyStyle(context, style);
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(point => context.lineTo(point.x, point.y));
    context.stroke();
}
export function drawPolygon(context, points, style = {}) {
    validatePoints(points, 3);
    applyStyle(context, style);
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(point => context.lineTo(point.x, point.y));
    context.closePath();
    if (style.fillStyle !== undefined) {
        context.fill();
    }
    if (style.strokeStyle !== undefined || style.fillStyle === undefined) {
        context.stroke();
    }
}
export function drawRectangle(context, x, y, width, height, style = {}) {
    applyStyle(context, style);
    if (style.fillStyle !== undefined) {
        context.fillRect(x, y, width, height);
    }
    if (style.strokeStyle !== undefined || style.fillStyle === undefined) {
        context.strokeRect(x, y, width, height);
    }
}
export function drawCircle(context, centerX, centerY, radius, style = {}) {
    validateRadius(radius);
    applyStyle(context, style);
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    if (style.fillStyle !== undefined) {
        context.fill();
    }
    if (style.strokeStyle !== undefined || style.fillStyle === undefined) {
        context.stroke();
    }
}
export function drawSector(context, centerX, centerY, radius, startAngle, endAngle, style = {}) {
    validateRadius(radius);
    applyStyle(context, style);
    const startRadians = degreesToRadians(startAngle);
    const endRadians = degreesToRadians(endAngle);
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, startRadians, endRadians);
    context.closePath();
    if (style.fillStyle !== undefined) {
        context.fill();
    }
    if (style.strokeStyle !== undefined || style.fillStyle === undefined) {
        context.stroke();
    }
}
export function drawText(context, text, x, y, font = "32px Arial", color = "#000000") {
    context.font = font;
    context.fillStyle = color;
    context.fillText(text, x, y);
}
function applyStyle(context, style) {
    context.strokeStyle = style.strokeStyle ?? "#000000";
    context.fillStyle = style.fillStyle ?? "#000000";
    context.lineWidth = style.lineWidth ?? 1;
}
function validatePoints(points, minimumCount) {
    if (points.length < minimumCount) {
        throw new RangeError(`Calen com a mínim ${minimumCount} punts per dibuixar la forma.`);
    }
}
function validateRadius(radius) {
    if (!Number.isFinite(radius) || radius < 0) {
        throw new RangeError("El radi ha de ser un nombre no negatiu.");
    }
}
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
//# sourceMappingURL=CanvasFuncs.js.map