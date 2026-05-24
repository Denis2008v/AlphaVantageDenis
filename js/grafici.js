$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    const symbol = params.get("symbol");
    $("#txtStock").text(symbol);

    let chart;

    $("#year").on("change", function () {
        loadData(symbol, $(this).val());
    });


    function loadData(symbol, year) {
        inviaRichiesta("GET", "http://localhost:3000/Chart")
            .fail(errore)
            .done(function (configRes) {
                const config = configRes[0].chartConfig;

                const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=MLMAQXWLDHBFYXPK`;

                inviaRichiesta("GET", url)
                    .fail(errore)
                    .done(function (dataRes) {
                        const data = dataRes["Monthly Time Series"];


                        const labels = [];
                        const values = [];

                        // Filtra per l'anno selezionato 
                        Object.keys(data).reverse().forEach(date => {
                            if (date.startsWith(year)) {
                                labels.push(date);
                                values.push(parseFloat(data[date]["4. close"]));
                            }
                        });

                        // Disegna il grafico
                        if (chart) chart.destroy();

                        chart = new Chart(document.getElementById("canvasGrafici"), {
                            type: config.type,
                            data: {
                                labels: labels,
                                datasets: [{
                                    ...config.dataset,
                                    label: `${symbol} - Prezzo Close`,
                                    data: values
                                }]
                            }
                        });
                    });
            });
    }



});

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}








/*
function loadData(symbol, year) {
    inviaRichiesta("GET", "http://localhost:3000/Chart")
        .fail(errore)
        .done(function (configRes) {
            const config = configRes[0].chartConfig;

            // inviaRichiesta("GET",`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=93ZG3E8WC7EDSGR3`)
            inviaRichiesta("GET", "http://localhost:3000/HistoricalData")
                .fail(errore) 
                .done(function (historicalRes) {

                    const symbolData = historicalRes[symbol];

                    const data = symbolData["Monthly Time Series"];
                    const labels = [];
                    const values = [];

                    // Filtraggio per l'anno
                    Object.keys(data).reverse().forEach(date => {
                        if (date.startsWith(year)) {
                            labels.push(date);
                            values.push(parseFloat(data[date]["4. close"]));
                        }
                    });

                    if (chart) chart.destroy();

                    chart = new Chart(document.getElementById("canvasGrafici"), {
                        type: config.type,
                        data: {
                            labels: labels,
                            datasets: [{
                                ...config.dataset,
                                label: `${symbol} - Prezzo Close`,
                                data: values
                            }]
                        }
                    });
                });
        });
}

*/