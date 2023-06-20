class SocketEmit {
    serviceName;
    socket;
    lstSocket;
    constructor(socket, lstSocket, serviceName){
        this.socket = socket;
        this.lstSocket = lstSocket;
        this.serviceName = serviceName;
    }

    emitCall(eventName, request, callBack){
        // Creamos la subscripción a la respuesta del servicio llamado. Cuando obtengamos la respuesta, nos desubscribimos.
        // Para evitar solicitudes cruzadas en el mismo tiempo, cada llamada irá con un ID de respuesta.
        // De esa manera, cada solicitud tendrá un evento de respuesta único
        var cm = this;
        var idResponseEvent = Math.floor(Math.random() * 1000) + 1; // Sumamos 1 para evitar un ID = 0
        var requestCall = {idResponseEvent: idResponseEvent, request: request};
        var serviceNameFull = `${this.serviceName}.${eventName}`;

        this.lstSocket.subscribe(`${serviceNameFull}.${idResponseEvent}.Response`, function(response){
            clearTimeout(timpeUnsubscribe);
            cm.lstSocket.unsubscribe(`${serviceNameFull}.${idResponseEvent}.Response`);
            callBack(response);
        });
        this.socket.emit(serviceNameFull, requestCall, timeWait);
        if (!timeWait) {
            timeWait = 5000;
        }
        var timpeUnsubscribe = setTimeout(function() {
            console.log(`Llamada '${serviceNameFull}.${idResponseEvent}' perdida`);
            cm.lstSocket.unsubscribe(`${serviceNameFull}.${idResponseEvent}.Response`);
            callBack(false);
        }, timeWait);
    }
}

export default SocketEmit;