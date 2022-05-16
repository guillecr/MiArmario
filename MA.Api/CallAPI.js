const DPrendas = require('./Entities/DPrendas');
const DUsers = require('./Entities/DUsers');
const DMenus = require('./Entities/DMenus');
const DClosets = require('./Entities/DClosets');
const ExtImgs = require('./Entities/ExtImgs');

const Commands = require('./Utils/Commands');
const DBParams = require('./Utils/DBParamas');
const LogFile = require('./Utils/LogFile');
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");

// Páginas
const MisPrendas = require("./pages/MisPrendas");

class CallAPI {

    static calls2(socket){
        var init = CallAPI.calls.toString().substring(14,CallAPI.calls.toString().length-1);
        var codePrendas = MisPrendas.calls.toString().substring(8, MisPrendas.calls.toString().length-1);
        var fullCalls = init + "\n" + codePrendas;
        eval(fullCalls);

    }

    static calls(socket){
        // Llamadas IO
        var address = socket.request.connection.remoteAddress;
        var accessDB = { linkDB: db, user: null };
        console.log((new Date()) + ` => Nueva conexión aceptada (${address})`)
        LogFile.writeLog(`${new Date()} => Nueva conexión aceptada (${address})`);
        
        // Comprobar acreditación inicial
        if (CallAPI.getTokenInHead(socket)){
            try {
                accessDB.user = CallAPI.authenticationByToken(socket);
                // Sin uso de await
                DUsers.Id(accessDB, accessDB.user)
                    .then(function(user){
                        if (!user){
                            LogFile.writeLog('ERROR - autentificación: Token valido con usuario no localizado. ID User: ' + accessDB.user);
                        } else {
                            socket.emit('withAccess', user.TxLogin);
                        }
                    });
                
            } catch (ex){
                LogFile.writeLog('ERROR - getSession: ' + ex.message);
            }
        } else {
            LogFile.writeLog(`${new Date()} => Conexión sin acreditación`);
            socket.emit('withAccess',false);
        }

        socket.use(([event, ...args], next) => {
            // events: Nombre de la llamada
            // args: Parámetros a la llamada
            // Utilizamos este mecanismo para la autentificación
            try {
                accessDB.user = CallAPI.authenticationByToken(socket);
                next();
            } catch (ex){
                // Excepciones
                if (event == 'getMenus'){
                    //socket.user = 4;
                    accessDB.user = 4; // 4 => Usuario sin permisos
                    next();
                } else if (event == 'LoginIn'){
                    socket.accessDB = 2; // User 2 0> API_LOGIN_IN
                    next(); 
                
                } else {
                    // Sin autentificación
                    accessDB.user = null;
                    socket.emit('withAccess', false);
                    //return next(new Error("unauthorized event"));
                }   
            }
        });

        socket.on('LoginIn', async (loginParams) => {
            var params = new DBParams;
            var user = await DUsers.Find(accessDB, 'AND TX_LOGIN = ' + params.addParams(loginParams.login), params);
            if (user){
                if (await bcrypt.compare(loginParams.pw, user[0].TxPassword)){
                    // PW correcto
                    var token = CallAPI.getToken(user[0].IdUser);                    
                    user[0].FhLastLogin = Date.now();
                    await user[0].Update(accessDB);

                    LogFile.writeLog(`Usuario logeado: ${user[0].TxLogin} (${user[0].IdUser})`);
                    socket.emit('withAccess', user[0].TxLogin);
                    socket.emit('token', token);

                } else {
                    // PW incorrecto
                    socket.emit('withAccess', false);
                    LogFile.writeLog('LoginIn PW erroneo: ' + loginParams.login); 
                }
            } else {
                // Login no localizado
                socket.emit('withAccess', false);
                LogFile.writeLog('LoginIn Login no localizado: ' + loginParams.login); 
            }
        });

        // socket.on('getPrendasByArmario', async(idArmario) => {
        //     try {
        //         var params = new DBParams;
        //         var listPrendas = await DPrendas.Find(accessDB,`AND CD_CLOSET = ${params.addParams(idArmario)}
        //             AND CH_ACTIVE = 1`, params);
        //         // Emitimos la lista de ropa
        //         socket.emit('getPrendasByArmarioResponse',listPrendas);
        //         // De uno en uno emitimos las imagenes
        //         for (var index in listPrendas){
        //             var prenda = listPrendas[index];
        //             var params = new DBParams;
        //             var listImg = await ExtImgs.Find(accessDB,`AND ID_IMG IN (SELECT R.CD_IMG FROM R_PRENDAS_IMGS R WHERE R.CD_PRENDA = ${prenda.IdPrenda})
        //                 AND CH_ACTIVE = 1`, params);
        //             if (listImg && listImg.length > 0){
        //                 socket.emit('getPrendasByArmarioImgResponse',{"IdPrenda":prenda.IdPrenda, "BiImg":listImg[0].BiStream})
        //             }
        //         }
                
        //     } catch(ex) {
        //         LogFile.writeLog('ERROR - getPrendasByArmario: ' + ex.message);
        //     }
        // });

        socket.on('getArmario',async (idArmario) => {
            try {
                var armario = await DClosets.Id(accessDB, idArmario);
                socket.emit('getArmarioResponse',armario);
            } catch(ex) {
                LogFile.writeLog('ERROR - getArmario: ' + ex.message);
            }
        });
        socket.on('getListArmarios', async () => {
            try {
                var params = new DBParams;
                var listArmarios = await DClosets.Find(accessDB, `AND CD_USER = ${params.addParams(accessDB.user)}`, params);
                var response = [];
                for (var elm in listArmarios){
                    response.push({"value":listArmarios[elm].IdClosets, "text":listArmarios[elm].TxName});
                }
                socket.emit('getListArmariosResponse', response);
            } catch(ex) {
                LogFile.writeLog('ERROR - getListArmarios: ' + ex.message);
            }
        });

        // TODO: Por hacer
        socket.on('setPwTEST', async (request) => {
            try {
                if (await bcrypt.compare(loginParams.pw,user[0].TxPassword)){
                    // Comparamos la contraseña
                    var user = await DUsers.Id(accessDB, accessDB.user);
                    user.TxPassword = await bcrypt.hash(request.newPw, 10);
                    await user.Update(accessDB);
                    socket.emit("mensaje", true); 
                } else {
                    socket.emit("mensaje", false); 
                }
            } catch (ex) {
                LogFile.writeLog('ERROR - setPwTEST: ' + ex.message);
            }
        });

        socket.on('getMenus', async () => {
            try {
                var params = new DBParams;
                var menus = await DMenus.Find(accessDB, `AND ID_MENU IN (
                        SELECT PM.CD_MENU
                        FROM R_PROFILES_MENUS PM
                            ,R_PROFILES_USERS PU
                        WHERE PM.CD_PROFILE = PU.CD_PROFILE
                            AND PU.CD_USER = ${params.addParams(accessDB.user)}
                            AND PU.CH_ACTIVE = 1
                            AND PM.CH_ACTIVE = 1)
                    AND CH_ACTIVE = 1`, params);
                socket.emit("Menus", menus); 
            } catch (ex) {
                LogFile.writeLog('ERROR - getMenus: ' + ex.message);
            }
        });

        socket.on('createUser', async (user) => {
            try {
                var user = new DUsers(null, user.TxName, user.TxLogin);
                await user.Insert(accessDB);
            } catch (ex) {

            }
        })

        socket.on('disconnect', () => {
            console.log((new Date()) + ' => Usuario desconectado');
        });

        socket.on('test',(msg) => {
            console.log('Petición tipo test: ' + msg);
            io.emit("mensaje",'Hola desde la API');
        });

        socket.on('TestPrenda', async () => {
            try {
                var prenda = await DPrendas.Id(accessDB, 1);
                socket.emit("TEST", prenda.getData());
            } catch (ex){
                LogFile.writeLog('ERROR - TestPrenda: ' + ex.message);
            }
        });

        socket.on('TestMenu', async () => {
            try {
                var menu1 = new DMenus(1);
                await menu1.Read(accessDB,1);
                console.log(menu1);
                socket.emit("TEST", menu1);
            } catch (ex){
                LogFile.writeLog('ERROR - TestMenu: ' + ex.message);
            }
        });

        socket.on('TestClosets', async (idClosets) => {
            try {
                var closet = await DClosets.Id(accessDB, idClosets);
                socket.emit("TEST", (closet)? closet.getData(): null);
            } catch (ex){
                LogFile.writeLog('ERROR - TestClosets: ' + ex.message);
            }
        });

        socket.on('TestUser', async () => {
            try {
                //var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var user = await DUsers.Id(accessDB, 1);
                socket.emit("TEST", (user)? user.getData(): null);
            } catch (ex){
                LogFile.writeLog('ERROR - TestUser: ' + ex.message);
            }
        });

        socket.on('TestParams', async () => {
            try {
                //var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var params = new DBParams;
                var menu = await DMenus.Find(accessDB, `AND TX_NAME = ${params.addParams("Inicio")}`, params);
                socket.emit("TEST", menu);
            } catch (ex){
                LogFile.writeLog('ERROR - TestParams: ' + ex.message);
            }
        });

        socket.on('TestInsert', async () => {
            try {
                var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var newClosets = new DClosets(null, "Calcetines", 1, "Calcetines cortos", 1);
                console.log('ANTES:');
                console.log(newClosets);
                await newClosets.Insert(accessDB);
                console.log('DESPUES:');
                console.log(newClosets);
                socket.emit("TEST", newClosets);
            } catch (ex){
                LogFile.writeLog('ERROR - TestInsert: ' + ex.message);
            }
        });

        socket.on('TestUpdate', async (idClosets) => {
            try {
                var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var closet = await DClosets.Id(accessDB, idClosets);
                console.log("ANTES");
                console.log(closet);
                closet.CdUser = 10;
                if (await closet.Update(accessDB) > 0){
                    console.log("DESPUES");
                    console.log(closet);
                    socket.emit("TEST", "OK");

                } else {
                    socket.emit("TEST", "ERROR");

                }
            } catch (ex){
                LogFile.writeLog('ERROR - TestUpdate: ' + ex.message);
            }
        });
    }

    static authenticationByToken(socket, token){
        if (!token) {
            token = CallAPI.getTokenInHead(socket);
        }
        var user = CallAPI.checkToken(token);
        if (user){
            return user;
        } else {
            // if (socket){
            //     socket.emit('withAccess', false);
            // }
            throw {message: 'Token no valido'};
        }
    }

    static checkToken(token){
        if (!token){
            // No tenemos token
            return null;
        } else { 
            var payload = null;
            try {    
                payload = jwt.decode(token, PARAMS.TOKEN_KEY);
                if (payload.exp > (Date.now() / 1000)) {
                    return payload.sub;
                } else {
                    // Token exirado
                    LogFile.writeLog(`Token del usuario ${payload.sub} a expirado`);
                    return null;
                }    
            } catch (ex){
                LogFile.writeLog('ERROR - checkToken: ' + ex.message);
                return null;
            }
        }
    }

    static getToken(idUser){
        var fechEnd = new Date(Date.now());
        fechEnd.setDate(fechEnd.getDate() + 14);
        var payload = {
            sub: idUser,
            iat: Math.floor(Date.now() / 1000),
            exp: fechEnd.getTime(),
          };
          return jwt.encode(payload, PARAMS.TOKEN_KEY);
    }

    static getTokenInHead(socket){
        return socket.handshake.auth.token;
    }
}

module.exports = CallAPI;