const table = document.getElementById("magicSquare");
const form = document.getElementById("num");
const sum = document.getElementById("sum");

form.addEventListener('submit', (event) => {
	sum.innerHTML = sum.innerHTML.replace(" (Added one to size, only supporting odd squares)", "")
	if (form.elements[0].value) {
		if (form.elements[0].value % 2 === 0) {
			sum.innerHTML += " (Added one to size, only supporting odd squares)"
			generateOddMagicSquare(parseInt(form.elements[0].value) + 1)
		}
		else generateOddMagicSquare(form.elements[0].value)
	}
	event.preventDefault();
});

generateOddMagicSquare(3)

function generateOddMagicSquare(tableSize) {
	table.innerHTML = ""
	for (i = 0; i < tableSize; i++) {
		const row = table.insertRow(i);
		for (j = 0; j < tableSize; j++) row.insertCell(j);
	}

	setCell(0, ((Math.floor(tableSize / 2) + Math.floor(tableSize / 2)) / 2), 1, table)

	function setCell(row, cell, count, table) {
		if (count > tableSize * tableSize) return;
		let nextCoords;

		if (row !== 0 && cell !== tableSize - 1) {
			if (!checkInner(row - 1, cell + 1, table)) nextCoords = [row - 1, cell + 1];
			else nextCoords = [row + 1, cell]
		}
		else if (row === 0) {
			if (cell !== tableSize - 1) nextCoords = [tableSize - 1, cell + 1]
			else nextCoords = [row + 1, cell]
		}
		else nextCoords = [row - 1, 0]

		table.rows[row].cells[cell].innerHTML = count;
		if (table.rows[row].cells[cell].innerHTML % 2 === 0) table.rows[row].cells[cell].style["font-weight"] = "bold"
		if (nextCoords) setCell(nextCoords[0], nextCoords[1], count + 1, table)
	}

	function checkInner(row, cell, table) {
		return table.rows?.[row]?.cells?.[cell]?.innerHTML ? true : false;
	}

	let total = 0;
	for (cell of table.rows[0].cells) total += parseInt(cell.innerHTML)
	sum.innerHTML = sum.innerHTML.replace(/\d+/gm, total)
}