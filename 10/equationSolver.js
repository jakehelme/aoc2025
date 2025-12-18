const glpk = require('glpk.js')();

function solve(A, b) {
	const numVars = A[0].length;

	const variables = Array.from({ length: numVars }, (_, i) => ({
		name: `x${i}`,
		coef: 1 // objective coefficient (minimize sum)
	}));

	const bounds = Array.from({ length: numVars }, (_, i) => ({
		name: `x${i}`,
		type: glpk.GLP_LO, // lower bound only
		lb: 0
	}));

	const subjectTo = A.map((row, r) => ({
		name: `eq${r}`,
		vars: row.map((coef, c) => ({
			name: `x${c}`,
			coef
		})),
		bnds: {
			type: glpk.GLP_FX,
			lb: b[r],
			ub: b[r]
		}
	}));

	const model = {
		name: 'min-sum-integer-solution',
		objective: {
			direction: glpk.GLP_MIN,
			name: 'min_sum',
			vars: variables
		},
		subjectTo,
		bounds,
		generals: variables.map(v => v.name) // 👈 integer variables
	};

	const result = glpk.solve(model, {
		msgLevel: glpk.GLP_MSG_OFF
	});

	return result;
}

module.exports = solve;