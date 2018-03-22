const TABLE_ID = "power-table";

function getTable() {
    return document.querySelector(`#${TABLE_ID} tbody`);
}


function updateRowActions(row, rowNum) {
    row.cells[0].outerHTML = `<th scope='row'>${rowNum}</th>`;
    row.cells[3].innerHTML = `<span class="remove-power" onclick="removePower(${rowNum-1})">&#8211</span>`
}

function addPower() {
    const table = getTable();
    const row = table.insertRow(-1);
    row.insertCell(0);
    const cell1 = row.insertCell(1);
    const cell2 = row.insertCell(2);
    row.insertCell(3);
    const rowNum = table.rows.length;
    cell1.innerHTML = " ";
    cell2.innerHTML = "  ";
    updateRowActions(row, rowNum)
}

function removePower(index) {
    const table = getTable();
    table.deleteRow(index);
    for (let i = 0; i < table.rows.length; i++) {
        try {
            updateRowActions(table.rows[i], i+1);
        } catch (e) {
            console.error(e, i)
        }
    }
}