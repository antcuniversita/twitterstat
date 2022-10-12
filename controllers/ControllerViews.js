module.exports = (function () {
  'use strict';
  var RoutingViews = require('express').Router();
  
  // Pagina di indice
  RoutingViews.get('/', function (req, res) {
    res.render('pages/index.ejs');
  });

  // Pagina glossario e sitografia
  RoutingViews.get('/glossariositografia.html', function (req, res) {
    res.render('pages/glossariositografia.ejs');
  });

  // Pagina di contatto
  RoutingViews.get('/utente.html', function (req, res) {
    res.render('pages/utente.ejs');
  });

  // Pagina di contatto
  RoutingViews.get('/contattami.html', function (req, res) {
    res.render('pages/contattami.ejs');
  });

  return RoutingViews;
})();

