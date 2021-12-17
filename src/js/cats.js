const slideshows = [...document.getElementsByClassName("imageSlideshow")]

setInterval(async () => {
	for (image in slideshows) {
		let imageCount = slideshows[image].children[0].children[0].src.toLowerCase().match(/\d*\.jpg/)[0].replace(".jpg", "")
		if (+imageCount == 9) imageCount = 0
		imageCount++
		slideshows[image].children[0].children[0].src = `../images/${image == 0 ? "pippa" : "olly"}/${imageCount}.jpg`
	}
}, 5000)