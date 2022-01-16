const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
canvas.style.background = "#011627";

let particles = new Set();
let mouseDivider = 100;
let connnectionRadius = 120;
let particleDivider = 9000;
let minParticleSize = 2;
let maxParticleSize = 5;
let particleSpeed = 0.8;
let mouse = {
	x: null,
	y: null,
	radius: (canvas.height / mouseDivider) * (canvas.width / mouseDivider)
}

window.addEventListener('mousemove', (event) => [mouse.x, mouse.y] = [event.x, event.y]);
window.addEventListener('mouseout', () => [mouse.x, mouse.y] = [null, null]);
window.addEventListener('resize', () => {
	[canvas.width, canvas.height] = [innerWidth, innerHeight];
	mouse.radius = (canvas.height / mouseDivider) * (canvas.width / mouseDivider);
	init();
});

const random = (min, max) => Math.random() * (max - min) + min;
class Particle {
	constructor(pos, vel, size, colour) {
		this.pos = pos || [random(0, canvas.width), random(0, canvas.height)];
		this.vel = vel || [random(0, Math.PI * 2), particleSpeed];
		this.size = size || random(minParticleSize, maxParticleSize);
		this.colour = colour || "rgb(46, 196, 182)";
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI * 2);
		ctx.fillStyle = this.colour;
		ctx.fill();
	}

	update() {
		if (mouse.x && Math.hypot(mouse.x - this.pos[0], mouse.y - this.pos[1]) < mouse.radius + this.size) {
			if (mouse.x < this.pos[0] && this.pos[0] < canvas.width - this.size * 10) this.pos[0] += 10;
			if (mouse.x > this.pos[0] && this.pos[0] > this.size * 10) this.pos[0] -= 10;
			if (mouse.y < this.pos[1] && this.pos[1] < canvas.height - this.size * 10) this.pos[1] += 10
			if (mouse.y > this.pos[1] && this.pos[1] > this.size * 10) this.pos[1] -= 10;
		}

		if (this.pos[0] + this.size > canvas.width || this.pos[0] - this.size < 0) this.vel[0] = Math.PI - this.vel[0] + random(-0.3, 0.3);
		if (this.pos[1] + this.size > canvas.height || this.pos[1] - this.size < 0) this.vel[0] = this.vel[0] * -1 + random(-0.3, 0.3);
		this.pos = [this.pos[0] + Math.cos(this.vel[0]) * this.vel[1], this.pos[1] + Math.sin(this.vel[0]) * this.vel[1]];
		this.draw();
		this.connect();
	}

	connect() {
		particles.forEach(particle => {
			const distance = Math.hypot(particle.pos[1] - this.pos[1], particle.pos[0] - this.pos[0])
			if (distance < connnectionRadius) {
				ctx.strokeStyle = this.colour.replace(")", `, ${1 - distance / connnectionRadius})`);
				ctx.beginPath();
				ctx.moveTo(this.pos[0], this.pos[1]);
				ctx.lineTo(particle.pos[0], particle.pos[1]);
				ctx.stroke();
			}
		})
	}
}

function init() {
	particles = new Set();
	let numberOfParticles = (canvas.height * canvas.width) / particleDivider;
	for (let i = 0; i < numberOfParticles; i++) particles.add(new Particle())
}

function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	particles.forEach(particle => particle.update());
}

init();
animate();
document.body.height = window.innerHeight;