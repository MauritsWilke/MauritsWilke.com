import Predator from "./predator.js";
import Prey from "./prey.js";

let simCount = 0;
class Simulation {
	stopped = false;
	preys = new Set();
	predators = new Set();
	mutations = 0;
	ctx;

	#simID = `Sim#${simCount}`;
	constructor(options) {
		this.maxBlobs = options['maxBlobs'] || 100;
		this.initPrey = options['initPrey'] || 1;
		this.initPred = options['initPred'] || 5;
		this.ctx = options['ctx'];
		this.mutationRate = options['mutationRate'] || 0.0004;
		this.preyOptions = options['preyOptions'] || {};
		this.predatorOptions = options['predatorOptions'] || {};

		this.canvas = options['canvas'] || { resize: true, background: "#2c2f33" };
		this.canvas.background ??= "#2c2f33";
		this.canvas.resize ??= true;
		this.clickRadius = 20;

		this.init()
	}

	init() {
		//#region Ugly HTML for stats
		const holderDiv = document.createElement('div');
		holderDiv.className = "simulation";
		holderDiv.id = this.#simID;
		holderDiv.style = "position: relative"
		simCount++

		const stats = document.createElement('div');
		stats.id = `Stats#${this.#simID}`;
		stats.style = `position: absolute; bottom: 0; left: 0; margin: ${this.canvas.width / 50}px;`;
		holderDiv.appendChild(stats)

		const canvas = document.createElement('canvas');
		canvas.id = "canvas";
		canvas.style = `border: ${this.canvas.border}; background: ${this.canvas.background};`;
		this.ctx = canvas.getContext('2d');
		canvas.height = this.canvas.resize ? document.documentElement.clientHeight : this.canvas.height;
		canvas.width = this.canvas.resize ? document.documentElement.clientWidth : this.canvas.width;

		canvas.addEventListener('dblclick', async (e) => {
			let img = new Image();
			await new Promise(r => img.onload = r, img.src = canvas.toDataURL())

			this.ctx.fillStyle = this.canvas.background;
			this.ctx.fillRect(0, 0, canvas.width, canvas.height);
			this.ctx.drawImage(img, 0, 0)

			window.open(canvas.toDataURL('png'), "_blank").focus()
		})

		canvas.addEventListener('click', async (e) => {
			const [x, y] = [e.clientX, e.clientY];
			new Set([...this.preys, ...this.predators]).forEach(v => {
				const dx = Math.abs(x - v.pos[0]);
				const dy = Math.abs(y - v.pos[1])
				const distance = Math.sqrt(dx * dx + dy * dy)
				if (distance < this.clickRadius) return v.showInfo(x, y)
			})
		})

		holderDiv.appendChild(canvas);

		if (this.canvas.resize) {
			window.addEventListener('resize', () => {
				canvas.width = innerWidth;
				canvas.height = innerHeight;
			});
		}
		document.body.appendChild(holderDiv)
		//#endregion
		for (let i = 0; i < this.initPrey; i++) this.preys.add(new Prey(this.preyOptions))
		for (let i = 0; i < this.initPred; i++) this.predators.add(new Predator(this.predatorOptions))
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
		this.ctx.font = `${canvas.width / 11}px Arial`;
		this.ctx.fillStyle = this.preys.size === 0 ? "RED" : "GREEN"; // "WHITE"
		this.ctx.textAlign = "center";
		this.ctx.fillText(`Predators: ${this.predators.size}\nPreys: ${this.preys.size}`, canvas.width / 2, canvas.height / 2);
		this.stopped = true;
	}

	kill(type, blob) {
		this[type].delete(blob);
	}

	updateStats() {
		['preys', 'predators', 'mutations'].forEach(v => {
			if (!document.getElementById(`${v}#${this.#simID}`)) {
				const o = document.createElement('h5');
				o.id = `${v}#${this.#simID}`;
				document.getElementById(`Stats#${this.#simID}`).appendChild(o)
			} else document.getElementById(`${v}#${this.#simID}`).innerText = `${v}: ${typeof this[v] === "object" ? this[v].size : this[v]}`
		})
	}

	delete() {
		document.getElementById(this.#simID).remove();
	}
}

export default Simulation