//#region Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

window.addEventListener('resize', () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});

document.addEventListener('keypress', event => {
	if (event.code === "Space") {
		window.open(canvas.toDataURL('png'), "_blank").focus()
	}
})

//#endregion
import Simulation from "./simulation.js";

let sim = new Simulation({ ctx: ctx, initPrey: 100, initPred: 10 });
setInterval(() => {
	if (sim.stopped) sim = new Simulation({ ctx: ctx, initPrey: 100, initPred: 10 });
}, 1000)