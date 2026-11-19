const source = document.getElementById("panel");
const pasteTarget = document.getElementById("pasteTarget");
const copyButton = document.getElementById("copyButton");
const pasteButton = document.getElementById("pasteButton");
const status = document.getElementById("clipboardStatus");

if (
    !(source instanceof HTMLElement) ||
    !(pasteTarget instanceof HTMLElement) ||
    !(copyButton instanceof HTMLButtonElement) ||
    !(pasteButton instanceof HTMLButtonElement) ||
    !(status instanceof HTMLElement)
) {
    throw new Error("No s'han trobat els elements del portapapers.");
}

const clipboardStatus = status;
const allowedTags = new Set([
    "A", "B", "BLOCKQUOTE", "BR", "CAPTION", "CODE", "DIV", "EM", "H1", "H2", "H3",
    "H4", "H5", "H6", "HR", "I", "LI", "OL", "P", "PRE", "SECTION", "SPAN",
    "STRONG", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "U", "UL"
]);
const allowedStyleProperties = new Set([
    "background-color", "border", "border-collapse", "border-color", "border-style",
    "border-width", "color", "display", "font-family", "font-size", "font-style",
    "font-weight", "height", "line-height", "margin", "padding", "text-align",
    "text-decoration", "vertical-align", "white-space", "width"
]);

/**
 * Copia el contingut de l'element amb els estils calculats incrustats al HTML.
 */
async function copyElementWithStyles(element: HTMLElement): Promise<void> {
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
        throw new Error("Aquest navegador no permet copiar contingut HTML al portapapers.");
    }

    const clone = element.cloneNode(true);
    if (!(clone instanceof HTMLElement)) {
        throw new Error("No s'ha pogut preparar el contingut per copiar.");
    }
    inlineComputedStyles(element, clone);

    const html = clone.outerHTML;
    const text = element.innerText;
    await navigator.clipboard.write([
        new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" })
        })
    ]);
}

/**
 * Copia els estils calculats de cada element de l'original al seu clon corresponent.
 */
function inlineComputedStyles(original: Element, clone: Element): void {
    const computedStyle = getComputedStyle(original);
    const style = (clone as HTMLElement | SVGElement).style;

    for (let index = 0; index < computedStyle.length; index++) {
        const property = computedStyle.item(index);
        style.setProperty(property, computedStyle.getPropertyValue(property));
    }

    const originalChildren = Array.from(original.children);
    const cloneChildren = Array.from(clone.children);
    originalChildren.forEach((child, index) => {
        inlineComputedStyles(child, cloneChildren[index]);
    });
}

/**
 * Llegeix HTML del portapapers, n'elimina elements i atributs actius i l'afegeix al final.
 */
async function pasteClipboardAtEnd(target: HTMLElement): Promise<void> {
    if (!navigator.clipboard?.read) {
        throw new Error("Aquest navegador no permet llegir contingut HTML del portapapers.");
    }

    const items = await navigator.clipboard.read();
    const htmlItem = items.find(item => item.types.includes("text/html"));
    if (htmlItem === undefined) {
        const textItem = items.find(item => item.types.includes("text/plain"));
        if (textItem === undefined) {
            throw new Error("El portapapers no conté text ni HTML compatible.");
        }

        const text = await (await textItem.getType("text/plain")).text();
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        target.appendChild(paragraph);
        return;
    }

    const html = await (await htmlItem.getType("text/html")).text();
    const parsedDocument = new DOMParser().parseFromString(html, "text/html");
    const fragment = document.createDocumentFragment();
    Array.from(parsedDocument.body.childNodes).forEach(node => {
        const safeNode = sanitizeNode(node);
        if (safeNode !== null) {
            fragment.appendChild(safeNode);
        }
    });
    target.appendChild(fragment);
}

/**
 * Construeix una còpia segura d'un node HTML, permetent només etiquetes i estils coneguts.
 */
function sanitizeNode(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.textContent ?? "");
    }
    if (!(node instanceof HTMLElement)) {
        return null;
    }

    if (!allowedTags.has(node.tagName)) {
        if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "FORM"].includes(node.tagName)) {
            return null;
        }
        const safeChildren = document.createDocumentFragment();
        Array.from(node.childNodes).forEach(child => {
            const safeChild = sanitizeNode(child);
            if (safeChild !== null) {
                safeChildren.appendChild(safeChild);
            }
        });
        return safeChildren;
    }

    const cleanElement = document.createElement(node.tagName.toLowerCase());
    for (const attribute of Array.from(node.attributes)) {
        if (attribute.name === "title" || attribute.name === "colspan" || attribute.name === "rowspan") {
            cleanElement.setAttribute(attribute.name, attribute.value);
        } else if (attribute.name === "href" && node.tagName === "A") {
            const url = new URL(attribute.value, document.baseURI);
            if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") {
                cleanElement.setAttribute("href", url.href);
            }
        } else if (attribute.name === "style") {
            cleanInlineStyle(node.getAttribute("style") ?? "", cleanElement);
        }
    }

    Array.from(node.childNodes).forEach(child => {
        const safeChild = sanitizeNode(child);
        if (safeChild !== null) {
            cleanElement.appendChild(safeChild);
        }
    });
    return cleanElement;
}

/**
 * Aplica només propietats d'estil de presentació sense valors que puguin carregar recursos.
 */
function cleanInlineStyle(sourceStyle: string, target: HTMLElement): void {
    const parsedStyle = document.createElement("span");
    parsedStyle.setAttribute("style", sourceStyle);

    for (let index = 0; index < parsedStyle.style.length; index++) {
        const property = parsedStyle.style.item(index);
        const value = parsedStyle.style.getPropertyValue(property);
        if (
            allowedStyleProperties.has(property) &&
            !/url\s*\(|expression\s*\(|javascript:/i.test(value)
        ) {
            target.style.setProperty(property, value);
        }
    }
}

/**
 * Mostra errors d'accés al portapapers a la pàgina en lloc de fallar silenciosament.
 */
function reportClipboardError(error: unknown): void {
    const message = error instanceof Error ? error.message : "S'ha produït un error desconegut.";
    clipboardStatus.textContent = `Error del portapapers: ${message}`;
}

copyButton.addEventListener("click", () => {
    copyElementWithStyles(source)
        .then(() => {
            clipboardStatus.textContent = "Panell copiat amb els seus estils.";
        })
        .catch(reportClipboardError);
});
pasteButton.addEventListener("click", () => {
    pasteClipboardAtEnd(pasteTarget)
        .then(() => {
            clipboardStatus.textContent = "Contingut enganxat al final del document.";
        })
        .catch(reportClipboardError);
});
