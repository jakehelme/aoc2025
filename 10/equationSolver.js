import glpk from 'glpk.js';

const Glpk = glpk();

export default function solve(A, b) {
	const numVars = A[0].length;

	const variables = Array.from({ length: numVars }, (_, i) => ({
		name: `x${i}`,
		coef: 1 // objective coefficient (minimize sum)
	}));

	const bounds = Array.from({ length: numVars }, (_, i) => ({
		name: `x${i}`,
		type: Glpk.GLP_LO, // lower bound only
		lb: 0
	}));

	const subjectTo = A.map((row, r) => ({
		name: `eq${r}`,
		vars: row.map((coef, c) => ({
			name: `x${c}`,
			coef
		})),
		bnds: {
			type: Glpk.GLP_FX,
			lb: b[r],
			ub: b[r]
		}
	}));

	const model = {
		name: 'min-sum-integer-solution',
		objective: {
			direction: Glpk.GLP_MIN,
			name: 'min_sum',
			vars: variables
		},
		subjectTo,
		bounds,
		generals: variables.map(v => v.name) // 👈 integer variables
	};

	const result = Glpk.solve(model, {
		msgLevel: Glpk.GLP_MSG_OFF
	});

	return result;
}
