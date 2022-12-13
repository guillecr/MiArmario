const LogFile = require("./LogFile");

class CallService {

    static propExcluse = ["length","prototype", "calls", "name"];

    static createCalls(socket){
        var test = Object.getOwnPropertyNames(this);
        for (var indx in test){
            var prop = test[indx];
            if (this.propExcluse.indexOf(prop) < 0){
                this.createCall(socket, prop);
            }
            
        }
    }

    static createCall(socket, funName){
        socket.on(this.name + "." + funName, async(request) => {
            var response = false;
            try {
                response = await this[funName](socket.accessDB, request);
            } catch(ex){
                LogFile.writeLog(`ERROR - ${this.name + "." + funName}: ${ex.message}`);
            }
            socket.emit(this.name + "." + funName + ".Response", response);
        });
    }
}

module.exports = CallService;