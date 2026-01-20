const lat = coordinates[0];
const lng = coordinates[1];

const map = L.map('map').setView([lat, lng], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

L.marker([lat, lng]).addTo(map).bindPopup('📍 Location').openPopup();
console.log('Coordinates from DB:', coordinates);
