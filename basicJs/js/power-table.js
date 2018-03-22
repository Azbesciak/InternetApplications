const TABLE_ID = "power-table";

function getTable() {
    return document.querySelector(`#${TABLE_ID} tbody`);
}

function updateRowActions(row, rowNum) {
    row.cells[0].outerHTML = `<th scope='row'>${rowNum}</th>`;
    row.cells[3].innerHTML = `
    <span class="remove-power" onclick="removePower(${rowNum - 1})" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </span>`
}

function createEditableCell() {
    return `<div contenteditable="true" class="editable-cell"></div>`
}

function addPower() {
    const table = getTable();
    const row = table.insertRow(-1);
    row.insertCell(0);
    const powerNameCell = row.insertCell(1);
    powerNameCell.innerHTML = createEditableCell();
    row.insertCell(2).innerHTML = createEditableCell();
    row.insertCell(3);
    const rowNum = table.rows.length;
    updateRowActions(row, rowNum);
    powerNameCell.getElementsByClassName("editable-cell")[0].focus();

}

function removePower(index) {
    const table = getTable();
    table.deleteRow(index);
    for (let i = 0; i < table.rows.length; i++) {
        updateRowActions(table.rows[i], i + 1);
    }
}