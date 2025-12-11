maptilersdk.config.apiKey = mapToken;

// --- Helper function for reverse geocoding ---
async function getPlaceName(lngLat) {
    try {
        const results = await maptilersdk.geocoding.reverse(lngLat, { apiKey: mapToken });
        if (results.features && results.features.length > 0) {
            return results.features[0].place_name;
        }
    } catch (err) {
        console.error("Error reverse geocoding:", err);
    }
    return "Unknown location"; // Fallback
}

// --- Determine start coordinates and zoom ---
const onEditPage = typeof campground !== 'undefined';
const startCoords = onEditPage
    ? campground.geometry.coordinates
    : [-98.5795, 39.8283]; // Default: Center of US
const startZoom = onEditPage ? 8 : 3;

// --- Get the location input field ---
const locationInput = document.getElementById('location');

// --- Initialize the map ---
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: startCoords,
    zoom: startZoom
});

// --- Initialize the marker ---
const marker = new maptilersdk.Marker({
    draggable: true
})
    .setLngLat(startCoords)
    .addTo(map);

// --- Initialize the Geocoding search control ---
try {
    const geocodingControl = new maptilersdk.GeocodingControl({
        apiKey: mapToken,
        marker: false // We will use our own marker
    });

    map.addControl(geocodingControl, 'top-left');

    // --- EVENT LISTENERS ---

    // 1. When a search result is picked (LIVE UPDATE)
    geocodingControl.on('pick', (e) => {
        const coords = e.result.geometry.coordinates;
        const placeName = e.result.place_name;

        console.log('Search "pick" event:', placeName);
        marker.setLngLat(coords); // Move marker
        map.easeTo({ center: coords, zoom: 10 }); // Pan map
        locationInput.value = placeName; // <<<<<< THE LIVE UPDATE
    });

} catch (e) {
    console.error("Failed to load GeocodingControl. Did you add the CSS to boilerplate.ejs?", e);
}


// 2. When the map is clicked (LIVE UPDATE)
map.on('click', async (e) => {
    try {
        const coords = e.lngLat;
        console.log('Map click event at:', coords);
        marker.setLngLat(coords); // Move marker

        const placeName = await getPlaceName([coords.lng, coords.lat]);
        locationInput.value = placeName; // <<<<<< THE LIVE UPDATE
    } catch (err) {
        console.error("Error on map click:", err);
    }
});

// 3. When the marker is dragged (LIVE UPDATE)
marker.on('dragend', async (e) => {
    try {
        const coords = e.target.getLngLat();
        console.log('Marker drag event:', coords);

        const placeName = await getPlaceName([coords.lng, coords.lat]);
        locationInput.value = placeName; // <<<<<< THE LIVE UPDATE
    } catch (err) {
        console.error("Error on marker drag:", err);
    }
});

// --- Set initial input value ---
async function setInitialLocation() {
    // Only set default on NEW form
    if (!onEditPage) {
        console.log('Setting default location for new form...');
        const placeName = await getPlaceName(startCoords);
        locationInput.value = placeName;
    }
}

// Run the initial setup
setInitialLocation();
