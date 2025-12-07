import { raw } from './input.js';

const ex =
	`.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

const parse = input => input.split('\n').map(y => y.split(''));

function countTachyonSplits(grid) {
	let splitCount = 0;
	let rays = [[0, Math.floor(grid[0].length / 2)]];
	for (let y = 0; y < grid.length - 1; y++) {
		const newRays = new Set();
		for (let rayIndex = 0; rayIndex < rays.length; rayIndex++) {
			const [ry, rx] = rays[rayIndex];
			const current = grid[ry][rx];
			if (current === '^') {
				splitCount++;
				newRays.add(`${ry + 1},${rx - 1}`);
				newRays.add(`${ry + 1},${rx + 1}`);
			} else {
				newRays.add(`${ry + 1},${rx}`);
			}

		}
		rays = Array.from(newRays).map(r => r.split(',').map(Number));
	}
	return splitCount;
}

const addOrIncrement = (timelines, newT, count) => {
	if (timelines[newT]) timelines[newT] += count;
	else timelines[newT] = count;
};

function countTachyonTimelines(grid) {
	let rays = {[`0,${Math.floor(grid[0].length / 2)}`]: 1};
	for (let y = 0; y < grid.length - 1; y++) {
		const newRays = {};
		for (const key of Object.keys(rays)) {
			const [ry, rx] = key.split(',').map(Number);
			const current = grid[ry][rx];
			if (current === '^') {
				addOrIncrement(newRays, `${ry + 1},${rx - 1}`, rays[key]);
				addOrIncrement(newRays, `${ry + 1},${rx + 1}`, rays[key]);
			} else {
				addOrIncrement(newRays, `${ry + 1},${rx}`, rays[key]);
			}
		}
		rays = newRays;
	}
	return Object.values(rays).reduce((tot, x) => tot + x, 0);
}

console.log(countTachyonSplits(parse(ex)));
console.log(countTachyonSplits(parse(raw)));

console.log(countTachyonTimelines(parse(ex)));
console.log(countTachyonTimelines(parse(raw)));