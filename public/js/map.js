// Set your MapTiler API key
maptilersdk.config.apiKey = mapToken;

// Initialize the map
const map = new maptilersdk.Map({
	container: 'map', // container's id or the HTML element to render the map
	style: maptilersdk.MapStyle.STREETS,
	center: [77.5946, 12.9716], // Starting position [lng, lat]
	zoom: 9, // Starting zoom level
});

// Create a marker and place it at the specified location
const marker = new maptilersdk.Marker({ color: 'red' })
	.setLngLat([77.5946, 12.9716]) // Coordinates for the marker [longitude, latitude]
	.addTo(map); // Add marker to the map

// Create a popup with content
const popup = new maptilersdk.Popup({ closeButton: true }).setHTML(
	'<h3>Marker Location</h3><p>Default Location</p>'
);

// Attach the popup to the marker
marker.setPopup(popup);

// Optionally, open the popup when the marker is clicked
marker.on('click', () => {
	popup.toggle(); // Toggle the popup visibility
});
