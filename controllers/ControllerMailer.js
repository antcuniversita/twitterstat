module.exports = (function () {
  'use strict';
    var nodemailer = require('nodemailer');
  var RoutingMailer = require('express').Router();
const user = "";
const pass = "";
RoutingMailer.post("/api/inviamail", (req, res) => {
  // Setup di nodemailer
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user,
      pass
    },
  });
  const mailOptions = {
    // Non è possibile impostare from a req.body.email in quanto, a causa delle impostazioni di sicurezza di Outlook, è vietato lo "spoofing" della mail
    // Per aggirare questo problema, l'unico modo è quello di inviare una mail a se stesso
    // Impostando il mittente e il destinatario allo stesso valore
    // La vera mail dell'utente verrà inclusa nell'oggetto
    // from: req.body.email,
    from: "progettopwm2022@outlook.it",
    to: "progettopwm2022@outlook.it",
    subject: `Hai ricevuto un messaggio da ${req.body.email}: ${req.body.oggetto}`,
    text: `Il nome del mittente: ${req.body.nome}\nLa mail del mittente: ${req.body.email}\nL'oggetto della mail: ${req.body.oggetto}\nIl messaggio: ${req.body.messaggio}`
  }
  // Qui avviene l'invio effettivo della mail
  transporter.sendMail(mailOptions, (error, responose) => {
    if (error) {
      console.log(error);
      res.json({ esito: 'Errore' })
    } else {
      console.log("DEBUG: email inviata correttamente");
      res.json({ esito: 'OK' })
    }
  });
});


  return RoutingMailer;
})();

