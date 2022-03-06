// DEPENDENCIAS
const fs = require('fs'); // Lectura de archivos, para el certificado
const https = require('https'); // Servidor HTTPS
const express = require('express'); // Aplicación express
const { Server } = require("socket.io"); // Socket
const sqlite3 = require('sqlite3').verbose(); // Cliente SQLite3

// Clases
//import DPrendas from './Entities/DPrendas';
const DPrendas = require('./Entities/DPrendas');
const DUsers = require('./Entities/DUsers');
const DMenus = require('./Entities/DMenus');
const DClosets = require('./Entities/DClosets');

const Commands = require('./Utils/Commands');
const DBParams = require('./Utils/DBParamas');

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
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

// CONEXIÓN A LA BD
db = new sqlite3.Database(DB_URL, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectado a la base de datos');
});

// LLAMADAS SOCKETs
io.on('connection', (socket) => {
    console.log((new Date()) + ' => Nueva conexión aceptada')
    sendMenuActions(socket);
    socket.on('disconnect', () => {
        console.log((new Date()) + ' => Usuario desconectado');
      });
    socket.on('test',(msg) => {
        console.log('Petición tipo test: ' + msg);
        io.emit("mensaje",'Hola desde la API');
    });

    socket.on('TestPrenda', () => {
        DPrendas.Id(db, 1)
            .then(function(registro){
                socket.emit("TEST", registro.getData());
            });
    });

    socket.on('TestMenu', () => {
        DMenus.Id(db, 1)
            .then(function(registro){
                socket.emit("TEST", registro);
            });
    });

    socket.on('TestClosets', (idClosets) => {
        DClosets.Id(db, idClosets)
            .then(function(registro) {
                if (registro){
                    socket.emit("TEST", registro.getData());
                } else {
                    socket.emit("TEST", null);
                }
            });
    });

    socket.on('TestUser', () => {
        DUsers.Id(db, 1)
            .then(function(registro){
                if (registro){
                    socket.emit("TEST", registro.getData());
                } else {
                    socket.emit("TEST", null);
                }
            });
    });

    socket.on('TestParams', () => {
        var params = new DBParams;
        DMenus.Find(db, `AND TX_NAME = ${params.addParams("Inicio")}`, params)
            .then(function(registro){
                socket.emit("TEST", registro);
            })
    });
    socket.on('TestInsert', () => {
        var newClosets = new DClosets(null, "Calcetines", 1, "Calcetines cortos", 1);
        newClosets.Insert(db)
            .then(function(result){
                socket.emit("TEST", registro.affectedID);
            });
    });
    socket.on('TestUpdate', (idClosets) => {
        DClosets.Id(db, idClosets)
        .then(function(closet){
            closet.CdUser = 10;
            closet.Update(db)
                .then(function(result) {
                    if (result && result.rows > 0){
                        socket.emit("OK");
                    }
                });
        });
    });

});

const sendMenuActions = function(socket){
    DMenus.Find(db)
    .then(function(registro){
        socket.emit("MenuActionsRes", registro);
    });
}
