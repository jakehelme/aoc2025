import { raw } from './input.js';

const ex =
	`aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

const ex2 =
	`svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

const parse = input => input.split('\n').reduce((m, line) => {
	const match = line.split(/\:?\s/g);
	m[match[0]] = match.slice(1);
	return m;
}, {});

function findPathsCount(nodes, start, end, skip) {
	let tot = 0;
	const frontier = [start];

	while (frontier.length) {
		const current = frontier.shift();

		if (current === skip) continue;
		if (current === end) {
			tot++;
			continue;
		}

		for (const next of nodes[current] || []) {
			frontier.push(next);
		}
	}
	return tot;
}

function findPathsBetween(nodes, start, end) {
	let visitable = new Set([start]);
  let size = 0;
  while (visitable.size > size) {
    size = visitable.size;
		const newVisitable = new Set();
		for (const vn of visitable) {
			for (const next of nodes[vn] || []) {
				newVisitable.add(next);
			}
		}
		visitable = visitable.union(newVisitable);
  }

	const inverseNodes = {};
  for (const [node, outs] of Object.entries(nodes)) {
    if (!visitable.has(node)) continue;
    for (const out of outs) {
      if (!visitable.has(out)) continue;
      if (!inverseNodes[out]) inverseNodes[out] = [];
      inverseNodes[out].push(node);
    }
  }

	const pathsTo = { [start]: 1 };
  while (!pathsTo[end]) {
    if (!Object.keys(inverseNodes).length) return 0;
    for (const out in inverseNodes) {
      const ways = inverseNodes[out].map((i) => pathsTo[i]);
			const totWays = ways.reduce((tot, w) => tot + w, 0);
      if (!isNaN(totWays)) delete inverseNodes[out];
      pathsTo[out] = totWays;
    }		
  }
	return pathsTo[end];
}

function findPathsThroughDacAndFft(nodes) {
	const svr2dac = findPathsBetween(nodes, 'svr', 'dac');
	const dac2fft = findPathsBetween(nodes, 'dac', 'fft');
	const fft2out = findPathsBetween(nodes, 'fft', 'out');
	const svr2fft = findPathsBetween(nodes, 'svr', 'fft');
	const fft2dac = findPathsBetween(nodes, 'fft', 'dac');
	const dac2out = findPathsBetween(nodes, 'dac', 'out');

	return svr2dac * dac2fft * fft2out + svr2fft * fft2dac * dac2out;
}

console.log(findPathsCount(parse(ex), 'you', 'out'));
console.log(findPathsCount(parse(raw), 'you', 'out'));
console.log(findPathsThroughDacAndFft(parse(ex2)));
console.log(findPathsThroughDacAndFft(parse(raw)));

//367579641755680