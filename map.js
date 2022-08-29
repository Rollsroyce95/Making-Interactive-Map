const myMap = L.map('map', {
		center: [33.787914,-117.853104],
		zoom: 12,
		})
		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '12',
		}).addTo(myMap);

		// create and add geolocation marker
		const marker = L.marker([33.787914,-117.853104])
		marker.addTo(myMap)
	

	// add business markers
	
	    const chapmanCb= L.marker([33.788467,-117.856002]).bindPopup('Chapman Crafted B')
	    const goldenRd= L.marker([33.795613,-117.885171]).bindPopup('Golden Road Brewing')	
	    const greenCbc= L.marker([33.826116, -117.864061]).bindPopup('Green Cheek Beer Company')	
	    const nobleAW= L.marker([33.808533,-117.88275]).bindPopup('Noble Ale Works')	
	    const bottleLb= L.marker([33.849427,-117.859741]).bindPopup('Bottle Logic Brewing')	
	
	    const Breweries = L.layerGroup([chapmanCb, goldenRd, greenCbc, nobleAW, bottleLb]).addTo(myMap)
// get coordinates via geolocation api
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
    {
    const marker = L.marker([33.787914, -117.853104])
		marker.addTo(myMap).bindPopup('<p1><b>You Are Here</b><br></p1>').openPopup()
}
	return [pos.coords.latitude, pos.coords.longitude]
    
}

// get foursquare businesses
async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3tM/CXWC5N7D2CTb47okOM0Wlujw0GVFaiPgGHXgzPog='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch('https://api.foursquare.com/v3/places/search?query=brewery&ll=33.787914%2C-117.853104&limit=5', options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}

// process foursquare array
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

// event handlers
// window load
window.onload = async () => {
	const coords = await getCoords()
	console.log(coords)
	myMap.coordinates = coords
	
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})
