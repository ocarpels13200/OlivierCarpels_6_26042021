//J'importe dans la constante http le package HTTP natif de node
const http = require('http');

/*Je créé une autre constante pour mon serveur et j'utilise la méthode createServer de ma constante http pour créer un serveur
Je met en place une fonction à flèche qui prend comme arguments les objets request et response
La méthode end de response permet d'envoyer une réponse au format string
* */
const server = http.createServer((req, res) => {
    res.end('Coucou');
});

//Enfin j(indique à mon serveur d'écoiter le port 3000
server.listen(3000);