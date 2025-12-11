/**
 * formMap.js
 * -----------------------------------------------------
 * Handles interactive map functionality on:
 *  - New Campground page
 *  - Edit Campground page
 *
 * Features:
 *  - Draggable marker
 *  - Click-to-update location
 *  - Reverse geocoding for automatic place names
 *  - Search bar (GeocodingControl) to update map + marker
 *  - Auto-fill the "location" input field
 */

// Configure MapTiler with API key passed from EJS
maptilersdk.config.apiKey = mapToken;


/* -----------------------------------------------------
   Helper: Reverse Geocode → Convert Coordinates to Place Name
------------------------------------------------------ */
async function getPlaceName(lngLat) {
    try {
        const results = await maptilersdk.geocoding.reverse(lngLat, { apiKey: mapToken });

        if (results.features && results.features.length > 0) {
            return results.features[0].place_name;
        }
    } catch (err) {
        console.error("Error reverse geocoding:", err);
    }

    // Fallback in case geocoder fails
    return "Unknown location";
}


/* -----------------------------------------------------
   Determine if we're on:
   - Edit Page (campground object exists)
   - New Page (campground undefined)
------------------------------------------------------ */
const onEditPage = typeof campground !== 'undefined';

// Starting coordinates + zoom
const startCoords = onEditPage
    ? campground.geometry.coordinates
    : [-98.5795, 39.8283]; // Default center (USA)
const startZoom = onEditPage ? 8 : 3;


/* -----------------------------------------------------
   DOM Reference
------------------------------------------------------ */
const locationInput = document.getElementById('location');


/* -----------------------------------------------------
   MAP INITIALIZATION
------------------------------------------------------ */
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: startCoords,
    zoom: startZoom
});


/* -----------------------------------------------------
   MARKER INITIALIZATION (Draggable)
------------------------------------------------------ */
const marker = new maptilersdk.Marker({
    draggable: true
})
    .setLngLat(startCoords)
    .addTo(map);


/* -----------------------------------------------------
   GEOCODING SEARCH BAR (Top-left)
------------------------------------------------------ */
try {
    const geocodingControl = new maptilersdk.GeocodingControl({
        apiKey: mapToken,
        marker: false // We manage marker manually
    });

    map.addControl(geocodingControl, 'top-left');

    /**
     * When a search result is selected:
     *  - Move the marker
     *  - Pan map
     *  - Update live location input
     */
    geocodingControl.on('pick', (e) => {
        const coords = e.result.geometry.coordinates;
        const placeName = e.result.place_name;

        console.log('Search result:', placeName);

        marker.setLngLat(coords);
        map.easeTo({ center: coords, zoom: 10 });
        locationInput.value = placeName; // LIVE UPDATE
    });

} catch (err) {
    console.error("Failed to load GeocodingControl. Did you include the CSS?", err);
}


/* -----------------------------------------------------
   MAP CLICK EVENT → Move Marker + Update Location
------------------------------------------------------ */
map.on('click', async (e) => {
    try {
        const coords = e.lngLat;

        console.log("Map clicked:", coords);
        marker.setLngLat(coords);

        const placeName = await getPlaceName([coords.lng, coords.lat]);
        locationInput.value = placeName; // LIVE UPDATE
    } catch (err) {
        console.error("Error on map click:", err);
    }
});


/* -----------------------------------------------------
   MARKER DRAG → Live Location Update
------------------------------------------------------ */
marker.on('dragend', async (e) => {
    try {
        const coords = e.target.getLngLat();

        console.log("Marker dragged:", coords);

        const placeName = await getPlaceName([coords.lng, coords.lat]);
        locationInput.value = placeName; // LIVE UPDATE
    } catch (err) {
        console.error("Error on marker drag:", err);
    }
});


/* -----------------------------------------------------
   INITIAL PLACE NAME (For NEW Form Only)
------------------------------------------------------ */
async function setInitialLocation() {
    if (!onEditPage) {
        console.log("Setting default location via reverse geocoding...");
        const placeName = await getPlaceName(startCoords);
        locationInput.value = placeName;
    }
}

// Initialize default location (only for create form)
setInitialLocation();
