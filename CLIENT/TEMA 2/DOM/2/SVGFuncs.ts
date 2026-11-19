const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

/** Opcions de traç i farciment per als elements SVG. */
export interface SvgStyle {
    stroke?: string;
    fill?: string;
    strokeWidth?: number;
}

/**
 * Crea un SVG amb la mida i la vista indicades.
 */
export function createSvg(
    parent: HTMLElement,
    width: number,
    height: number
): SVGSVGElement {
    const svg = document.createElementNS(SVG_NAMESPACE, "svg");
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("role", "img");
    parent.appendChild(svg);
    return svg;
}

/**
 * Dibuixa línies connectades entre els punts indicats.
 */
export function drawSvgPolyline(
    parent: SVGElement,
    points: { x: number; y: number }[],
    style: SvgStyle = {}
): SVGPolylineElement {
    validatePoints(points, 2);
    return appendStyledElement(parent, "polyline", {
        points: points.map(point => `${point.x},${point.y}`).join(" "),
        fill: "none"
    }, style);
}

/**
 * Dibuixa un polígon tancat, opcionalment amb farciment i contorn.
 */
export function drawSvgPolygon(
    parent: SVGElement,
    points: { x: number; y: number }[],
    style: SvgStyle = {}
): SVGPolygonElement {
    validatePoints(points, 3);
    return appendStyledElement(parent, "polygon", {
        points: points.map(point => `${point.x},${point.y}`).join(" ")
    }, style);
}

/**
 * Dibuixa un rectangle SVG.
 */
export function drawSvgRectangle(
    parent: SVGElement,
    x: number,
    y: number,
    width: number,
    height: number,
    style: SvgStyle = {}
): SVGRectElement {
    return appendStyledElement(parent, "rect", {
        x: String(x),
        y: String(y),
        width: String(width),
        height: String(height)
    }, style);
}

/**
 * Dibuixa un cercle SVG.
 */
export function drawSvgCircle(
    parent: SVGElement,
    centerX: number,
    centerY: number,
    radius: number,
    style: SvgStyle = {}
): SVGCircleElement {
    if (!Number.isFinite(radius) || radius < 0) {
        throw new RangeError("El radi ha de ser un nombre no negatiu.");
    }
    return appendStyledElement(parent, "circle", {
        cx: String(centerX),
        cy: String(centerY),
        r: String(radius)
    }, style);
}

/**
 * Dibuixa un sector circular a partir del centre i d'angles en graus.
 */
export function drawSvgSector(
    parent: SVGElement,
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    style: SvgStyle = {}
): SVGPathElement {
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

/**
 * Afegeix text SVG amb tipografia i mida configurables.
 */
export function drawSvgText(
    parent: SVGElement,
    text: string,
    x: number,
    y: number,
    fontSize = 32,
    fontFamily = "Arial",
    fill = "#000000"
): SVGTextElement {
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

/**
 * Crea l'element SVG sol·licitat, aplica'n l'estil i l'afegeix al pare.
 */
function appendStyledElement<K extends "polyline" | "polygon" | "rect" | "circle" | "path">(
    parent: SVGElement,
    tagName: K,
    attributes: Record<string, string>,
    style: SvgStyle
): SVGElementTagNameMap[K] {
    const element = document.createElementNS(SVG_NAMESPACE, tagName);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    element.setAttribute(
        "stroke",
        style.stroke ?? (style.fill === undefined ? "#000000" : "none")
    );
    element.setAttribute("fill", style.fill ?? "none");
    if (style.strokeWidth !== undefined) {
        element.setAttribute("stroke-width", String(style.strokeWidth));
    }
    parent.appendChild(element);
    return element;
}

/**
 * Calcula un punt de la circumferència a partir d'un angle en graus.
 */
function pointOnCircle(
    centerX: number,
    centerY: number,
    radius: number,
    angle: number
): { x: number; y: number } {
    const radians = angle * Math.PI / 180;
    return {
        x: centerX + radius * Math.cos(radians),
        y: centerY + radius * Math.sin(radians)
    };
}

/**
 * Comprova que hi hagi prou punts per dibuixar una forma SVG.
 */
function validatePoints(points: { x: number; y: number }[], minimumCount: number): void {
    if (points.length < minimumCount) {
        throw new RangeError(`Calen com a mínim ${minimumCount} punts per dibuixar la forma.`);
    }
}
