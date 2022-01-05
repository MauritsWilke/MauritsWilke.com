class Blob {
	constructor(options) {
		this.name = "Dennis"
		this.size = options['size'] || 5;
		this.colour = options['colour'] || "#4287f5";
		this.angle = options['angle'] || Math.random() * 2 * Math.PI;
		this.pos = options['pos'] || [Math.floor(Math.random() * canvas.width) + 1, Math.floor(Math.random() * canvas.height) + 1];

		this.steps = 0;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI * 2);
		ctx.fillStyle = this.colour;
		ctx.fill();
	}

	update(ctx) {
		this.steps++;
		this.draw(ctx);
	}

	showInfo(x, y) {
		//#region card creation
		const infoCard = document.createElement('div')
		document.body.appendChild(infoCard)
		infoCard.style = `	position: absolute; 
							top: ${y}px; 
							left: ${x}px; 
							width: 170px;
							background-color: ${this.colour};
							overflow-wrap: break-word;
							border-radius: 5px;
							margin: 5px;`;

		const title = document.createElement('h3')
		title.style = "text-align: center"
		title.innerText = this.name;

		const content = [
			`🔷 &nbsp;Size: ${this.size}`,
			`&nbsp;📍 &ensp;Position: ${Math.round(this.pos[0])} ,${Math.round(this.pos[1])}`,
			`🦶 &nbsp;Steps: ${this.steps}`,
			`🧬 &nbsp;Genomes:`,
		]

		for (const gen in this.genomes) {
			content.push(`&emsp;&emsp; • ${gen}: ${this.genomes[gen].toFixed(2)}`)
		}

		const stats = document.createElement('ul')

		content.forEach(v => {
			const li = document.createElement('li');
			li.innerHTML = v;
			stats.appendChild(li);
		})
		stats.style = "margin: 5px; text-align: top; list-style-type: none;"

		const bottom = document.createElement('p');
		bottom.innerText = 'Auto closes in 5'
		bottom.style = `text-align: center; margin-bottom: 5px; margin-top: 5px;`

		infoCard.appendChild(title)
		infoCard.appendChild(stats)
		infoCard.appendChild(bottom)
		//#endregion

		console.log(infoCard.innerText)

		let s = 4;
		setInterval(() => {
			infoCard.children[2].innerText = infoCard.children[2].innerText.replace(/Auto closes in \d/g, `Auto closes in ${s--}`)
		}, 1000)
		setTimeout(() => { infoCard.remove() }, 5000)
		infoCard.addEventListener('click', () => infoCard.remove())
	}
}

export default Blob;