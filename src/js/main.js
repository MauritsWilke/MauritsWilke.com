const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
canvas.style.background = "#011627";
window.addEventListener('resize', () => {
	[canvas.width, canvas.height] = [innerWidth, innerHeight];
	mouse.radius = (canvas.height / mouseDivider) * (canvas.width / mouseDivider);
	update();
});

let particles = new Set();
const mouseDivider = 100;
const connnectionRadius = 120;
const particleDivider = 9000;
const minParticleSize = 2;
const maxParticleSize = 5;
const particleSpeed = 0.8;
const maxParticles = 500;
let mouse = {
	x: null,
	y: null,
	radius: (canvas.height / mouseDivider) * (canvas.width / mouseDivider),
	lastMoved: 0
}

window.addEventListener('mousemove', (event) => [mouse.x, mouse.y, mouse.lastMoved] = [event.pageX, event.pageY, Date.now()]);
window.addEventListener('mouseout', () => [mouse.x, mouse.y] = [null, null]);
window.addEventListener('dblclick', (event) => {
	particles.forEach(particle => {
		if (Math.hypot(particle.pos[0] - event.pageX, particle.pos[1] - event.pageY) < mouse.radius * 3) {
			particle.vel[1] *= 4.5;
			particle.vel[0] = Math.atan2(particle.pos[1] - event.pageY, particle.pos[0] - event.pageX);
		}
	})
})
window.addEventListener('touchmove', (event) => {
	const evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
	const touch = evt.touches[0] || evt.changedTouches[0];
	[mouse.x, mouse.y] = [touch.pageX, touch.pageY]
})

const random = (min, max) => Math.random() * (max - min) + min;
class Particle {
	constructor(pos, vel, size, colour) {
		this.pos = pos || [random(0, canvas.width), random(0, canvas.height)];
		this.vel = vel || [random(0, Math.PI * 2), particleSpeed];
		this.size = size || random(minParticleSize, maxParticleSize);
		this.colour = colour || "rgb(46, 196, 182)";
		this.velStrive = this.vel[1];
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI * 2);
		ctx.fillStyle = this.colour;
		ctx.fill();
	}

	update() {
		if (this.vel[1] > this.velStrive) this.vel[1] -= 0.04
		if (this.vel[1] < this.velStrive) this.vel[1] = this.velStrive;
		const displacement = 10;
		const distance = Math.hypot(mouse.x - this.pos[0], mouse.y - this.pos[1]);
		if (mouse.x && Date.now() - mouse.lastMoved < 300 && distance < mouse.radius + this.size) {
			if (mouse.x < this.pos[0] && this.pos[0] < canvas.width - this.size * 10) this.pos[0] += displacement;
			if (mouse.x > this.pos[0] && this.pos[0] > this.size * 10) this.pos[0] -= displacement;
			if (mouse.y < this.pos[1] && this.pos[1] < canvas.height - this.size * 10) this.pos[1] += displacement;
			if (mouse.y > this.pos[1] && this.pos[1] > this.size * 10) this.pos[1] -= displacement;
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
	let numberOfParticles = Math.round((canvas.height * canvas.width) / particleDivider);
	while (particles.size < numberOfParticles && particles.size <= maxParticles) particles.add(new Particle())
}

function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	particles.forEach(particle => particle.update());
}

function update() {
	const newAmount = Math.round((canvas.height * canvas.width) / particleDivider);
	if (particles.size > newAmount) particles = new Set([...Array.from(particles)].slice(0, newAmount))
	if (particles.size < newAmount) while (particles.size < newAmount && particles.size <= maxParticles) particles.add(new Particle())

	particles.forEach(particle => {
		if (particle.pos[0] + particle.size > canvas.width || particle.pos[0] - particle.size < 0 || particle.pos[1] + particle.size > canvas.height || particle.pos[1] - particle.size < 0) particle.pos = [random(0, canvas.width), random(0, canvas.height)]
	});
}

init();
animate();
document.body.height = window.innerHeight;