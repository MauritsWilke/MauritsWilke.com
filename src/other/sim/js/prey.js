import Blob from "./blob.js";
import { mod, mutate } from "./utils.js"

class Prey extends Blob {
	constructor(options) {
		super(options);
		this.maxSteps = options['maxSteps'] || Infinity;

		this.genomes = {
			speed: 1,
		}
	}

	update(ctx, simulation) {
		const nearest = this.nearestPred(simulation)
		if (!nearest) return;

		this.pos[0] = mod(this.pos[0] + Math.cos(this.angle) * this.genomes.speed, canvas.width);
		this.pos[1] = mod(this.pos[1] + Math.sin(this.angle) * this.genomes.speed, canvas.height);

		mutate(this, simulation)
		super.update(ctx)
	}

	nearestPred(simulation) {
		if (simulation.predators.size === 0) return simulation.finish();
		let nearest = [{}, Infinity];

		for (const pred of simulation.predators) {
			const dy = mod(pred.pos[1] - this.pos[1] + canvas.height / 2, canvas.height) - canvas.height / 2;
			const dx = mod(pred.pos[0] - this.pos[0] + canvas.width / 2, canvas.width) - canvas.width / 2;
			const distance = Math.sqrt(dy * dy + dx * dx)
			if (distance < nearest[1]) nearest = [pred, distance]
		}

		const dy = mod(nearest[0].pos[1] - this.pos[1] + canvas.height / 2, canvas.height) - canvas.height / 2;
		const dx = mod(nearest[0].pos[0] - this.pos[0] + canvas.width / 2, canvas.width) - canvas.width / 2;
		this.angle = Math.atan2(dy, dx) + Math.PI;
		return nearest[0]
	}
}

export default Prey;