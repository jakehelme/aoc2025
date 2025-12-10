import { raw } from './input.js';

const ex = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

const parse = input => input.split('\n').map(x => x.split(',').map(Number));

const dist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);

function makeShortestConnections(boxes, connections) {
	const distances = [];
	for (let i = 0; i < boxes.length - 1; i++) {
		for (let j = i + 1; j < boxes.length; j++) {
			distances.push({ d: dist(boxes[i], boxes[j]), j1: i, j2: j });
		}
	}

	distances.sort((a, b) => a.d - b.d);
	const circuits = [new Set([distances[0].j1, distances[0].j2])];
	for (let c = 1; c < connections; c++) {
		const closest = distances[c];
		let j1c = circuits.findIndex(circuit => circuit.has(closest.j1));
		let j2c = circuits.findIndex(circuit => circuit.has(closest.j2));

		if (j1c === j2c && j1c !== -1) {
			continue;
		} else if (j1c < 0 && j2c < 0) {
			circuits.push(new Set([closest.j1, closest.j2]));
		} else if (j1c >= 0 && j2c < 0) {
			circuits[j1c].add(closest.j2);
		} else if (j1c < 0 && j2c >= 0) {
			circuits[j2c].add(closest.j1);
		} else {
			circuits[j1c] = circuits[j1c].union(circuits[j2c]);
			circuits.splice(j2c, 1);
		}
	}
	circuits.sort((a, b) => b.size - a.size);
	return circuits[0].size * circuits[1].size * circuits[2].size;
}

function makeSingleConnection(boxes) {
	const distances = [];
	for (let i = 0; i < boxes.length - 1; i++) {
		for (let j = i + 1; j < boxes.length; j++) {
			distances.push({ d: dist(boxes[i], boxes[j]), j1: i, j2: j });
		}
	}

	distances.sort((a, b) => a.d - b.d);
	const circuits = boxes.map((_, i) => new Set([i]));
	let closest;
	for (let c = 0; c < distances.length; c++) {
		closest = distances[c];
		let j1c = circuits.findIndex(circuit => circuit.has(closest.j1));
		let j2c = circuits.findIndex(circuit => circuit.has(closest.j2));

		if (j1c !== j2c) {
			circuits[j1c] = circuits[j1c].union(circuits[j2c]);
			circuits.splice(j2c, 1);
		}

		if (circuits.length === 1) {
			break;
		}
	}

	return boxes[closest.j1][0] * boxes[closest.j2][0];
}

console.log(makeShortestConnections(parse(ex), 10));
console.log(makeShortestConnections(parse(raw), 1000));

console.log(makeSingleConnection(parse(ex)));
console.log(makeSingleConnection(parse(raw)));