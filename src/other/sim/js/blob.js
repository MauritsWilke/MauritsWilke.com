class Blob {
	constructor(options) {
		this.size = options['size'] || 5;
		this.colour = options['colour'] || "#4287f5";
		this.angle = options['angle'] || Math.random() * 2 * Math.PI;
		this.pos = options['pos'] || [Math.floor(Math.random() * canvas.width) + 1, Math.floor(Math.random() * canvas.height) + 1];

		this.steps = 0;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI * 2, false);
		ctx.fillStyle = this.colour;
		ctx.fill();
	}

	update(ctx) {
		this.steps++;
		this.draw(ctx);
	}
}

export default Blob;