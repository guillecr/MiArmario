const DMenus = require('../Entities/DMenus');
const DBParams = require('../Utils/DBParamas');
const LogFile = require('../Utils/LogFile');

class PagTest {

    static async getMenus2(socket){
        console.log('getMenus2');
        try {
            var params = new DBParams;
            // var menus = await DMenus.Find(socket.accessDB, `AND ID_MENU IN (
            //         SELECT PM.CD_MENU
            //         FROM R_PROFILES_MENUS PM
            //             ,R_PROFILES_USERS PU
            //         WHERE PM.CD_PROFILE = PU.CD_PROFILE
            //             AND PU.CD_USER = ${params.addParams(socket.accessDB.user)}
            //             AND PU.CH_ACTIVE = 1
            //             AND PM.CH_ACTIVE = 1)
            //     AND CH_ACTIVE = 1`, params);
            // console.log(menus);
            // socket.emit("Menus", menus); 
        } catch (ex) {
            LogFile.writeLog('ERROR - getMenus: ' + ex.message);
        }
    }

    static calls(socket){
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
}

module.exports = PagTest;