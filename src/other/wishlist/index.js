// TODO | Add a sorting by price
// TODO | Add a disclaimer bout money

const container = document.getElementById("container");

// THIS IS TOTALLY NOT STRAIGHT OUT OF THE DOCS
const wishlist = "https://mauritswilke.com/other/wishlist/wishlist.json";
let request = new XMLHttpRequest();
request.open('GET', wishlist);
request.responseType = 'json';
request.send();

request.onload = () => { for (const item of request.response.items) generateCard(item) };

function generateCard(data) {
	const card = document.createElement('div');
	card.className = "card";

	const title = document.createElement(`h2`);
	title.id = "title";

	const link = document.createElement(`a`);
	link.href = data?.url ?? "#";
	link.target = "_blank";
	link.rel = "noreferrer noopener"
	link.innerHTML = data?.name ?? "Title of Item";

	title.appendChild(link);
	card.appendChild(title);

	const description = document.createElement(`p`);
	description.id = "description";
	description.innerHTML = data?.description ?? "Description of Item";
	card.appendChild(description);

	const price = document.createElement(`p`);
	price.id = "price";
	price.innerHTML = data?.price ? `€${data.price.replace(".", ",")}` : "Price of Item";
	card.appendChild(price);

	const imageHolder = document.createElement(`div`);
	imageHolder.id = "imageHolder";

	const image = document.createElement("img");
	image.src = data?.image ?? "https://specialplantzundert.nl/wp-content/uploads/2020/06/not-found-image-15383864787lu.jpg";
	image.alt = data?.name ?? "Image description"

	imageHolder.appendChild(image);
	card.appendChild(imageHolder);

	container.appendChild(card);
}