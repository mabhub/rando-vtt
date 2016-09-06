export default function get(url) {
    // Renvoie une nouvelle promesse.
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function() {
            // Ceci est appelé même pour une 404 etc.
            // aussi vérifie le statut
            if (req.status == 200) {
                // Accomplit la promesse avec le texte de la réponse
                resolve(req.response);
            } else {
                // Sinon rejette avec le texte du statut
                // qui on l’éspère sera une erreur ayant du sens
                reject(Error(req.statusText));
            }
        };

        // Gère les erreurs réseau
        req.onerror = function() {
            reject(Error("Erreur réseau"));
        };

        // Lance la requête
        req.send();
    });
}
