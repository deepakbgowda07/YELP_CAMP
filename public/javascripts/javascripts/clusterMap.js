w// mapToken and campgroundsData are injected via index.ejs
maptilersdk.config.apiKey = mapToken;

document.addEventListener('DOMContentLoaded', function () {
    // Check if mapToken is defined and initialized
    if (typeof mapToken === 'undefined' || mapToken === 'your_maptiler_api_key_here' || mapToken === '') {
        console.error("MapTiler API Key is missing or invalid. Check .env file.");
        return;
    }

    const map = new maptilersdk.Map({
        container: 'cluster-map',
        style: maptilersdk.MapStyle.STREETS,
        center: [-103.59179687498357, 40.66995742189495], // Default Center (US)
        zoom: 3
    });

    map.on('load', function () {
        // Add a GeoJSON source for the campgrounds
        map.addSource('campgrounds', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: campgroundsData.map(camp => ({
                    type: 'Feature',
                    geometry: camp.geometry,
                    properties: {
                        id: camp._id,
                        title: camp.title,
                        popUpMarkup: camp.properties.popUpMarkup
                    }
                }))
            },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });

        // Layer for the cluster circles
        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6', // Blue for < 10 points
                    10,
                    '#f1f075', // Yellow for 10-25 points
                    25,
                    '#f28cb1' // Pink for > 25 points
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20, // Radius 20 for < 10
                    10,
                    30, // Radius 30 for 10-25
                    25,
                    40 // Radius 40 for > 25
                ]
            }
        });

        // Layer for the cluster count label
        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            },
            paint: {
                "text-color": "white"
            }
        });

        // Layer for unclustered points (individual campgrounds)
        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'campgrounds',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 8,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff'
            }
        });

        // Handle clicks on clusters
        map.on('click', 'clusters', function (e) {
            const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('campgrounds').getClusterExpansionZoom(
                clusterId,
                function (err, zoom) {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        // Handle clicks on unclustered points (for popups)
        map.on('click', 'unclustered-point', function (e) {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const popUpMarkup = e.features[0].properties.popUpMarkup;

            // Ensure correct pop-up placement
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new maptilersdk.Popup()
                .setLngLat(coordinates)
                .setHTML(popUpMarkup)
                .addTo(map);
        });

        // Change the cursor style when hovering over a cluster or unclustered point
        map.on('mouseenter', 'clusters', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', function () {
            map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'unclustered-point', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'unclustered-point', function () {
            map.getCanvas().style.cursor = '';
        });
    });
});

