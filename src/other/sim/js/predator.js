import Blob from "./blob.js";
import { mod, checkCollision } from "./utils.js"

class Predator extends Blob {
	constructor(options) {
		super(options);
		this.maxSteps = options['maxSteps'] || 5000;
		this.notEaten = 0;
		this.maxNotEaten = 750;
		this.size = 7;
		this.colour = "#eb4034";

		this.genomes = {
			speed: 1.4,
		}
	}

	update(ctx, simulation) {
		const nearest = this.nearestPrey(simulation)
		if (!nearest) return;

		if (checkCollision(this.pos[0], this.pos[1], this.size, nearest.pos[0], nearest.pos[1], nearest.size)) {
			simulation.kill("preys", nearest);
			this.notEaten = 0;
		} else this.notEaten++

		if (this.notEaten > this.maxNotEaten) return simulation.kill("predators", this);

		this.pos[0] = mod(this.pos[0] + Math.cos(this.angle) * this.genomes.speed, canvas.width);
		this.pos[1] = mod(this.pos[1] + Math.sin(this.angle) * this.genomes.speed, canvas.height);

		super.update(ctx)
	}

	nearestPrey(simulation) {
		if (simulation.preys.size === 0) return simulation.finish();
		let nearest = [{}, Infinity];

		for (const prey of simulation.preys) {
			const dy = mod(prey.pos[1] - this.pos[1] + canvas.height / 2, canvas.height) - canvas.height / 2;
			const dx = mod(prey.pos[0] - this.pos[0] + canvas.width / 2, canvas.width) - canvas.width / 2;
			const distance = Math.sqrt(dy * dy + dx * dx)
			if (distance < nearest[1]) nearest = [prey, distance]
		}

		const dy = mod(nearest[0].pos[1] - this.pos[1] + canvas.height / 2, canvas.height) - canvas.height / 2;
		const dx = mod(nearest[0].pos[0] - this.pos[0] + canvas.width / 2, canvas.width) - canvas.width / 2;
		this.angle = Math.atan2(dy, dx)
		return nearest[0]
	}
}

export default Predator;