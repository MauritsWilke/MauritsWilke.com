function mod(v, n) {
	return ((v % n) + n) % n
}

// Thx stackoverflow!
const checkCollision = (p1x, p1y, r1, p2x, p2y, r2) => ((r1 + r2) ** 2 > (p1x - p2x) ** 2 + (p1y - p2y) ** 2)

function mutate(blob, simulation) {

	for (const gen in blob.genomes) {
		if (Math.random() < simulation.mutationRate) {
			blob.genomes[gen] = blob.genomes[gen] + Math.random() / 2
			blob.colour = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
			simulation.mutations++;
		}
	}

	return blob
}

export {
	mod,
	checkCollision,
	mutate
}