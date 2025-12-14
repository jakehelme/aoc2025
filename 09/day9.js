import { raw } from './input.js';

const ex =
	`7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

const parse = input => input.split('\n').map(x => x.split(',').map(Number));
const area = (a, b) => {
	const l = Math.abs(a[1] - b[1]) + 1;
	const w = Math.abs(a[0] - b[0]) + 1;
	return l * w;
};

const mergeOverlaps = (ranges, cuts) => {
	const arr = [...ranges, ...cuts];
	let n = arr.length;
	arr.sort((a, b) => a[0] - b[0]);
	let res = [];

	for (let i = 0; i < n; i++) {
		let start = arr[i][0];
		let end = arr[i][1];
		if (res.length > 0 && res[res.length - 1][1] >= end) {
			continue;
		}
		for (let j = i + 1; j < n; j++) {
			if (arr[j][0] <= end) {
				end = Math.max(end, arr[j][1]);
			}
		}
		res.push([start, end]);
	}
	return res;
};

const getGapInfo = (gRanges, cuts, isH) => {
	const toggles = [];
	if (isH) {
		for (const range of gRanges) {
			if (range[0] - range[1] === 0) {
				toggles.push(true);
			} else {
				const corners = cuts.filter(c => c[0][0] === range[0] || c[0][0] === range[1]);
				if (corners[0][0][1] === corners[1][0][1] || corners[0][1][1] === corners[1][1][1]) toggles.push(false); // U-shape
				else toggles.push(true); // S-shape
			}
		}
		return toggles;
	} else {
		for (const range of gRanges) {
			if (range[0] - range[1] === 0) {
				toggles.push(true);
			} else {
				const corners = cuts.filter(c => c[0][1] === range[0] || c[0][1] === range[1]);
				if (corners[0][0][0] === corners[1][0][0] || corners[0][1][0] === corners[1][1][0]) toggles.push(false); // U-shape
				else toggles.push(true); // S-shape
			}
		}
		return toggles;
	}
}

const fillGreenRanges = (arr, gapsMap) => {
	const fills = [];
	let isGreen = false;
	for (let i = 0; i < arr.length - 1; i++) {
		if (gapsMap[i]) {
			isGreen = !isGreen;
		}
		if (isGreen) {
			fills.push([arr[i][1], arr[i + 1][0]]);
		}
	}
	return fills.length ? mergeOverlaps([...arr, ...fills], []) : arr;
};

const intersect = (horizontal, vertical) => {
	horizontal.sort((a, b) => a[0] - b[0]);
	vertical.sort((a, b) => a[1] - b[1]);
	const y = horizontal[0][1];
	const x = vertical[0][0];
	return (
		y >= vertical[0][1] &&
		y <= vertical[1][1] &&
		x >= horizontal[0][0] &&
		x <= horizontal[1][0]
	);
}

const fitsWithin = (long, short) => {
	return short[0] >= long[0] && short[1] <= long[1];
}

function findLargestRect(reds) {
	let max = 0;
	for (let i = 0; i < reds.length - 1; i++) {
		for (let j = i + 1; j < reds.length; j++) {
			max = Math.max(max, area(reds[i], reds[j]));
		}
	}
	return max;
}

function findLargestInnerRect(reds) {
	const xMax = Math.max(...reds.map(x => x[0])) + 2;
	const yMax = Math.max(...reds.map(y => y[1])) + 2;
	const allHEdges = [];
	const allVEdges = [];
	let maxGreens = 0;
	for (let i = 0; i < reds.length; i++) {
		if (reds[i][0] === reds[(i + 1) % reds.length][0]) allVEdges.push([reds[i], reds[(i + 1) % reds.length]]);
		else allHEdges.push([reds[i], reds[(i + 1) % reds.length]]);
	}

	for (let i = 0; i < reds.length - 1; i++) {
		for (let j = i + 2; j < reds.length; j++) {
			const vertices = [reds[i], [reds[i][0], reds[j][1]], reds[j], [reds[j][0], reds[i][1]]];
			const topLeft = vertices.reduce((tl, p) => p[0] <= tl[0] && p[1] <= tl[1] ? p : tl, [Infinity, Infinity]);
			const botRight = vertices.reduce((tl, p) => p[0] >= tl[0] && p[1] >= tl[1] ? p : tl, [0, 0]);
			const boxHEdges = [[topLeft, [botRight[0], topLeft[1]]], [[topLeft[0], botRight[1]], botRight]];
			const boxVEdges = [[topLeft, [topLeft[0], botRight[1]]], [[botRight[0], topLeft[1]], botRight]];

			let allGreen = true;
			for (const [start, end] of boxHEdges) {
				const y = start[1];
				const xRange = [start[0], end[0]];
				let hGreen = allHEdges.filter(e => e[0][1] === y).map(e => [e[0][0], e[1][0]].sort((a, b) => a - b));
				const hvGreen = allVEdges.filter(e => intersect([[0, y], [xMax, y]], e));
				hGreen = mergeOverlaps(hGreen, hvGreen.map(e => [e[0][0], e[1][0]]));
				const final = getGapInfo(hGreen, hvGreen, true);
				hGreen = fillGreenRanges(hGreen, final);
				let edgeInGreen = false;
				for (const range of hGreen) {
					if (fitsWithin(range, xRange)) {
						edgeInGreen = true;
						break;
					}
				}
				allGreen = allGreen && edgeInGreen;
				console.log();
			}
			for (const [start, end] of boxVEdges) {
				const x = start[0];
				const yRange = [start[1], end[1]];
				let vGreen = allVEdges.filter(e => e[0][0] === x).map(e => [e[0][1], e[1][1]].sort((a, b) => a - b));
				const vhGreen = allHEdges.filter(e => intersect(e, [[x, 0], [x, yMax]]));
				vGreen = mergeOverlaps(vGreen, vhGreen.map(e => [e[0][1], e[1][1]]));
				const final = getGapInfo(vGreen, vhGreen, false);
				vGreen = fillGreenRanges(vGreen, final);
				let edgeInGreen = false;
				for (const range of vGreen) {
					if (fitsWithin(range, yRange)) {
						edgeInGreen = true;
						break;
					}
				}
				allGreen = allGreen && edgeInGreen;
				console.log();
			}

			if (allGreen) maxGreens = Math.max(maxGreens, (botRight[0] - topLeft[0] + 1) * (botRight[1] - topLeft[1] + 1));
		}
	}
	return maxGreens;
}
console.log(findLargestRect(parse(ex)));
console.log(findLargestRect(parse(raw)));
console.log(findLargestInnerRect(parse(ex)));
console.log(findLargestInnerRect(parse(raw)));
