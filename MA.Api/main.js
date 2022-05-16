// DEPENDENCIAS
const fs = require('fs'); // Lectura de archivos
const http = require('http'); // Servidor HTTP
//const https = require('https'); // Servidor HTTPS
const express = require('express'); // Aplicación express
const { Server } = require("socket.io"); // Socket
const sqlite3 = require('sqlite3').verbose(); // Cliente SQLite3
const CallAPI = require('./CallAPI'); // Llamadas API
const LogFile = require('./Utils/LogFile'); // Registros Log
const URL_PARAMS = 'params.json'; // Archivo de parámetros

const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

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

const upServer = function(HttpPort, KeyUrl, CertUrl){
    // Levantar servicio
    console.log('Levantando instancia del servicio');
    
    // SERVIDOR HTTP
    server = http.createServer(app);
    io = new Server(server);
    server.listen(HttpPort, () => {
        console.log("Server running on port %PORT%".replace("%PORT%", PARAMS.HTTP_PORT))
    });

    // SERVIDOR HTTPS
    // serverS = https.createServer({
    //     key: fs.readFileSync(KeyUrl),
    //     cert: fs.readFileSync(CertUrl)
    // }, app);
    // io = new Server(serverS);
    // serverS.listen(HttpPort, () => {
    //     console.log("Server running on port %PORT%".replace("%PORT%", PARAMS.HTTP_PORT))
    // });

    MaIo = io.of("/miarmario/")
    //io.on('connection', CallAPI.calls);
    MaIo.on('connection', CallAPI.calls2);
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
            upServer(PARAMS.HTTP_PORT, PARAMS.KEY_URL, PARAMS.CERT_URL);
        }
    });
}

// Entrada
start(URL_PARAMS);