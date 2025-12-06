import { raw } from './input.js';

const ex =
	`..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

const parse = i => i.split('\n').map(x => x.split(''));

const isMoveable = (y, x, grid) => {
	let count = 0;
	const yMin = y - 1 < 0 ? 0 : y - 1;
	const yMax = y + 1 < grid.length ? y + 1 : grid.length - 1;
	const xMin = x - 1 < 0 ? 0 : x - 1;
	const xMax = x + 1 < grid[0].length ? x + 1 : grid[0].length - 1;
	for (let j = yMin; j <= yMax; j++) {
		for (let i = xMin; i <= xMax; i++) {
			if (j === y && i === x) continue;
			if (grid[j][i] === '@') count++;
		}
	}
	return count < 4;
};

function countAccessibleTP(grid) {
	let tot = 0;
	const newGrid = [];
	for (let y = 0; y < grid.length; y++) {
		const newRow = [];
		for (let x = 0; x < grid[0].length; x++) {
			if (grid[y][x] === '@' && isMoveable(y, x, grid)) {
				newRow.push('.');
				tot++;
			} else newRow.push(grid[y][x]);
		}
		newGrid.push(newRow);
	}
	return [tot, newGrid];
}

function keepRemoving(grid) {
	let tot = 0;
	let workingGrid = grid;
	let stillRemoving = true;
	while (stillRemoving) {
		const [removed, newGrid] = countAccessibleTP(workingGrid);
		if (removed) workingGrid = newGrid;
		else stillRemoving = false;
		tot += removed;
	}
	return tot;
}

console.log(countAccessibleTP(parse(ex))[0]);
console.log(countAccessibleTP(parse(raw))[0]);

console.log(keepRemoving(parse(ex)));
console.log(keepRemoving(parse(raw)));