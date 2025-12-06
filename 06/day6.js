import { raw } from './input.js';

const ex =
	`123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

const parse = input => input.split('\n').map((x, i, arr) => {
	const temp = x.trim().split(/\s+/);
	if (i < arr.length - 1) return temp.map(Number);
	return temp;
});

const reparse = input => input.split('\n').map(x => x.split(''));

function doHomework(rows) {
	let total = 0;
	for (let col = 0; col < rows[0].length; col++) {
		let result;
		if (rows[rows.length - 1][col] === '+') {
			result = 0;
			for (let row = 0; row < rows.length - 1; row++) {
				result += rows[row][col];
			}
		} else {
			result = 1;
			for (let row = 0; row < rows.length - 1; row++) {
				result *= rows[row][col];
			}
		}
		total += result;
	}
	return total;
}

function redoHomework(grid) {
	const results = [];
	let nums = [];
	for (let col = grid[0].length - 1; col >= 0; col--) {
		let num = '';
		for (let row = 0; row < grid.length - 1; row++) {
			let current = grid[row][col];
			if (current === ' ') continue;
			num = `${num}${grid[row][col]}`;
		}
		nums.push(+num);
		const reset = () => { col--; nums = []; };
		if (grid[grid.length - 1][col] === '+') {
			results.push(nums.reduce((tot, x) => tot + x, 0));
			reset()
		} else if (grid[grid.length - 1][col] === '*') {
			results.push(nums.reduce((tot, x) => tot * x, 1));
			reset();
		}
	}
	return results.reduce((tot, x) => tot + x, 0);
}

console.log(doHomework(parse(ex)));
console.log(doHomework(parse(raw)));

console.log(redoHomework(reparse(ex)));
console.log(redoHomework(reparse(raw)));