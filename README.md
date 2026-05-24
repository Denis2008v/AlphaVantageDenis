# Mercato Azionario - Piattaforma di Analisi Borsistica

---

## Descrizione del Progetto

Questo progetto consiste in una web application per la visualizzazione e l'analisi dei valori di borsa in tempo reale. La piattaforma consente agli utenti di consultare i prezzi aggiornati delle principali azioni mondiali, effettuare ricerche per simbolo o nome azienda, visualizzare grafici storici mensili e individuare la sede delle aziende tramite mappa interattiva.

Tutti i dati vengono recuperati attraverso le API pubbliche di **Alpha Vantage**.

---

## Struttura dei File

```
progetto/
├── html/
│   ├── index.html        # Pagina principale - visualizzazione dati di borsa
│   └── grafici.html      # Pagina dei grafici storici
├── js/
│   ├── index.js          # Logica della pagina principale
│   ├── grafici.js        # Logica della pagina grafici
│   └── libreria.js       # Funzioni di utilità condivise
└── css/
    └── style.css         # Fogli di stile personalizzati
```

---

## Funzionalita Principali

### Pagina Principale (`index.html` / `index.js`)

- **Selezione azienda tramite menu a tendina:** l'utente può scegliere tra un insieme predefinito di aziende (Microsoft, Sony, IBM, Xiaomi, Alibaba).
- **Ricerca per nome:** tramite un campo di input testuale, il sistema interroga l'endpoint `SYMBOL_SEARCH` di Alpha Vantage e restituisce i risultati piu pertinenti (minimo 3 caratteri richiesti).
- **Visualizzazione dati di mercato:** una volta selezionato un simbolo, vengono mostrati prezzo corrente, variazione, apertura, massimo, minimo e volume giornaliero.
- **Mappa interattiva:** tramite il pulsante "Apri Mappa", il sistema recupera l'indirizzo della sede aziendale (endpoint `OVERVIEW`) e lo visualizza tramite Google Maps in una finestra modale.
- **Persistenza della sessione:** i dati dell'ultima azienda consultata vengono salvati nel `sessionStorage` del browser e ripristinati automaticamente al ricaricamento della pagina.
- **Gestione degli errori:** gli errori vengono notificati all'utente tramite un componente Toast Bootstrap.
- **Ticker scorrevole:** nella sezione superiore della pagina e presente un banner animato con i prezzi di alcune azioni di riferimento.

### Pagina Grafici (`grafici.html` / `grafici.js`)

- **Parametro URL:** il simbolo azionario viene trasmesso dalla pagina principale tramite query string (`?symbol=...`).
- **Grafico mensile:** il sistema recupera la serie storica mensile dell'azione selezionata tramite l'endpoint `TIME_SERIES_MONTHLY` e traccia un grafico interattivo con **Chart.js**.
- **Filtro per anno:** l'utente puo filtrare i dati visualizzati selezionando l'anno di interesse tramite un menu a tendina (dal 2018 al 2026).
- **Configurazione dinamica del grafico:** le impostazioni grafiche (tipo di grafico, dataset, colori) vengono caricate da un server locale JSON (`localhost:3000/Chart`), rendendo la visualizzazione configurabile esternamente.

---

## API Utilizzate

| Endpoint Alpha Vantage | Utilizzo |
|---|---|
| `GLOBAL_QUOTE` | Recupero del prezzo corrente e dei dati di mercato giornalieri |
| `OVERVIEW` | Recupero delle informazioni generali dell'azienda (incluso l'indirizzo) |
| `SYMBOL_SEARCH` | Ricerca di simboli azionari per parola chiave |
| `TIME_SERIES_MONTHLY` | Recupero della serie storica mensile dei prezzi di chiusura |

---

## Tecnologie e Librerie

| Tecnologia | Versione | Utilizzo |
|---|---|---|
| HTML5 / CSS3 | - | Struttura e stile dell'interfaccia |
| JavaScript (ES6+) | - | Logica applicativa lato client |
| jQuery | Latest | Manipolazione DOM e chiamate AJAX |
| Bootstrap | 5.3 | Layout responsive e componenti UI |
| Bootstrap Icons | 1.11 | Icone dell'interfaccia |
| Chart.js | Latest | Rendering dei grafici interattivi |
| Alpha Vantage API | - | Fonte dei dati di mercato |
| Google Maps Embed | - | Visualizzazione della sede aziendale |
| JSON Server (locale) | - | Configurazione grafico e dati storici in fase di sviluppo |

---

## Configurazione e Avvio

### Prerequisiti

- Un browser moderno con supporto JavaScript ES6+.
- Una chiave API valida di Alpha Vantage (registrazione gratuita su [alphavantage.co](https://www.alphavantage.co)).
- Un server locale (es. JSON Server) in ascolto su `localhost:3000` per la configurazione del grafico.

### Avvio del Server Locale

```bash
# Installazione di json-server (se non presente)
npm install -g json-server

# Avvio del server con il file stock.json
json-server --watch stock.json --port 3000
```

### Il file `stock.json`

Il file `stock.json` funge da database locale per JSON Server ed espone i seguenti endpoint:

| Endpoint | Descrizione |
|---|---|
| `/Chart` | Configurazione del grafico (tipo, colori, dataset). **Utilizzato in produzione.** |
| `/GlobalQuotes` | Dati di quotazione simulati, usati in fase di sviluppo per aggirare il limite giornaliero delle chiamate API di Alpha Vantage. |
| `/Companies` | Informazioni sulle aziende (nome, sede), anch'esse usate come in precedenza. |
| `/HistoricalData` | Serie storiche mensili simulate per IBM e MSFT, utilizzate in fase di sviluppo al posto dell'endpoint `TIME_SERIES_MONTHLY`. |

In produzione, l'unico endpoint effettivamente richiamato dal codice è `/Chart`. Tutti gli altri endpoint sono stati utilizzati esclusivamente durante lo sviluppo per simulare le risposte di Alpha Vantage senza consumare le chiamate API disponibili.

La struttura rilevante del file e la seguente:

```json
{
  "Chart": [
    {
      "chartConfig": {
        "type": "line",
        "dataset": {
          "label": "Stock Price ($)",
          "borderColor": "#3a86ff",
          "backgroundColor": "rgba(58,134,255,0.2)"
        }
      }
    }
  ]
}
```

### Chiavi API

Nel codice sono presenti piu chiavi API di Alpha Vantage per gestire i limiti di utilizzo del piano gratuito (25 richieste/giorno per chiave). Si consiglia di sostituirle con chiavi proprie in produzione.

---
