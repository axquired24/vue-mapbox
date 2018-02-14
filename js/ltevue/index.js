var defaultVal = {
    loadingOpts: [
        {
            "id": "semua",
            "picture": "http://placehold.it/32x32",
            "name": "Loading..."
        }
    ],
    defaultOpts: [
        {
            "id": "semua",
            "picture": "http://placehold.it/32x32",
            "name": "Semua"
        }
    ],
    defaultSelected: {
        id: 'semua'
    }
}

var app = new Vue({
    el: '#app',
    data: {
        selected: '',
        vprogressbar: 80,
        vproggresbaropts: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        productOpts: defaultVal.loadingOpts,
        productSelected: defaultVal.defaultSelected,
        cartOpts: defaultVal.defaultOpts,
        cartSelected: defaultVal.defaultSelected,

        mapDataUrl: "https://api.myjson.com/bins/aa0nx",
        mapProperty: {
            lat: -96,
            lng: 37.8,
            zoom: 4,
            mapData: {},
        },
        mapSelector: {
            mapTileLayer: "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
            mapID: 'map',
            mapWrapperID: 'mapWrapper'
        }
    },
    mounted() {
        axios.get("https://api.myjson.com/bins/tr66d")
            .then(response => {
                var newVal = refreshValue(defaultVal.defaultOpts, response.data);
                this.productOpts = newVal;

                return this.productOpts;
            })
            .catch(error => {
                console.log(error);
            })
        },
    methods: {
        loadMap: function () {
            showMapLoading(this.mapSelector);

            axios.get(this.mapDataUrl)
                .then(response => {
                    this.mapProperty.mapData = response.data;

                    return this.mapProperty.mapData;
                })
                .then(nodata => {
                    runLeafletjs(this.mapSelector, this.mapProperty);
                })
                .catch(error => {
                    console.log(error);
                })
        },
        selectBoxOnChange() {
            console.log("Hei im changed");
            
            this.cartOpts = defaultVal.loadingOpts;
            this.cartSelected = defaultVal.defaultSelected;

            axios.get("https://api.myjson.com/bins/ucr6l")
                .then(response => {
                    console.log(response.data);
                    
                    var newVal = refreshValue(defaultVal.defaultOpts, response.data);
                    // reset to default value
                    this.cartOpts = newVal;

                    return this.cartOpts
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

function refreshValue(defaultOpts, newOpts) {
    return defaultOpts.concat(newOpts);
}