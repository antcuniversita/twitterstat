module.exports = (function () {
  'use strict';
  var RoutingApi = require('express').Router();
  
  // Routing per l'API destinata al ritorno dei dati generici relativi a un utente
  RoutingApi.use('/api', require('../model/datigenerici'));
  // Routing per l'API destinata al ritorno delle statistiche aggiuntive dell'utente
  RoutingApi.use('/api', require('../model/statistiche'));
  
  return RoutingApi;
})();

