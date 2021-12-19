// DEPENDENCIAS
const fs = require('fs'); // Lectura de archivos, para el certificado
const https = require('https'); // Servidor HTTPS
const express = require('express'); // Aplicación express
const { Server } = require("socket.io"); // Socket
const sqlite3 = require('sqlite3').verbose(); // Cliente SQLite3

// PARAMETROS
// Server port
const HTTP_PORT = 3000 ;
const DB_URL = "./MiArmarioBD.db";
const KEY_URL = 'my_cert.key';
const CERT_URL = 'my_cert.crt';

// INSTANCIA DEL SERVICIO
const app = express();
const server = https.createServer({
    key: fs.readFileSync(KEY_URL),
    cert: fs.readFileSync(CERT_URL)
},app);
const io = new Server(server);
// Start server
server.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// CONEXIÓN A LA BD
let db = new sqlite3.Database(DB_URL, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectado a la base de datos');
});

// LLAMADAS SOCKETs
io.on('connection', (socket) => {
    console.log((new Date()) + ' => Nueva conexión aceptada')
    sendMenuActions(socket);
    sendPrendas(socket);
    socket.on('disconnect', () => {
        console.log((new Date()) + ' => Usuario desconectado');
      });
    socket.on('test',(msg) => {
        console.log('Petición tipo test: ' + msg);
        io.emit("mensaje",'Hola desde la API');
    })
    socket.on('MenuActions', () => {
        io.emit("MenuActionsRes", getMenuActions());
    })
});

const sendMenuActions = function(socket){
    db.all("SELECT ID_MENU IdMenu, TX_NAME TxName, TX_PATH TxPath FROM D_MENUS", (error, rows) => {
        socket.emit("MenuActionsRes", rows);
    });
}

const sendPrendas = function(socket){
    db.all("SELECT P.ID_PRENDA IdPrenda, P.TX_NAME TxName, P.CD_TYPE CdType FROM D_PRENDAS P WHERE P.CH_ACTIVE = 1", (error, rows) => {
        socket.emit("AllPrendas", rows);
    });
}
