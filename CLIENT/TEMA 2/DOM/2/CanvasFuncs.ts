/** Punt bidimensional utilitzat per les funcions de dibuix. */
export interface CanvasPoint {
    x: number;
    y: number;
}

/** Opcions visuals comunes per dibuixar línies, contorns i farciments. */
export interface CanvasStyle {
    strokeStyle?: string;
    fillStyle?: string;
    lineWidth?: number;
}

/**
 * Dibuixa línies connectades entre els punts indicats.
 */
export function drawPolyline(
    context: CanvasRenderingContext2D,
    points: CanvasPoint[],
    style: CanvasStyle = {}
): void {
    validatePoints(points, 2);
    applyStyle(context, style);

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(point => context.lineTo(point.x, point.y));
    context.stroke();
}

/**
 * Dibuixa un polígon tancat, opcionalment amb farciment i contorn.
 */
export function drawPolygon(
    context: CanvasRenderingContext2D,
    points: CanvasPoint[],
    style: CanvasStyle = {}
): void {
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

/**
 * Dibuixa un rectangle amb contorn i/o farciment.
 */
export function drawRectangle(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    style: CanvasStyle = {}
): void {
    applyStyle(context, style);
    if (style.fillStyle !== undefined) {
        context.fillRect(x, y, width, height);
    }
    if (style.strokeStyle !== undefined || style.fillStyle === undefined) {
        context.strokeRect(x, y, width, height);
    }
}

/**
 * Dibuixa un cercle amb contorn i/o farciment.
 */
export function drawCircle(
    context: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    style: CanvasStyle = {}
): void {
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

/**
 * Dibuixa un sector circular; els angles d'entrada s'expressen en graus.
 */
export function drawSector(
    context: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    style: CanvasStyle = {}
): void {
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

/**
 * Dibuixa un text amb la mida, la tipografia i el color indicats.
 */
export function drawText(
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    font = "32px Arial",
    color = "#000000"
): void {
    context.font = font;
    context.fillStyle = color;
    context.fillText(text, x, y);
}

/**
 * Aplica les opcions visuals al context abans de traçar o omplir una forma.
 */
function applyStyle(context: CanvasRenderingContext2D, style: CanvasStyle): void {
    context.strokeStyle = style.strokeStyle ?? "#000000";
    context.fillStyle = style.fillStyle ?? "#000000";
    context.lineWidth = style.lineWidth ?? 1;
}

/**
 * Comprova que hi hagi prou punts per a la forma demanada.
 */
function validatePoints(points: CanvasPoint[], minimumCount: number): void {
    if (points.length < minimumCount) {
        throw new RangeError(`Calen com a mínim ${minimumCount} punts per dibuixar la forma.`);
    }
}

/**
 * Evita radi negatiu, que no és vàlid per al context del canvas.
 */
function validateRadius(radius: number): void {
    if (!Number.isFinite(radius) || radius < 0) {
        throw new RangeError("El radi ha de ser un nombre no negatiu.");
    }
}

/**
 * Converteix graus a radians per als mètodes d'arc del canvas.
 */
function degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}
