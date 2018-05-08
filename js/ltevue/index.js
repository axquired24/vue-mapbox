var app = new Vue({
    el: '#app',
    data: {
        selected: '',
        isFilterVisible: false,
        vprogressbar: 80,
        vproggresbaropts: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        productOpts: defaultData.loadingOpts,
        productSelected: defaultData.defaultSelected,
        cartOpts: defaultData.defaultOpts,
        cartSelected: defaultData.defaultSelected,

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
        },

        pieChart : {
            data: defaultData.pie,
            wrapperID: 'pieChartWrapper',
            containerID: 'pieChart'
        }
    },
    mounted() {
        axios.get("https://api.myjson.com/bins/tr66d")
            .then(response => {
                var newVal = refreshValue(defaultData.defaultOpts, response.data);
                this.productOpts = newVal;

                return this.productOpts;
            })
            .catch(error => {
                console.log(error);
            })
        },
    methods: {
        toggleFilter: function() {
            this.isFilterVisible = this.isFilterVisible ? false : true;
        },
        mapBoxClass: function() {
            var retCls = this.isFilterVisible ? 'col-md-9' : 'col-md-12';
            return retCls;
        },
        loadMap: function () {
            showMapLoading(this.mapSelector);

            buildPieChart(this, axconfig);

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
            
            this.cartOpts = defaultData.loadingOpts;
            this.cartSelected = defaultData.defaultSelected;

            axios.get("https://api.myjson.com/bins/ucr6l")
                .then(response => {
                    console.log(response.data);
                    
                    var newVal = refreshValue(defaultData.defaultOpts, response.data);
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

// -------------
// - PIE CHART -
// -------------
// Get context with jQuery - using jQuery's .get() method.
// Create pie or douhnut chart
// You can switch between pie and douhnut using the method below.
// pieChart.Doughnut(PieData, pieOptions);
  // -----------------
  // - END PIE CHART -
  // -----------------

function refreshValue(defaultOpts, newOpts) {
    return defaultOpts.concat(newOpts);
}

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

function buildPieChart(app, axconfig){
    $('#' + app.pieChart.containerID).remove();
    $('#' + app.pieChart.wrapperID).html('<canvas id="' + app.pieChart.containerID +'" height="150"></canvas>');

    var pieChartCanvas = $('#' + app.pieChart.containerID).get(0).getContext('2d');
    var pieChart = new Chart(pieChartCanvas);

    pieChart.Doughnut(app.pieChart.data, axconfig.pieOptions);
}

app.loadMap();
buildPieChart(app, axconfig);