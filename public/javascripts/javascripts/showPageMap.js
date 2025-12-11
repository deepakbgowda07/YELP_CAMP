maptilersdk.config.apiKey = mapToken; // FIXED: Use MapTiler SDK and mapToken variable

const map = new maptilersdk.Map({ // FIXED: Use maptilersdk.Map
    container: 'map',
    style: maptilersdk.MapStyle.STREETS, // FIXED: Use a MapTiler style
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new maptilersdk.NavigationControl({ position: 'top-left' })); // FIXED: Use maptilersdk.NavigationControl


new maptilersdk.Marker({ color: "#FF0000" }) // FIXED: Use maptilersdk.Marker
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 }) // FIXED: Use maptilersdk.Popup
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)