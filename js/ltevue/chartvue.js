var app = new Vue({
    el: '#app',
    data: {
        pieChart : {
            data: defaultData.pie,
            wrapperID: 'pieChartWrapper',
            containerID: 'pieChart'
        },
        chartMulti: [],
        pieDataUrl: "https://api.myjson.com/bins/e610p"
    },
    mounted() {
        },
    methods: {
        loadChart: function() {
            $('.loading-pie').show();
            $('.chart-content').hide();         

            axios.get(this.pieDataUrl)
                .then(response => {
                    this.chartMulti = response.data;
                    return this.chartMulti;
                }).then(chartMulti => {
                    _.each(chartMulti, function(item) {
                        var pieData = _.map(item.subwil, function(subwilItem) {
                            var pieColor = getRandomColor();
                            return {
                                value: subwilItem.percentage,
                                color: pieColor,
                                label: subwilItem.label
                            }
                        });
                        
                        var wrapperID = 'pieChartWrapper' + item.id;
                        var containerID = 'pieChart' + item.id;

                        // Show html element
                        $('.loading-pie').hide();
                        $('.chart-content').show();

                        // BuildChart
                        buildPieChart(pieData, axconfig, wrapperID, containerID);
                    });
                })
                .catch(error => {
                    console.log(error);
                });            
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

function buildPieChart(pieData, axconfig, wrapperID, containerID){
    $('#' + containerID).remove();
    $('#' + wrapperID).html('<canvas id="' + containerID +'" height="150"></canvas>');

    var pieChartCanvas = $('#' + containerID).get(0).getContext('2d');
    var pieChart = new Chart(pieChartCanvas);

    pieChart.Doughnut(pieData, axconfig.pieOptions);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// app.loadChart();
// buildPieChart(app, axconfig);