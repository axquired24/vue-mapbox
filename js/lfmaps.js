function createLegendRange(densities) {
    // accepted format: [1000, 500, 200, 100, 50, 20, 10, 0]
    // 7 number with 1 zero (0)
    var max = _.max(densities);
    var sum = _.sum(densities);
    var rangeLength = 7;

    var avg = Math.floor(sum / densities.length);

    console.log("Max: " + max + " | Avg: " + avg);

    var range = [0];

    for (var i = 1; i <= rangeLength; i++) {
        range.push(avg * i);
    }

    return range.reverse();
    // return [1000, 500, 200, 100, 50, 20, 10, 0];
}

function runLeafletjs(mapSelector, data) {
    var mapTileLayer = mapSelector.mapTileLayer;
    var mapID = mapSelector.mapID;

    var lat = data.lat;
    var lng = data.lng;
    var zoom = data.zoom;
    var statesData = data.mapData;

    var densities = _.map(data.mapData.features, function (item) {
        return item.properties.density;
    });

    var lRange = createLegendRange(densities);
    var lGrades = lRange.slice();
    lGrades.reverse();

    const mapDensities = _.map(statesData.features, function(item) {
        return item.properties.density;
    });

    const maxDensity = _.max(mapDensities);

    // clear map from trash or old content
    clearMapContainer(mapSelector);

    // Leaflet JS
    var map = L.map(mapID).setView([lng, lat], zoom);

    L.tileLayer(mapTileLayer, {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.light'
    }).addTo(map);


    // control that shows state info on hover
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'lfinfo');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
            : 'Hover over a state');
    };

    info.addTo(map);


    // get color depending on population density value
    function getColor(d) {
        const range = lRange;

        return d > range[0] ? '#800026' :
            d > range[1]  ? '#BD0026' :
                d > range[2]  ? '#E31A1C' :
                    d > range[3]  ? '#FC4E2A' :
                        d > range[4]   ? '#FD8D3C' :
                            d > range[5]   ? '#FEB24C' :
                                d > range[6]   ? '#FED976' :
                                    '#FFEDA0';
    }

    function style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.density)
        };
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        info.update(layer.feature.properties);
    }

    var geojson;

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function eachFeature(e) {
        zoomToFeature(e);
        console.log(e);
        console.log(e.target.feature.properties.name)
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: eachFeature
        });
    }

    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'lfinfo lflegend'),
            grades = lGrades,
            labels = [],
            from, to;

        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map);
}