import { raw } from './input.js';

const parse = input => {
	const splits = input.split('\n\n').map((block, i, arr) => {
		if (i < arr.length - 1) {
			return block.split('\n').slice(1).map(r => r.split(''));
		}
		return block.split('\n').map(l => l.split(/\:?\s/));
	});
	const grids = splits.splice(splits.length - 1).flat().map(g => {
		const obj = {};
		[obj.w, obj.h] = g[0].split('x').map(Number);
		obj.fitCounts = g.slice(1).map(Number);
		return obj;
	})

	return { shapes: splits, grids };
};

function tryFitPresents({shapes, grids}) {
	const maxShapeSize = 9;
	let tot = 0;
	for (const grid of grids) {
		const area = grid.h * grid.w;
		const maxSpaceUsed = grid.fitCounts.reduce((t, x) => t + x, 0) * maxShapeSize;
		if (maxSpaceUsed <= area) tot++;
	}

	return tot;

}

console.log(tryFitPresents(parse(raw)));