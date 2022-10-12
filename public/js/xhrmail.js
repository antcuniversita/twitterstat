                function InviaDati(event) {

                    // Preleva i valori inseriti dall'utente dal form
                    var nome = event.name.value;
                    var email = event.email.value;
                    var oggetto = event.msg_subject.value;
                    var messaggio = event.message.value;

                    // Prepara l'invio della richiesta XMLHttpRequest
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "/api/inviamail");
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                    // Se il server restituisce la stringa OK, vuol dire che il messaggio è stato inviato correttamente
                    // Se il server restituisce qualsiasi altra stringa, vuol dire che il messaggio non è stato inviato correttamente
                    // Se ha avuto esito positivo, mostra il Modal che avvisa dell'esito positivo e resetta i valori inseriti dall'utente
                    // Se ha avuto esito negativo, mostra il Modal che avvisa dell'esito negativo
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (JSON.parse(xhr.responseText).esito == "OK") {
                                var mymodal = $('#myModal');
                                mymodal.find('.modal-body').text('Il messaggio è stato inviato correttamente!');
                                mymodal.modal('show');
                                // Reset dei valori
                                document.getElementById("contactForm").reset();
                            }
                            else {
                                var mymodal = $('#myModal');
                                mymodal.find('.modal-body').text('Errore interno, riprovare in seguito!');
                                mymodal.modal('show');
                            }
                        }
                    }

                    // Invia la richiesta usando il formato JSON
                    xhr.send(JSON.stringify({ "nome": nome, "email": email, "oggetto": oggetto, "messaggio": messaggio }));
                }
