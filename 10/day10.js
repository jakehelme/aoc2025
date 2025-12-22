import { raw } from './input.js';
import solve from './equationSolver.js';

const ex =
	`[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

const parse = input => input.split('\n').map(line => {
	const lights = line.match(/\[(.*)\]/)[1];
	const buttons = line.match(/\((\d+(?:,\d+)*)\)/g)
		.map(g => g.substring(1, g.length - 1))
		.map(nums => nums.match(/\d+/g)
			.map(Number));
	const joltages = line.match(/\{(.*)\}/)[1].split(',').map(Number);
	return { lights, buttons, joltages };
});

const tryLightButtons = (lights, buttons) => {
	const results = new Set();
	for (let i = 0; i < buttons.length; i++) {
		const result = lights.split('');
		for (const light of buttons[i]) {
			result[light] = result[light] === '#' ? '.' : '#';
		}
		results.add(result.join(''));
	}
	return results;
};

function turnOnMachines(machines) {
	let tot = 0;
	for (const { lights: lightsTarget, buttons } of machines) {
		let res = tryLightButtons('.'.repeat(lightsTarget.length), buttons);
		let found = res.has(lightsTarget);
		let buttonPress = 1;
		while (!found) {
			buttonPress++;
			let newResults = new Set();
			for (const l of res.values()) {
				const result = tryLightButtons(l, buttons)
				newResults = newResults.union(result);
			}
			res = newResults;
			found = res.has(lightsTarget);
		}
		tot += buttonPress;
	}
	return tot;
}

function alignJoltages(machines) {
	let tot = 0;
	for (const machine of machines) {
		const b = machine.joltages;
		const A = Array.from({ length: b.length }, () => (Array.from({ length: machine.buttons.length }, () => 0)));
		for (let row = 0; row < A.length; row++) {
			for (let col = 0; col < A[0].length; col++) {
				if (machine.buttons[col].some(i => i === row)) {
					A[row][col] = 1;
				}
			}
		}

		const results = solve(A, b);
		tot += Object.values(results.result.vars).reduce((tot, i) => tot + i, 0);
	}

	return tot;
}

console.log(turnOnMachines(parse(ex)));
console.log(turnOnMachines(parse(raw)));

console.log(alignJoltages(parse(ex)));
console.log(alignJoltages(parse(raw)));
