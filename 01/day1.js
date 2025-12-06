const ex =
	`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

import { raw } from './input.js';

const parse = (y) => y.split('\n').map(x => x[0] === 'R' ? +x.substring(1) : -1 * +x.substring(1));

function countStopsOnZero(input) {
	const range = 100;
	let pos = 50;
	let count = 0;
	input.forEach(move => {
		pos = (pos + (move % range + range)) % range;
		if (!pos) count++;
	});
	return count;
}

function countMovesPastZero(input) {
	const range = 100;
	let pos = 50;
	let count = 0;
	input.forEach(move => {
		const fullLoops = Math.floor(Math.abs(move) / range);
		count += fullLoops;
		let newMove = move;
		if (fullLoops > 0) {
			newMove = move % range;
		}
		const newPos = pos + newMove;
		if ((newMove < 0 && pos && newPos <= 0) || (newMove > 0 && pos && newPos >= range)) count++;
		pos = (pos + (newMove % range + range)) % range;
	});
	return count;
}

console.log(countStopsOnZero(parse(ex)));
console.log(countStopsOnZero(parse(raw)));

console.log(countMovesPastZero(parse(ex)));
console.log(countMovesPastZero(parse(raw)));