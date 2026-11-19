import { createTable, fillTable } from "./TablesFuncs.js";
const rowCount = 6;
const columnCount = 6;
const initialPositions = [4, 2, 0, 2, null, 4];
const panel = document.getElementById("panel");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
if (!(panel instanceof HTMLElement) ||
    !(leftButton instanceof HTMLButtonElement) ||
    !(rightButton instanceof HTMLButtonElement)) {
    throw new Error("No s'han pogut inicialitzar els controls del panell.");
}
const table = createTable(panel, rowCount, columnCount, {
    "aria-label": "Panell animat de sis files i sis columnes"
});
let horizontalOffset = 0;
function renderPanel() {
    const data = Array.from({ length: rowCount }, () => Array.from({ length: columnCount }, () => ""));
    initialPositions.forEach((startColumn, rowIndex) => {
        if (startColumn === null) {
            return;
        }
        for (let arrow = 0; arrow < 2; arrow++) {
            const column = (startColumn + arrow + horizontalOffset + columnCount) % columnCount;
            data[rowIndex][column] = "<";
        }
    });
    fillTable(table, data);
}
function movePanel(direction) {
    horizontalOffset = (horizontalOffset + direction + columnCount) % columnCount;
    renderPanel();
}
leftButton.addEventListener("click", () => movePanel(-1));
rightButton.addEventListener("click", () => movePanel(1));
renderPanel();
//# sourceMappingURL=animatedPanel.js.map