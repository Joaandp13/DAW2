import {
    createElement,
    modifyElement,
    moveElementAfter,
    moveElementBefore,
    moveElementToFirstChild,
    moveElementToLastChild
} from "./docElementsFuncs.js";

/** Tipus de dades que es poden escriure a les cel·les d'una taula. */
export type TableValue = string | number;

/** Matriu de valors: cada fila de la matriu correspon a una fila de la taula. */
export type TableData = TableValue[][];

/**
 * Crea una taula amb el nombre de files i columnes indicat.
 *
 * @param parent element on s'afegirà la taula
 * @param rowCount nombre de files
 * @param columnCount nombre de columnes
 * @param attributes atributs HTML opcionals de la taula
 * @param data valors inicials opcionals, organitzats per files
 * @returns la taula creada
 */
export function createTable(
    parent: HTMLElement,
    rowCount: number,
    columnCount: number,
    attributes: Record<string, string> = {},
    data?: TableData
): HTMLTableElement {
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

/**
 * Escriu una matriu de valors a totes les cel·les de la taula.
 * La matriu ha de tenir exactament les mateixes dimensions que la taula.
 *
 * @param table taula que s'omplirà
 * @param data valors organitzats per files
 */
export function fillTable(table: HTMLTableElement, data: TableData): void {
    const rows = getTableRows(table);
    const columnCount = getColumnCount(table);
    validateDataDimensions(data, rows.length, columnCount);

    rows.forEach((row, rowIndex) => {
        Array.from(row.cells).forEach((cell, columnIndex) => {
            cell.textContent = String(data[rowIndex][columnIndex]);
        });
    });
}

/**
 * Escriu un valor en una cel·la concreta. Els índexs comencen per zero.
 *
 * @param table taula que conté la cel·la
 * @param rowIndex índex de la fila
 * @param columnIndex índex de la columna
 * @param value valor que s'escriurà
 */
export function fillCell(
    table: HTMLTableElement,
    rowIndex: number,
    columnIndex: number,
    value: TableValue
): void {
    const row = getRow(table, rowIndex);
    const cell = row.cells.item(columnIndex);
    if (cell === null) {
        throw new RangeError("L'índex de columna no existeix.");
    }

    cell.textContent = String(value);
}

/**
 * Mou una columna perquè quedi abans de la columna de referència.
 *
 * @param table taula on es mourà la columna
 * @param columnIndex índex de la columna que es mourà
 * @param referenceColumnIndex índex de la columna de referència
 */
export function moveColumnBefore(
    table: HTMLTableElement,
    columnIndex: number,
    referenceColumnIndex: number
): void {
    moveColumn(table, columnIndex, referenceColumnIndex, "before");
}

/**
 * Mou una columna perquè quedi després de la columna de referència.
 *
 * @param table taula on es mourà la columna
 * @param columnIndex índex de la columna que es mourà
 * @param referenceColumnIndex índex de la columna de referència
 */
export function moveColumnAfter(
    table: HTMLTableElement,
    columnIndex: number,
    referenceColumnIndex: number
): void {
    moveColumn(table, columnIndex, referenceColumnIndex, "after");
}

/**
 * Mou una columna perquè sigui la primera de la taula.
 *
 * @param table taula on es mourà la columna
 * @param columnIndex índex de la columna que es mourà
 */
export function moveColumnToFirst(table: HTMLTableElement, columnIndex: number): void {
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

/**
 * Mou una columna perquè sigui l'última de la taula.
 *
 * @param table taula on es mourà la columna
 * @param columnIndex índex de la columna que es mourà
 */
export function moveColumnToLast(table: HTMLTableElement, columnIndex: number): void {
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

/**
 * Afegeix una fila a la posició indicada. Els índexs comencen per zero;
 * també es pot indicar l'índex posterior a l'última fila per afegir-la al final.
 *
 * @param table taula on s'afegirà la fila
 * @param rowIndex posició de la nova fila
 * @param values valors opcionals de les cel·les de la fila
 * @returns la fila afegida
 */
export function addRow(
    table: HTMLTableElement,
    rowIndex: number,
    values?: TableValue[]
): HTMLTableRowElement {
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

/**
 * Afegeix una columna a la posició indicada.
 * Si no es passen valors, les cel·les noves queden buides.
 *
 * @param table taula on s'afegirà la columna
 * @param columnIndex posició de la nova columna
 * @param values valors opcionals, un per cada fila existent
 */
export function addColumn(
    table: HTMLTableElement,
    columnIndex: number,
    values?: TableValue[]
): void {
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

/**
 * Esborra la fila de la posició indicada. Els índexs comencen per zero.
 *
 * @param table taula de la qual s'esborrarà la fila
 * @param rowIndex índex de la fila
 */
export function deleteRow(table: HTMLTableElement, rowIndex: number): void {
    const rows = getTableRows(table);
    validateIndex(rowIndex, rows.length, "L'índex de fila");
    table.deleteRow(rowIndex);
}

/**
 * Esborra la columna de la posició indicada a totes les files.
 *
 * @param table taula de la qual s'esborrarà la columna
 * @param columnIndex índex de la columna
 */
export function deleteColumn(table: HTMLTableElement, columnIndex: number): void {
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

/**
 * Mou una columna respecte d'una altra utilitzant les funcions del mòdul
 * d'elements del document.
 */
function moveColumn(
    table: HTMLTableElement,
    columnIndex: number,
    referenceColumnIndex: number,
    position: "before" | "after"
): void {
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
        } else {
            moveElementAfter(cell, referenceCell);
        }
    });
}

/**
 * Retorna les files de la taula i comprova que es puguin gestionar com una graella.
 * Les cel·les combinades no s'admeten perquè alteren els índexs de columna.
 */
function getTableRows(table: HTMLTableElement): HTMLTableRowElement[] {
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

/**
 * Retorna el nombre de columnes i comprova que totes les files tinguin la mateixa mida.
 */
function getColumnCount(table: HTMLTableElement): number {
    const rows = getTableRows(table);
    const columnCount = rows[0]?.cells.length ?? 0;
    if (rows.some(row => row.cells.length !== columnCount)) {
        throw new Error("La taula no té el mateix nombre de cel·les a totes les files.");
    }
    return columnCount;
}

/**
 * Retorna una fila existent després de validar-ne l'índex.
 */
function getRow(table: HTMLTableElement, rowIndex: number): HTMLTableRowElement {
    const rows = getTableRows(table);
    validateIndex(rowIndex, rows.length, "L'índex de fila");
    return rows[rowIndex];
}

/**
 * Crea una cel·la dins d'una fila i n'inicialitza el text.
 */
function createCell(
    row: HTMLTableRowElement,
    tagName: "td" | "th",
    value: TableValue
): HTMLTableCellElement {
    const cell = createElement(tagName, row);
    if (!(cell instanceof HTMLTableCellElement)) {
        throw new Error("No s'ha pogut crear una cel·la de la taula.");
    }
    cell.textContent = String(value);
    return cell;
}

/**
 * Comprova que una dimensió sigui un enter no negatiu.
 */
function validateDimension(value: number, name: string): void {
    if (!Number.isInteger(value) || value < 0) {
        throw new RangeError(`${name} ha de ser un enter no negatiu.`);
    }
}

/**
 * Comprova que les dades tinguin les dimensions indicades.
 */
function validateDataDimensions(
    data: TableData | undefined,
    rowCount: number,
    columnCount: number
): void {
    if (data === undefined) {
        return;
    }
    if (
        data.length !== rowCount ||
        data.some(row => row.length !== columnCount)
    ) {
        throw new RangeError("Les dimensions de les dades no coincideixen amb les de la taula.");
    }
}

/**
 * Comprova que els valors d'una fila coincideixin amb el nombre de columnes.
 */
function validateRowValues(values: TableValue[] | undefined, columnCount: number): void {
    if (values !== undefined && values.length !== columnCount) {
        throw new RangeError("Cal indicar un valor per cada columna de la taula.");
    }
}

/**
 * Comprova que un índex estigui dins del rang permès.
 */
function validateIndex(
    index: number,
    length: number,
    name: string,
    allowEnd = false
): void {
    const maxIndex = allowEnd ? length : length - 1;
    if (!Number.isInteger(index) || index < 0 || index > maxIndex) {
        throw new RangeError(`${name} està fora dels límits.`);
    }
}