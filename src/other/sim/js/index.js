import Simulation from "./simulation.js";

const simSettings = {
	initPrey: 10,
	initPred: 1,
	// canvas: {
	// 	resize: false,
	// 	width: 278,
	// 	height: 260,
	// 	border: "solid 1px red"
	// },
	// preyOptions: {
	// 	// showView: true,
	// 	genomes: {
	// 		view: 50
	// 	}
	// }
}

new Simulation(simSettings)

// let simsRun = 0;
// let sims = new Set();
// for (let i = 0; i < 24; i++) sims.add(new Simulation(simSettings));

// setInterval(() => {
// 	sims.forEach(sim => {
// 		if (sim.stopped) {
// 			sims.delete(sim);
// 			sim.delete()
// 			sims.add(new Simulation(simSettings))
// 			simsRun++;
// 			console.log(simsRun)
// 		}
// 	})
// }, 5000)