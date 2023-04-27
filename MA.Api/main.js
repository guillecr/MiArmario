// DEPENDENCIAS
const fs = require('fs'); // Lectura de archivos
//const http = require('http'); // Servidor HTTP
const https = require('https'); // Servidor HTTPS
const express = require('express'); // Aplicación express
const { Server } = require("socket.io"); // Socket
const sqlite3 = require('sqlite3').verbose(); // Cliente SQLite3
const CallAPI = require('./CallAPI'); // Llamadas API
const LogFile = require('./Utils/LogFile'); // Registros Log
const URL_PARAMS = 'params.json'; // Archivo de parámetros
const path = require('path');

const app = express();

const connDB = function(UrlDB){
    // Conexión a la base de datos
    console.log('Conexión a la base de datos...');
    db = new sqlite3.Database(UrlDB, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Conectado a la base de datos');
    });
}

const upServer = function(HostName, HttpPort, KeyUrl, CertUrl, CaUrl){
    // Levantar servicio
    console.log('Levantando instancia del servicio');
    
    // SERVIDOR HTTP
    // var server = http.createServer(app);
    // var io = new Server(server, {
    //     maxHttpBufferSize: 6e8
    // });
    // server.listen(HttpPort, () => {
    //     console.log("Server arrancado en el puerto %PORT%".replace("%PORT%", PARAMS.HTTP_PORT));
    // });

    // var MaIo = io.of("/miarmario/");
    // MaIo.on('connection', CallAPI.calls);

    // SERVIDOR HTTPS
    app.use(express.static(path.join(__dirname, '/MA.App/', 'dist')));
    app.get('*',function(req, res) {
        res.sendFile(path.join(__dirname  + '/MA.App/', 'dist', 'index.html'));
    });

    var serverS = https.createServer({
        key: fs.readFileSync(KeyUrl),
        cert: fs.readFileSync(CertUrl),
        ca: fs.readFileSync(CaUrl)
    }, app);

    // var ioS = new Server(serverS);
    var ioS = new Server(serverS);
    serverS.listen(HttpPort, HostName, () => {
        console.log(`Servidor arrancado en el puerto ${PARAMS.HTTP_PORT}`);
    });
    var MaIo = ioS.of("/miarmario/");
    MaIo.on('connection', CallAPI.calls);
}

// Función de entrada
const start = function(UrlParams){
    console.log('Arracando MiArmario.API');
    fs.readFile(UrlParams, 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
        } else {
            console.log('Parametros leidos')
            PARAMS = JSON.parse(data);
            LogFile.UrlLog = PARAMS.LOG_PATH;
            LogFile.writeLog('Servicio iniciando');
            connDB(PARAMS.DB_PATH);
            upServer(PARAMS.HOST_NAME, PARAMS.HTTP_PORT, PARAMS.KEY_URL, PARAMS.CERT_URL, PARAMS.CA_URL);
        }
    });
}

// Entrada
start(URL_PARAMS);