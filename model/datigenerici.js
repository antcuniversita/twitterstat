module.exports = (function () {
  'use strict';
    var request = require('request');
    // Costante necessaria per l'interazione con l'API di Twitter
  const token = { 'Authorization': 'Bearer' }
  var RoutingDatiGenerici = require('express').Router();
  
// Fetch dei dati generali relativi a un utente
RoutingDatiGenerici.post("/datigenerici", (req, res) => {
  request.get({ headers: token, url: `https://api.twitter.com/1.1/users/show.json?screen_name=${req.body.username}`, method: 'GET' }, function (e, r, body) {
    // Parse del body
    var bodyValues = JSON.parse(body);
    // Se l'utente non esiste ritorna un errore 
    if (!bodyValues.id_str || bodyValues.error) {
      res.json({ esito: 'ErroreNOUtente' })
      return res.end()
    }
    var rapporto_followers_following = "0"
    if (bodyValues.followers_count == "0" && bodyValues.friends_count == "0") {
      rapporto_followers_following = "0"
    }
    else if (bodyValues.followers_count >= "0" && bodyValues.friends_count == "0") {
      rapporto_followers_following = "0"
    }
    else {
      rapporto_followers_following = bodyValues.followers_count / bodyValues.friends_count;
      rapporto_followers_following = Number(rapporto_followers_following).toFixed(3)
    }
    res.json({ id: bodyValues.id_str, username: bodyValues.screen_name, nominativo: bodyValues.name, geo: bodyValues.location, desc: bodyValues.description, url: bodyValues.url, followers: bodyValues.followers_count, following: bodyValues.friends_count, rapp_foll: rapporto_followers_following, creazioneaccount: bodyValues.created_at, likealtri: bodyValues.favourites_count, verificato: bodyValues.verified, propic: bodyValues.profile_image_url_https.replace('_normal', ''), backpic: bodyValues.profile_banner_url })
  });
});
  
  return RoutingDatiGenerici;
})();

