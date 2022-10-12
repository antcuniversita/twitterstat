module.exports = (function () {
  'use strict';
  var request = require('request');
      // Costante necessaria per l'interazione con l'API di Twitter
  const token = { 'Authorization': 'Bearer' }
  var RoutingStatistiche = require('express').Router();
  
// A causa del Rate Limiting imposto da Twitter, è possibile prelevare solamente 199 tweet (l'indice va da 0 a 198)
RoutingStatistiche.post("/statistiche", (req, res) => {
  request.get({ headers: token, url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${req.body.username}&count=200`, method: 'GET' }, function (e, r, body) {
    var bodyValues = JSON.parse(body);
    if (bodyValues.errors || bodyValues.error) {
      res.json({ esito: 'ErroreNOUtente' })
      return res.end()
    }
    // Calcoliamo il numero dei tweet da analizzare
    var numero_tweet_analizzati = Object.keys(bodyValues).length;
    if (numero_tweet_analizzati == "0") {
      res.json({ esito: 'ErroreNOTweet' })
      return res.end()
    }
    // Calcoliamo la data del primo e ultimo tweet analizzabile
    var data_primo_tweet_analizzabile = bodyValues[numero_tweet_analizzati - 1].created_at
    var id_primo_tweet_analizzabile = bodyValues[numero_tweet_analizzati - 1].id_str
    var data_ultimo_tweet_analizzabile = bodyValues[0].created_at
    var id_ultimo_tweet_analizzabile = bodyValues[0].id_str
    // Calcoliamo il numero dei retweet, se il valore "retweeted_status" è nullo allora vuol dire che il tweet non è un retweet
    var numero_retweet = "0"
    for (var i = 0; i < numero_tweet_analizzati; i++) {
      if (bodyValues[i].retweeted_status) {
        numero_retweet = Number(numero_retweet) + 1;
      }
    }
    // Calcoliamo il numero dei tweet effettuati, sottraendo il numero dei retweet al totale
    var numero_tweet_senza_retweet = numero_tweet_analizzati - numero_retweet;
    // Individuiamo il tweet/risposta con più like e salviamo l'id, calcoliamo anche la sommatoria dei like
    var tweet_piu_like = "0"
    var sommatoria_like = "0"
    var id_tweet_piu_like = "0"
    for (var i = 0; i < numero_tweet_analizzati; i++) {
      sommatoria_like = Number(bodyValues[i].favorite_count) + Number(sommatoria_like)
      if (bodyValues[i].favorite_count >= tweet_piu_like) {
        tweet_piu_like = bodyValues[i].favorite_count;
        id_tweet_piu_like = bodyValues[i].id_str;
      }
    }
    // Individuiamo il tweet/risposta con più retweet e salviamo l'id (dobbiamo scartare i retweet dei tweet altrui fatti dall'utente), calcoliamo anche la sommatoria dei retweet
    var tweet_piu_retweet = "0"
    var sommatoria_retweet = "0"
    var id_tweet_piu_retweet = "0"
    for (var i = 0; i < numero_tweet_analizzati; i++) {
      if (!bodyValues[i].retweeted_status) {
        sommatoria_retweet = Number(bodyValues[i].retweet_count) + Number(sommatoria_retweet)
      }
      if (bodyValues[i].retweet_count >= tweet_piu_retweet && !bodyValues[i].retweeted_status) {
        tweet_piu_retweet = bodyValues[i].retweet_count;
        id_tweet_piu_retweet = bodyValues[i].id_str;
      }
    }
    // Calcolo la media dei like per ogni tweet, usando la sommatoria calcolata in precedenza
    var media_like = "0"
    if (sommatoria_like) {
      media_like = sommatoria_like / numero_tweet_analizzati;
      media_like = Number(media_like).toFixed(3)
    }
    // Calcolo la media dei retweet per ogni tweet, usando la sommatoria calcolata in precedenza
    var media_retweet = "0"
    if (sommatoria_retweet) {
      media_retweet = sommatoria_retweet / numero_tweet_analizzati;
      media_retweet = Number(media_retweet).toFixed(3)
    }
    // Calcolo numero tweet che hanno un hashtag
    var tweet_con_hashtag = "0"
    for (var i = 0; i < numero_tweet_analizzati; i++) {
      if (bodyValues[i].entities.hashtags != "") {
        tweet_con_hashtag = Number(tweet_con_hashtag) + 1
      }
    }
    // Calcolo numero tweet che hanno menzioni
    var tweet_con_menzioni = "0"
    for (var i = 0; i < numero_tweet_analizzati; i++) {
      if (bodyValues[i].entities.user_mentions != "") {
        tweet_con_menzioni = Number(tweet_con_menzioni) + 1
      }
    }
    // Calcolo numero tweet che hanno link
    var tweet_con_link = "0"
    for (var i = 0; i < numero_tweet_analizzati; i++) {
      if (bodyValues[i].entities.urls != "") {
        tweet_con_link = Number(tweet_con_link) + 1
      }
    }
    // Calcolo numero tweet che hanno foto e video
    var tweet_con_foto = "0"
    var tweet_con_video = "0"
    for (var i = 0; i < numero_tweet_analizzati; i++) {
      if (bodyValues[i].entities.media) {
        if (bodyValues[i].entities.media[0].expanded_url.includes('photo')) {
          tweet_con_foto = Number(tweet_con_foto) + 1
        }
        if (bodyValues[i].entities.media[0].expanded_url.includes('video')) {
          tweet_con_video = Number(tweet_con_video) + 1
        }
      }
    }
    // Creiamo un dizionario che conterrà come chiavi i vari mesi-anni e come valore il numero di tweet relativi a ogni mese
    var tweetmese = {}
    for (var i = 0; i < numero_tweet_analizzati; i++) {
      var nomechiave = bodyValues[i].created_at
      var mese = nomechiave.split(' ')[1]
      var anno = nomechiave.split(' ')[5]
      if (!(`${mese} ${anno}` in tweetmese)) {
        tweetmese[mese + " " + anno] = 1
      }
      else {
        tweetmese[mese + " " + anno] = Number(tweetmese[mese + " " + anno]) + 1
      }
    }
    res.json({numtweet : numero_tweet_analizzati, dataprimotweet: data_primo_tweet_analizzabile, idprimotweet: `https://twitter.com/${req.body.username}/status/${id_primo_tweet_analizzabile}`, dataultimotweet: data_ultimo_tweet_analizzabile, idultimotweet: `https://twitter.com/${req.body.username}/status/${id_ultimo_tweet_analizzabile}`, numeroretweet: numero_retweet, numerotweetsenzaretweet:  numero_tweet_senza_retweet, tweetpiulike: tweet_piu_like, idtweetpiulike: `https://twitter.com/${req.body.username}/status/${id_tweet_piu_like}`, tweetpiuretweet: tweet_piu_retweet, idtweetpiuretweet: `https://twitter.com/${req.body.username}/status/${id_tweet_piu_retweet}`, medialike: media_like, mediaretweet: media_retweet, numhash: tweet_con_hashtag, nummenz: tweet_con_menzioni, numlink: tweet_con_link, numfoto: tweet_con_foto, numvideo: tweet_con_video, frequenzamensiletweet: tweetmese})
  });
});
  
  return RoutingStatistiche;
})();

