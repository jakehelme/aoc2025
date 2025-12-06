import { raw } from './input.js';

const ex = '11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124';

const parse = raw => raw.split(',').map(x => x.split('-').map(Number));

function findInvalidIds(input) {
	let invalidsSum = 0;
	for (const range of input) {
		for (let i = range[0]; i <= range[1]; i++) {
			const str = `${i}`;
			if (str.length % 2 === 0) {
				const splits = [str.substring(0, str.length / 2), str.substring(str.length / 2)];
				if (splits[0] === splits[1]) invalidsSum += i;
			}
		}
	}
	return invalidsSum;
}

function findMoreInvalidIds(input) {
	let invalidsSum = 0;
	for (const range of input) {
		for (let i = range[0]; i <= range[1]; i++) {
			const str = `${i}`;
			for (let snipLength = 1; snipLength <= str.length / 2; snipLength++) {
				if (str.length % snipLength) continue;
				const snip = str.substring(0, snipLength);
				let matching = false;
				for (let snipIndex = snipLength; snipIndex < str.length; snipIndex += snipLength) {
					if (snip !== str.substring(snipIndex, snipIndex + snipLength)) {
						matching = false;
						break;
					} else {
						matching = true;
					}
				}
				if (matching) {
					invalidsSum += i;
					break;
				}
			}
		}
	}
	return invalidsSum;
}

console.log(findInvalidIds(parse(ex)));
console.log(findInvalidIds(parse(raw)));

console.log(findMoreInvalidIds(parse(ex)));
console.log(findMoreInvalidIds(parse(raw)));