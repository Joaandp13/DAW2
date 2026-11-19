import { createElement, modifyElement, moveElementAfter, moveElementBefore, moveElementToFirstChild, moveElementToLastChild } from "./docElementsFuncs.js";
export function createTable(parent, rowCount, columnCount, attributes = {}, data) {
    validateDimension(rowCount, "El nombre de files");
    validateDimension(columnCount, "El nombre de columnes");
    validateDataDimensions(data, rowCount, columnCount);
    const tableElement = createElement("table", parent);
    if (!(tableElement instanceof HTMLTableElement)) {
        throw new Error("No s'ha pogut crear la taula.");
    }
    modifyElement(tableElement, attributes);
    const bodyElement = createElement("tbody", tableElement);
    if (!(bodyElement instanceof HTMLTableSectionElement)) {
        throw new Error("No s'ha pogut crear el cos de la taula.");
    }
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const row = createElement("tr", bodyElement);
        if (!(row instanceof HTMLTableRowElement)) {
            throw new Error("No s'ha pogut crear una fila de la taula.");
        }
        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            createCell(row, "td", data?.[rowIndex][columnIndex] ?? "");
        }
    }
    return tableElement;
}
export function fillTable(table, data) {
    const rows = getTableRows(table);
    const columnCount = getColumnCount(table);
    validateDataDimensions(data, rows.length, columnCount);
    rows.forEach((row, rowIndex) => {
        Array.from(row.cells).forEach((cell, columnIndex) => {
            cell.textContent = String(data[rowIndex][columnIndex]);
        });
    });
}
export function fillCell(table, rowIndex, columnIndex, value) {
    const row = getRow(table, rowIndex);
    const cell = row.cells.item(columnIndex);
    if (cell === null) {
        throw new RangeError("L'índex de columna no existeix.");
    }
    cell.textContent = String(value);
}
export function moveColumnBefore(table, columnIndex, referenceColumnIndex) {
    moveColumn(table, columnIndex, referenceColumnIndex, "before");
}
export function moveColumnAfter(table, columnIndex, referenceColumnIndex) {
    moveColumn(table, columnIndex, referenceColumnIndex, "after");
}
export function moveColumnToFirst(table, columnIndex) {
    const rows = getTableRows(table);
    const columnCount = getColumnCount(table);
    validateIndex(columnIndex, columnCount, "L'índex de columna");
    rows.forEach(row => {
        const cell = row.cells.item(columnIndex);
        if (cell === null) {
            throw new Error("La taula no té el mateix nombre de cel·les a totes les files.");
        }
        moveElementToFirstChild(cell, row);
    });
}
export function moveColumnToLast(table, columnIndex) {
    const rows = getTableRows(table);
    const columnCount = getColumnCount(table);
    validateIndex(columnIndex, columnCount, "L'índex de columna");
    rows.forEach(row => {
        const cell = row.cells.item(columnIndex);
        if (cell === null) {
            throw new Error("La taula no té el mateix nombre de cel·les a totes les files.");
        }
        moveElementToLastChild(cell, row);
    });
}
export function addRow(table, rowIndex, values) {
    const rows = getTableRows(table);
    const columnCount = getColumnCount(table);
    validateIndex(rowIndex, rows.length, "L'índex de fila", true);
    validateRowValues(values, columnCount);
    const row = table.insertRow(rowIndex);
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        createCell(row, "td", values?.[columnIndex] ?? "");
    }
    return row;
}
export function addColumn(table, columnIndex, values) {
    const rows = getTableRows(table);
    const columnCount = getColumnCount(table);
    if (rows.length === 0) {
        throw new Error("No es pot afegir una columna a una taula sense files.");
    }
    validateIndex(columnIndex, columnCount, "L'índex de columna", true);
    if (values !== undefined && values.length !== rows.length) {
        throw new RangeError("Cal indicar un valor per cada fila de la taula.");
    }
    rows.forEach((row, rowIndex) => {
        const referenceCell = row.cells.item(columnIndex);
        const adjacentCell = referenceCell ?? row.cells.item(row.cells.length - 1);
        const tagName = adjacentCell?.tagName.toLowerCase() === "th" ? "th" : "td";
        const cell = createCell(row, tagName, values?.[rowIndex] ?? "");
        row.insertBefore(cell, referenceCell);
    });
}
export function deleteRow(table, rowIndex) {
    const rows = getTableRows(table);
    validateIndex(rowIndex, rows.length, "L'índex de fila");
    table.deleteRow(rowIndex);
}
export function deleteColumn(table, columnIndex) {
    const rows = getTableRows(table);
    const columnCount = getColumnCount(table);
    validateIndex(columnIndex, columnCount, "L'índex de columna");
    rows.forEach(row => {
        const cell = row.cells.item(columnIndex);
        if (cell === null) {
            throw new Error("La taula no té el mateix nombre de cel·les a totes les files.");
        }
        row.deleteCell(columnIndex);
    });
}
function moveColumn(table, columnIndex, referenceColumnIndex, position) {
    const rows = getTableRows(table);
    const columnCount = getColumnCount(table);
    validateIndex(columnIndex, columnCount, "L'índex de columna");
    validateIndex(referenceColumnIndex, columnCount, "L'índex de columna de referència");
    if (columnIndex === referenceColumnIndex) {
        return;
    }
    rows.forEach(row => {
        const cell = row.cells.item(columnIndex);
        const referenceCell = row.cells.item(referenceColumnIndex);
        if (cell === null || referenceCell === null) {
            throw new Error("La taula no té el mateix nombre de cel·les a totes les files.");
        }
        if (position === "before") {
            moveElementBefore(cell, referenceCell);
        }
        else {
            moveElementAfter(cell, referenceCell);
        }
    });
}
function getTableRows(table) {
    const rows = Array.from(table.rows);
    rows.forEach(row => {
        Array.from(row.cells).forEach(cell => {
            if (cell.colSpan !== 1 || cell.rowSpan !== 1) {
                throw new Error("No es poden gestionar taules amb cel·les combinades.");
            }
        });
    });
    return rows;
}
function getColumnCount(table) {
    const rows = getTableRows(table);
    const columnCount = rows[0]?.cells.length ?? 0;
    if (rows.some(row => row.cells.length !== columnCount)) {
        throw new Error("La taula no té el mateix nombre de cel·les a totes les files.");
    }
    return columnCount;
}
function getRow(table, rowIndex) {
    const rows = getTableRows(table);
    validateIndex(rowIndex, rows.length, "L'índex de fila");
    return rows[rowIndex];
}
function createCell(row, tagName, value) {
    const cell = createElement(tagName, row);
    if (!(cell instanceof HTMLTableCellElement)) {
        throw new Error("No s'ha pogut crear una cel·la de la taula.");
    }
    cell.textContent = String(value);
    return cell;
}
function validateDimension(value, name) {
    if (!Number.isInteger(value) || value < 0) {
        throw new RangeError(`${name} ha de ser un enter no negatiu.`);
    }
}
function validateDataDimensions(data, rowCount, columnCount) {
    if (data === undefined) {
        return;
    }
    if (data.length !== rowCount ||
        data.some(row => row.length !== columnCount)) {
        throw new RangeError("Les dimensions de les dades no coincideixen amb les de la taula.");
    }
}
function validateRowValues(values, columnCount) {
    if (values !== undefined && values.length !== columnCount) {
        throw new RangeError("Cal indicar un valor per cada columna de la taula.");
    }
}
function validateIndex(index, length, name, allowEnd = false) {
    const maxIndex = allowEnd ? length : length - 1;
    if (!Number.isInteger(index) || index < 0 || index > maxIndex) {
        throw new RangeError(`${name} està fora dels límits.`);
    }
}
//# sourceMappingURL=TablesFuncs.js.map