/*
CHIAVI

93ZG3E8WC7EDSGR3
5GL8HD38YJQ677FF
A9B54YJ0ZMY29NB7
MLMAQXWLDHBFYXPK
*/
//let URL = "http://localhost:3000/GlobalQuotes"
//let URL2 = "http://localhost:3000/Companies"

let URL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="

let URL2 = "https://www.alphavantage.co/query?function=OVERVIEW&symbol="

let StockSelezionata
let richiestaGiaEffetuata = false
$(document).ready(function () {

    caricaPrecedente()

    // MENU
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("menuDisplayed");
    });


    // SELEZIONAMENTO SIMBOLI
    $("#formSelect").on("change", function () {
        let simbolo = $(this).val();
        console.log(simbolo);
        StockSelezionata = simbolo
        sessionStorage.setItem("simbolo", simbolo)
        ricavaDati(simbolo)


    })


    // BUTTONE MAPPA
    $("#btnMappa").on("click", function () {

        if (StockSelezionata == null) {
            mostraErrore("Seleziona lo stock!")
            return
        } else if (richiestaGiaEffetuata) {
            const modal = new bootstrap.Modal(document.getElementById("mappaModal"));
            modal.show();
            return
        } else {
            let richiesta = inviaRichiesta("GET", URL2 + StockSelezionata + "&apikey=MLMAQXWLDHBFYXPK")
            //let richiesta = inviaRichiesta("GET", URL2)

            richiesta.fail(errore)
            richiesta.done(function (dati) {
                richiestaGiaEffetuata = true;
                console.log(dati)
                /*
                //--------------TEMP-----------------
                let n;
                switch (StockSelezionata) {
                    case "MSFT":
                        n = 0
                        break
                    case "SONY":
                        n = 1
                        break
                    case "IBM":
                        n = 2
                        break
                    case "XIACF":
                        n = 3
                        break
                    case "BABA":
                        n = 4
                        break

                }
                let indirizzo = dati[n].Address
                //--------------TEMP-----------------
                */
                let indirizzo = dati.Address
                $("#googleMapsIframe").prop("src", `https://maps.google.com/maps?q=${encodeURIComponent(indirizzo)}&output=embed`)

                const modal = new bootstrap.Modal(document.getElementById("mappaModal"));
                modal.show();
            })
        }

    })

    // INDIRIZZAMENTO VERSO GRAFICI.HTML
    $("#btnGrafici").on("click", function (e) {
        e.preventDefault();
        if (StockSelezionata == null) {
            mostraErrore("Seleziona lo stock!")
            return
        } else {

            window.location.href = "grafici.html?symbol=" + StockSelezionata;
        }
    })


    // RICERCA SIMBOLI TRAMITE INPUT

    $("#InputSimboli").on("keyup", function () {

        let query = $(this).val().trim();

        // minimo 3 caratteri
        if (query.length < 3) {
            $("#risultati").hide();
            $("#LstRisultati").empty();
            return;
        }

        let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=";


        inviaRichiesta("GET", url + query + "&apikey=MLMAQXWLDHBFYXPK")
            .fail(errore)
            .done(function (data) {

                $("#LstRisultati").empty();

                if (data.bestMatches && data.bestMatches.length > 0) {

                    $("#risultati").show();

                    data.bestMatches.forEach(function (item) {

                        let symbol = item["1. symbol"];
                        let name = item["2. name"];
                        let region = item["4. region"];

                        $("#LstRisultati").append(`
                            <li class="list-group-item result-item" 
                                data-symbol="${symbol}" 
                                data-name="${name}">
                                <strong>${symbol}</strong> - ${name} (${region})
                            </li>
                        `);
                    });

                } else {
                    $("#risultati").show();
                    $("#LstRisultati").html(`
                        <li class="list-group-item">Nessun risultato</li>
                    `);
                }
            })

    });

    $(document).on("click", ".result-item", function () {

        let simbolo = $(this).data("symbol");
        let name = $(this).data("name");

        $("#InputSimboli").val(simbolo + " - " + name);

        $("#risultati").hide();

        console.log("Selezionato (dal input):", simbolo);
        sessionStorage.setItem("simbolo", simbolo)

        ricavaDati(simbolo)

    });



});

// CHIAMATA PRINCIPALE
function ricavaDati(simbolo) {
    let request = inviaRichiesta("GET", URL + simbolo + "&apikey=MLMAQXWLDHBFYXPK")
    //let request = inviaRichiesta("GET", URL)

    request.fail(errore)
    request.done(function (dati) {
        console.log(dati)
        console.log(" da ricavaDati")
        sessionStorage.setItem("datiStock", JSON.stringify(dati))
        /*
        //--------------TEMP-----------------

        let n;
        switch (simbolo) {
            case "MSFT":
                n = 0
                break
            case "SONY":
                n = 1
                break
            case "IBM":
                n = 2
                break
            case "XIACF":
                n = 3
                break
            case "BABA":
                n = 4
                break

        }
        StockSelezionata = dati[n]["01. symbol"]
        //--------------TEMP-----------------
        */
        StockSelezionata = dati["Global Quote"]["01. symbol"]

        richiestaGiaEffetuata = false
        console.log(StockSelezionata + "da ricavaDati")
        generaAreaVisualizzazione(dati);
        //generaAreaVisualizzazione(dati[n])
    })

}

// SALVATAGGIO DELLE CHIAMATE PRECEDENTI
function caricaPrecedente() {
    let simboloSalvato = sessionStorage.getItem("simbolo");
    if (simboloSalvato == null) {
        return
    }
    let datiSalvati = JSON.parse(sessionStorage.getItem("datiStock"))
    if (datiSalvati == null) {
        return
    }
    console.log(simboloSalvato + " da CaricaPrecedente")
    StockSelezionata = simboloSalvato
    $("#selectPlaceholder").text(StockSelezionata)
    console.log(datiSalvati + " da CaricaPrecedente")
    generaAreaVisualizzazione(datiSalvati)
}

// ERRORI DEL TOAST
function mostraErrore(messaggio) {
    $("#toastErroreMessaggio").prop("textContent", messaggio)
    const toast = bootstrap.Toast.getOrCreateInstance($("#toastErrore"));
    toast.show();
}

// AREA DI VISUALIZZAZIONE
function generaAreaVisualizzazione(dati) {
    let area = $("#areaVisualizzazione")
    area.html("")
    area.removeClass("justify-content-center align-items-center d-flex")
    let q = dati["Global Quote"];
    //let q = dati


    area.empty();

    let string = (parseFloat(q["09. change"]).toFixed(2)).toString()
    let up = false
    let header = $(`
    <div class="d-flex justify-content-between align-items-center">
        <div>
            <h6 class="text-muted mb-1">${q["01. symbol"]}</h6>
            <h1>${parseFloat(q["05. price"]).toFixed(2)}</h1>
        </div>
        <div class="text-end">
            <h5 class="${string.includes('-') ? (up = false, 'text-danger') : (up = true, 'text-success')}">
                ${string} ${up ? '▲' : '▼'} (${parseFloat(q["10. change percent"]).toFixed(2)} %)
            </h5>
        </div>
    </div>
`);

    area.append(header);
    area.append("<hr>");

    let items = [
        { label: "OPEN", value: q["02. open"] },
        { label: "HIGH", value: q["03. high"] },
        { label: "LOW", value: q["04. low"] },
        { label: "VOLUME", value: (q["06. volume"] / 1000000).toFixed(1) + "M" }
    ];

    let row = $('<div class="row g-3"></div>');

    items.forEach(item => {
        let card = `
        <div class="col-md-3">
            <div class="p-3 bg-light rounded">
                <small class="text-muted">${item.label}</small>
                <h5>${item.value}</h5>
            </div>
        </div>
    `;
        row.append(card);
    });

    area.append(row);



}

// SIDEBAR MENU
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}


