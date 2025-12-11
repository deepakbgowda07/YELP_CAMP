/**
 * showPageMap.js
 * -----------------------------------------------------
 * Displays a single campground's location on a map.
 *
 * Dependencies injected from EJS:
 *  - mapToken        (MapTiler API Key)
 *  - campground      (campground object with geometry + title + location)
 */

// Configure MapTiler SDK with API key from EJS
maptilersdk.config.apiKey = mapToken;


/* -----------------------------------------------------
   MAP INITIALIZATION
------------------------------------------------------ */
/**
 * Creates a map centered on the campground's coordinates.
 * The container ID must match <div id="map"> in show.ejs.
 */
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: campground.geometry.coordinates, // [lng, lat]
    zoom: 10
});


/* -----------------------------------------------------
   MARKER + POPUP
------------------------------------------------------ */
/**
 * Places a marker at the campground's location.
 * When clicked, it shows a popup containing:
 *  - Campground name
 *  - Location text
 */
new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(`
                <h3>${campground.title}</h3>
                <p>${campground.location}</p>
            `)
    )
    .addTo(map);
