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
        socket.on(this.name + "." + funName, async(requestCall) => {
            if (requestCall && requestCall.idResponseEvent) {           
                var response = false;
                var request = requestCall.request;
                try {
                    response = await this[funName](socket.accessDB, request);
                } catch(ex){
                    LogFile.writeLog(`ERROR - ${this.name + "." + funName}: ${ex.message}`);
                }
                socket.emit(this.name + "." + funName + "." + requestCall.idResponseEvent + ".Response", response);
            } else {
                // Llamada mal contruida
                LogFile.writeLog(`ERROR - ${this.name + "." + funName}: "Llamada mal construida"`);
            }
        });
    }
}

module.exports = CallService;