// DEPENDENCIAS
const fs = require('fs'); // Lectura de archivos
const https = require('https'); // Servidor HTTPS
const express = require('express'); // Aplicación express
const { Server } = require("socket.io"); // Socket
const sqlite3 = require('sqlite3').verbose(); // Cliente SQLite3
const CallAPI = require('./CallAPI'); // Llamadas API
const LogFile = require('./Utils/LogFile'); // Registros Log

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

const upServer = function(HttpPort, KeyUrl, CertUrl){
    // Levantar servicio
    console.log('Levantando instancia del servicio');
    const server = https.createServer({
        key: fs.readFileSync(KeyUrl),
        cert: fs.readFileSync(CertUrl)
    }, app);
    io = new Server(server);
    server.listen(HttpPort, () => {
        console.log("Server running on port %PORT%".replace("%PORT%", PARAMS.HTTP_PORT))
    });
    io.on('connection', CallAPI.calls);
}

// Función de entrada
const start = function(URL_PARAMS){
    console.log('Arracando MiArmario.API');
    fs.readFile(URL_PARAMS, 'utf8' , (err, data) => {
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
start('params.json');