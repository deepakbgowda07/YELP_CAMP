/**
 * clusterMap.js
 * -----------------------------------------------------
 * Displays a clustered map of all campgrounds on the index page.
 *
 * Dependencies injected from EJS:
 *  - mapToken           (MapTiler API key)
 *  - campgroundsData    (array of campground objects with geometry)
 */

// Configure MapTiler SDK with your API key
maptilersdk.config.apiKey = mapToken;

/**
 * Initialize map centered on the USA.
 * The container ID must match <div id="cluster-map"> in index.ejs.
 */
const map = new maptilersdk.Map({
    container: 'cluster-map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: [-103.59179687498357, 40.66995747013945],
    zoom: 3
});


/* -----------------------------------------------------
   MAP LOADED → ADD CAMPGROND DATA + LAYERS
------------------------------------------------------ */
map.on('load', function () {

    /**
     * Add a GeoJSON data source for all campgrounds.
     * Clustering is handled by MapTiler automatically.
     */
    map.addSource('campgrounds', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: campgroundsData.map(campground => ({
                type: 'Feature',
                geometry: campground.geometry,
                properties: {
                    // For popups — fallback in case popUpMarkup missing
                    popUpMarkup:
                        campground.properties?.popUpMarkup ||
                        `<strong><a href="/campgrounds/${campground._id}">${campground.title}</a></strong>`
                }
            }))
        },
        cluster: true,
        clusterMaxZoom: 14, // Maximum zoom for clustering
        clusterRadius: 50   // Cluster radius in pixels
    });


    /* -----------------------------------------------------
       CLUSTERED POINTS LAYER
    ------------------------------------------------------ */
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        filter: ['has', 'point_count'], // only cluster points
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#00BCD4',  // < 10
                10, '#2196F3', // 10–30
                30, '#3F51B5' // > 30
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                10, 20,
                30, 25
            ]
        }
    });


    /* -----------------------------------------------------
       CLUSTER COUNT LABELS
    ------------------------------------------------------ */
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Noto Sans Regular'],
            'text-size': 12
        }
    });


    /* -----------------------------------------------------
       UNCLUSTERED (INDIVIDUAL) CAMPGROUND POINTS
    ------------------------------------------------------ */
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']], // points that are not clusters
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });


    /* -----------------------------------------------------
       CLICK EVENTS
    ------------------------------------------------------ */

    // Expand a cluster when clicked
    map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties.cluster_id;

        // Determine a zoom level that expands this cluster
        const zoom = await map.getSource('campgrounds').getClusterExpansionZoom(clusterId);

        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom
        });
    });

    // Open a popup when clicking an individual (unclustered) point
    map.on('click', 'unclustered-point', function (e) {
        const { popUpMarkup } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Fix for world-wrapping (if map is zoomed out wide)
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maptilersdk.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
    });


    /* -----------------------------------------------------
       HOVER EFFECTS (Change cursor to pointer)
    ------------------------------------------------------ */
    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });

});
