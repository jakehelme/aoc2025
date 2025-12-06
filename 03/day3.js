import { raw } from './input.js';

const ex =
	`987654321111111
811111111111119
234234234234278
818181911112111`;

const parse = i => i.split('\n').map(x => x.split(''));

function getHighestJoltage(input) {
	let tot = 0;
	for (const bank of input) {
		let max = 0;
		for (let i = 0; i < bank.length - 1; i++) {
			for (let j = i + 1; j < bank.length; j++) {
				max = Math.max(max, +`${bank[i]}${bank[j]}`);
			}
		}
		tot += max;
	}
	return tot;
}

function getMegaHighestJoltage(input) {
	let tot = 0;
	for (const bank of input) {
		let max = [];
		let batteries = bank.map(Number);
		for (let i = 0; i < 12; i++) {
			const highestOption = Math.max(...batteries.slice(0, batteries.length - 11 + i));
			const index = batteries.indexOf(highestOption);
			max.push(highestOption);
			batteries = batteries.slice(index + 1);
		}
		tot += +max.join('');
	}
	return tot;
}

console.log(getHighestJoltage(parse(ex)));
console.log(getHighestJoltage(parse(raw)));

console.log(getMegaHighestJoltage(parse(ex)));
console.log(getMegaHighestJoltage(parse(raw)));