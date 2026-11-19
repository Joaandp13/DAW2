
/**
 * 
 * @param elName nom de la etiqueta del element a crear (Ex: <p> <div> <form>, etc...)
 * @param parent element sota el que el vols crear, (Ex: body, div, form, etc...)
 * @param id id a assginar al element per posterior utilització amb js, opcional
 * @param innerText text interior del element, opcionl
 * @returns 
 */
export function createElement(
    elName: string,
    parent: HTMLElement,
    id?: string |undefined,
    innerText?: string): HTMLElement | undefined 
    {
    
    const newElement: HTMLElement = document.createElement(elName);
    if (newElement != null) {
        if (id != null) {
            newElement.id = id;
        }
        if (innerText != null) {
            newElement.innerText = innerText;
        }
        parent.appendChild(newElement)
        return newElement;
    }
    throw new Error("L'etiqueta indicada no existeix o es erronia.")
    return;

}
/**
 * 
 * @param element element a modificar
 * @param attributes atributs a a afegir
 */
export function modifyElement(element: HTMLElement, attributes: Record<string, string>): void {
    // Recorrem totes les claus de l'objecte d'atributs
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
}

/**
 * Mou un element abans de l'element de referència.
 */
export function moveElementBefore(element: HTMLElement, referenceElement: HTMLElement): void {
    const parent = referenceElement.parentNode;
    if (parent === null) {
        throw new Error("L'element de referència no té cap pare.");
    }

    parent.insertBefore(element, referenceElement);
}

/**
 * Mou un element després de l'element de referència.
 */
export function moveElementAfter(element: HTMLElement, referenceElement: HTMLElement): void {
    const parent = referenceElement.parentNode;
    if (parent === null) {
        throw new Error("L'element de referència no té cap pare.");
    }

    parent.insertBefore(element, referenceElement.nextSibling);
}

/**
 * Mou un element perquè sigui el primer fill del pare indicat.
 */
export function moveElementToFirstChild(element: HTMLElement, parent: HTMLElement): void {
    parent.insertBefore(element, parent.firstChild);
}

/**
 * Mou un element perquè sigui l'últim fill del pare indicat.
 */
export function moveElementToLastChild(element: HTMLElement, parent: HTMLElement): void {
    parent.appendChild(element);
}
