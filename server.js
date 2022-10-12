// Importa le dipendenze
var express = require('express');
var path = require('path');

// Inizializza Express
var app = express();

// Imposta il template engine a EJS
app.set('view engine', 'ejs');

// Necessario per gestire i parametri JSON
app.use(express.json());
// Necessario per gestire i parametri urlencoded
app.use(express.urlencoded({ extended: true }))
// Consenti l'accesso alle risorse statiche (CSS/JS/Immagini)
app.use(express.static(path.join((__dirname + "/public"))));

// Controller per la visualizzazione delle pagine statiche (views, memorizzate nella cartella views)
var RoutingViews = require('./controllers/ControllerViews');
app.use('/', RoutingViews);

// Controller per l'utilizzo delle API che gestiscono l'interazione con Twitter (memorizzate nella cartella model)
var RoutingApi = require('./controllers/ControllerApi');
app.use('/', RoutingApi);

// Controller per nodemailer, utilizzato per l'invio delle mail
var RoutingMailer = require('./controllers/ControllerMailer');
app.use('/', RoutingMailer);

app.listen(8080);
console.log('DEBUG: il server è in esecuzione su localhost:8080');

