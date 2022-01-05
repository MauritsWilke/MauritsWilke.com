import Predator from "./predator.js";
import Prey from "./prey.js";

class Simulation {
	stopped = false;
	preys = new Set();
	predators = new Set();
	mutations = 0;

	constructor(options) {
		if (!options['ctx']) throw new Error("CTX must be provided");
		this.maxBlobs = options['maxBlobs'] || 100;
		this.initPrey = options['initPrey'] || 1;
		this.initPred = options['initPred'] || 5;
		this.ctx = options['ctx'];
		this.mutationRate = options['mutationRate'] || 0.0004;

		this.init()
	}

	init() {
		for (let i = 0; i < this.initPrey; i++) this.preys.add(new Prey({}))
		for (let i = 0; i < this.initPred; i++) this.predators.add(new Predator({ colour: "#eb4034" }))
		this.animate();
	}

	animate() {
		if (this.stopped || this.predators.size === 0 || this.preys.size === 0) return this.finish();

		requestAnimationFrame(() => this.animate());
		this.ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
		this.update();
	}

	update() {
		this.preys.forEach(prey => { if (prey.steps >= prey.maxSteps) this.preys.delete(prey); else prey.update(this.ctx, this) })
		this.predators.forEach(pred => { if (pred.steps >= pred.maxSteps) this.predators.delete(pred); else pred.update(this.ctx, this) })

		this.updateStats()
	}

	finish() {
		this.ctx.font = "30px Arial";
		this.ctx.fillStyle = "WHITE"
		this.ctx.textAlign = "center";
		this.ctx.fillText(`Finished!\nPredators: ${this.predators.size}\nPreys: ${this.preys.size}`, canvas.width / 2, canvas.height / 2);
		this.stopped = true;
	}

	kill(type, blob) {
		this[type].delete(blob);
	}

	updateStats() {
		['preys', 'predators', 'mutations'].forEach(v => {
			if (!document.getElementById(v)) {
				const o = document.createElement('h5');
				o.id = v;
				document.getElementById('stats').appendChild(o)
			} else document.getElementById(v).innerText = `${v}: ${typeof this[v] === "object" ? this[v].size : this[v]}`
		})
	}
}

export default Simulation