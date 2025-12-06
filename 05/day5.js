import { raw } from './input.js'

const ex =
	`3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

const parse = input => input.split('\n\n').map((b, i) => {
	if (i) return b.split('\n').map(Number);
	return b.split('\n').map(r => r.split('-').map(Number));
});

function findFreshIngredients([freshRanges, availble]) {
	let freshCount = 0;
	for (const ing of availble) {
		for (const [min, max] of freshRanges) {
			if (ing >= min && ing <= max) {
				freshCount++;
				break;
			}
		}
	}
	return freshCount;
}

function findAllPossibleFreshIngredients([freshRanges]) {
	const sortedInts = freshRanges.map(range => [range[0], range[1]]).sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
	const mergedInts = [];
	mergedInts.push(sortedInts[0]);

	for (let i = 1; i < sortedInts.length; i++) {
		const lastMerged = mergedInts[mergedInts.length - 1];
		const current = sortedInts[i];
		if (current[0] <= lastMerged[1]) lastMerged[1] = Math.max(lastMerged[1], current[1]);
		else mergedInts.push(current);
	}
	return mergedInts.reduce((tot, range) => tot + range[1] - range[0] + 1, 0);
}

console.log(findFreshIngredients(parse(ex)));
console.log(findFreshIngredients(parse(raw)));

console.log(findAllPossibleFreshIngredients(parse(ex)));
console.log(findAllPossibleFreshIngredients(parse(raw)));