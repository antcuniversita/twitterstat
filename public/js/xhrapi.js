         // Estraiamo la lista dei parametri GET
         var lista_parametri = new URLSearchParams(window.location.search)
         // Se, per qualche motivo, il parametro GET non esiste, restituisci un errore
         if (!lista_parametri.has('username')) {
         	var mymodal = $('#myModal');
         	mymodal.find('.modal-body').text('Hai inserito un username vuoto, si prega di tornare alla Homepage e riprovare.');
         	mymodal.find('.chiudi').hide();
         	mymodal.modal('show');
         }
         // Altrimenti prosegui nell'esecuzione
         else {
         	// Estraiamo l'username
         	var username = lista_parametri.get('username');
         	// Lo facciamo visualizzare sul jumbotron
         	document.getElementById('utente-jumbotron').innerHTML = username;
         }
         
         // Verifichiamo se l'utente esiste su Twitter, estraendo e inserendo nella pagine i suoi dati generici
         if (username) {
         	// Prepariamo la richiesta verso /datigenerici
         	let xhr = new XMLHttpRequest();
         	xhr.open("POST", "/api/datigenerici", false);
         	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
         
         	// Se il server restituisce ErroreNOUtente, l'utente non esiste, altrimenti esiste
         	// Se l'utente non esiste, blocca l'esecuzione e mostra un modal, altrimenti prosegui
         	xhr.onreadystatechange = function () {
         		if (xhr.readyState === 4) {
         			if (JSON.parse(xhr.responseText).esito == "ErroreNOUtente") {
         				var mymodal = $('#myModal');
         				mymodal.find('.modal-body').text("L'username non esiste, si prega di tornare alla Homepage e riprovare.");
         				mymodal.find('.chiudi').hide();
         				mymodal.modal('show');
         				exit();
         			}
         			// L'utente esiste
         			else {
         				var risposta_api = JSON.parse(xhr.responseText);
         				document.getElementById('propic').src = risposta_api.propic;
         				document.getElementById('idutente').innerHTML = risposta_api.id;
         				document.getElementById('nominativo').innerHTML = risposta_api.nominativo;
         				document.getElementById('geo').innerHTML = risposta_api.geo;
         				document.getElementById('desc').innerHTML = risposta_api.desc;
         				document.getElementById('url').innerHTML = risposta_api.url;
         				document.getElementById('url').href = risposta_api.url;
         				document.getElementById('followers').innerHTML = risposta_api.followers;
         				document.getElementById('following').innerHTML = risposta_api.following;
         				document.getElementById('rapp_foll').innerHTML = risposta_api.rapp_foll;
         				document.getElementById('data').innerHTML = risposta_api.creazioneaccount;
         				document.getElementById('likealtri').innerHTML = risposta_api.likealtri;
         				document.getElementById('verificato').innerHTML = risposta_api.verificato;
         				if (risposta_api.backpic != undefined) {
         					document.getElementById('backpic').innerHTML = risposta_api.backpic;
         					document.getElementById('backpic').href = risposta_api.backpic;
         				}
         			}
         		}
         	}
         	// Invia la richiesta verso /datigenerici usando JSON
         	xhr.send(JSON.stringify({ "username": username }));
         }
         
         // Verifichiamo se l'utente esiste su Twitter, estraendo e inserendo nella pagine le sue statistiche
         if (username) {
         	// Prepariamo la richiesta verso /statistiche
         	let xhr = new XMLHttpRequest();
         	xhr.open("POST", "/api/statistiche", false);
         	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
         
         	// Se il server restituisce ErroreNOUtente, l'utente non esiste, non stampiamo alcun errore in quanto già lo stampiamo nella richiesta precedente
         	// Se il server restituisce ErroreNOTweet, l'utente non ha alcun tipo di Tweet/Retweet
         	// Se l'utente non ha Tweet/Retweet, blocca l'esecuzione e mostra un modal, altrimenti prosegui
         	xhr.onreadystatechange = function () {
         		if (xhr.readyState === 4) {
         			bodyparsed = JSON.parse(xhr.responseText);
         			if (bodyparsed.esito == "ErroreNOUtente") {
         				// Non fare nulla
         			} else if (bodyparsed.esito == "ErroreNOTweet") {
         				var mymodal = $('#myModal');
         				mymodal.find('.modal-body').text("L'username non ha Tweet/Retweet, quindi le infografiche e altre statistiche non sono disponibili. Puoi tornare alla Homepage oppure premere Chiudi per visualizzare solo le sue informazioni generali.");
         				mymodal.modal('show');
         			}
         			// L'utente esiste e ha Tweet/Retweet
         			else {
         				document.getElementById('numtweet').innerHTML = bodyparsed.numtweet;
         				document.getElementById('dataprimotweet').innerHTML = bodyparsed.dataprimotweet;
         				document.getElementById('idprimotweet').innerHTML = bodyparsed.idprimotweet;
         				document.getElementById('idprimotweet').href = bodyparsed.idprimotweet;
         				document.getElementById('dataultimotweet').innerHTML = bodyparsed.dataultimotweet;
         				document.getElementById('idultimotweet').innerHTML = bodyparsed.idultimotweet;
         				document.getElementById('idultimotweet').href = bodyparsed.idultimotweet;
         				document.getElementById('tweetpiulike').innerHTML = bodyparsed.tweetpiulike;
         				document.getElementById('idtweetpiulike').innerHTML = bodyparsed.idtweetpiulike;
         				document.getElementById('idtweetpiulike').href = bodyparsed.idtweetpiulike;
         				document.getElementById('tweetpiuretweet').innerHTML = bodyparsed.tweetpiuretweet;
         				document.getElementById('idtweetpiuretweet').innerHTML = bodyparsed.idtweetpiuretweet;
         				document.getElementById('idtweetpiuretweet').href = bodyparsed.idtweetpiuretweet;
         
         				// Grafico a torta media retweet vs media like
         				const ChartMedia = new Chart(
         					document.getElementById('ChartMedia'),
         					{
         						type: 'doughnut',
         						data: {
         							labels: [
         								'Retweet',
         								'Like',
         							],
         							datasets: [{
         								backgroundColor: [
         									'rgb(255, 99, 132)',
         									'rgb(255, 205, 86)'
         								],
         								data: [Number(bodyparsed.mediaretweet), Number(bodyparsed.medialike)],
         							}]
         						},
         						options: { responsive: true },
         					}
         				);
         
         				// Grafico a torta numero Tweet vs numero Retweet
         				const ChartTweetRetweet = new Chart(
         					document.getElementById('ChartTweetRetweet'),
         					{
         						type: 'doughnut',
         						data: {
         							labels: [
         								'Retweet',
         								'Tweet',
         							],
         							datasets: [{
         								backgroundColor: [
         									'rgb(75, 192, 192)',
         									'rgb(54, 162, 235)'
         								],
         								data: [Number(bodyparsed.numeroretweet), Number(bodyparsed.numerotweetsenzaretweet)],
         							}]
         						},
         						options: { responsive: true },
         					}
         				);
         
         				// Grafico a barre numero hashtag vs menzioni vs link vs foto vs video
         				const ChartMix = new Chart(
         					document.getElementById('ChartMix'),
         					{
         						type: 'bar',
         						data: {
         							labels: ['Hashtag', 'Menzioni', 'Link', 'Foto', 'Video'],
         							datasets: [{
         								label: '',
         								data: [bodyparsed.numhash, bodyparsed.nummenz, bodyparsed.numlink, bodyparsed.numfoto, bodyparsed.numvideo],
         								backgroundColor: [
         									'rgba(255, 99, 132, 0.2)',
         									'rgba(75, 192, 192, 0.2)',
         									'rgba(54, 162, 235, 0.2)',
         									'rgba(153, 102, 255, 0.2)',
         									'rgba(201, 203, 207, 0.2)'
         								],
         								borderColor: [
         									'rgb(255, 99, 132)',
         									'rgb(75, 192, 192)',
         									'rgb(54, 162, 235)',
         									'rgb(153, 102, 255)',
         									'rgb(201, 203, 207)'
         								],
         								borderWidth: 1
         							}]
         						},
         						options: {
         							responsive: true,
         							scales: {
         								y: {
         									beginAtZero: true
         								}
         							}
         						},
         					}
         				);
         
         				// Quantità dei tweet pubblicati ogni mese
         				const ChartEvoluzioneTempo = new Chart(
         					document.getElementById('ChartEvoluzioneTempo'),
         					{
         						type: 'line',
         						data: {
         							labels: Object.keys(bodyparsed.frequenzamensiletweet),
         							datasets: [{
         								label: '',
         								tension: 0.1,
         								fill: false,
         								borderColor: 'rgb(75, 192, 192)',
         								data: Object.values(bodyparsed.frequenzamensiletweet),
         							}]
         						},
         						options: { responsive: true },
         					}
         				);
         				
         			}
         		}
         	}
         	// Invia la richiesta verso /statistiche usando JSON
         	xhr.send(JSON.stringify({ "username": username }));
         }

