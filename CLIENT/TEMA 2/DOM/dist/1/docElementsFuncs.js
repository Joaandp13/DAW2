export function createElement(elName, parent, id, innerText) {
    const newElement = document.createElement(elName);
    if (newElement != null) {
        if (id != null) {
            newElement.id = id;
        }
        if (innerText != null) {
            newElement.innerText = innerText;
        }
        parent.appendChild(newElement);
        return newElement;
    }
    throw new Error("L'etiqueta indicada no existeix o es erronia.");
    return;
}
export function modifyElement(element, attributes) {
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
}
export function moveElementBefore(element, referenceElement) {
    const parent = referenceElement.parentNode;
    if (parent === null) {
        throw new Error("L'element de referència no té cap pare.");
    }
    parent.insertBefore(element, referenceElement);
}
export function moveElementAfter(element, referenceElement) {
    const parent = referenceElement.parentNode;
    if (parent === null) {
        throw new Error("L'element de referència no té cap pare.");
    }
    parent.insertBefore(element, referenceElement.nextSibling);
}
export function moveElementToFirstChild(element, parent) {
    parent.insertBefore(element, parent.firstChild);
}
export function moveElementToLastChild(element, parent) {
    parent.appendChild(element);
}
//# sourceMappingURL=docElementsFuncs.js.map