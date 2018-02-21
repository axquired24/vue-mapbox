Vue.component('ax-message', {
    template: '<div>A custom component!</div>'
});

Vue.component('ax-alert', {
    template: '<div>Hello im alert</div>'
});

// Vue.component('ax-render', {
//    render(createElm) {
//        return createElm('div', 'Hello Bro!');
//    }
// });

var app = new Vue({
    el: '#app',
    data: {
        appTitle: "<h2>Thematic Viewer</h2>",
        products: ["Socks"],
        selected: '',
        productOpts: [
            {
                "id": "5a817223718b25bf277abe37",
                "picture": "http://placehold.it/32x32",
                "name": "Ester Mullins"
            },
            {
                "id": "5a817223f58d1de40c6728cf",
                "picture": "http://placehold.it/32x32",
                "name": "Gaines Goodwin"
            }
        ],
        productSelected: '',
        mapDataUrl: "https://api.myjson.com/bins/aa0nx",
        mapProperty: {
            lat: -96,
            lng: 37.8,
            zoom: 4,
            mapData: {},
            details: [],
            densityTotal: 0
        },
        mapSelector: {
            mapTileLayer: "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
            mapID: 'map',
            mapWrapperID: 'mapWrapper'
        }
    },
    // mounted() {
    //     axios.get("https://api.myjson.com/bins/aa0nx")
    //         .then(response => {
    //         this.mapData = response.data;
    //     console.log(this.mapData);
    // })},
    methods: {
        loadMap: function() {
            showMapLoading(this.mapSelector);

            axios.get(this.mapDataUrl)
            .then(response => {
                this.mapProperty.mapData = response.data;

                this.mapProperty.details = _.map(response.data.features, function(item) {
                    return {
                        name: item.properties.name,
                        density: item.properties.density
                    }
                });

                this.mapProperty.details = _.sortBy(this.mapProperty.details, function(item) {
                    return item.density;
                }).reverse();

                this.mapProperty.densityTotal = _.sumBy(this.mapProperty.details, function(item) {
                    return item.density;
                }).toFixed(2)

                runLeafletjs(this.mapSelector, this.mapProperty);

                return this.mapProperty.mapData;
            })
            .catch(error => {
                console.log(error);
            })
        },
        selectBoxOnChange() {
            console.log("Hei im changed");
            axios.get("https://api.myjson.com/bins/ucr6l")
                .then(response => {
                    this.productOpts = response.data;
                    return this.productOpts
                })
                .catch(error => {
                        console.log(error);
                })
        },
        productOnChange() {
            console.log(this.productSelected.id)
        }
    }
});

// load map first
app.loadMap();

function clearMapContainer(mapSelector) {
    var mapID = mapSelector.mapID;
    var mapWrapperID = mapSelector.mapWrapperID;

    // Remove old map
    $('#' + mapWrapperID).html('<div id="' + mapID + '"></div>');
}

function showMapLoading(mapSelector) {
    var mapID = mapSelector.mapID;
    var mapWrapperID = mapSelector.mapWrapperID;

    console.log("Building Map ... ");

    // clear container
    clearMapContainer(mapSelector);

    // set loading txt
    $('#' + mapID).html('<br><h2 align="center">L O A D I N G ...</h2>');
}