const tools = {
    getCookie: function(name){
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++){
            var c = ca[i];
            // Quitar espacios en blanco
            while (c.charAt(0) == ' '){
                c = c.substring(1);
            }
            if (c.indexOf(nameEQ) != -1){
                return c.substring(nameEQ.length,c.length);
            }
        }
    },
    getParamsURL(name){
        var url = window.location.href;
        return new URL(url).searchParams.get(name);
    },
    pauseEvent(e){
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBbble = true;
        e.returnValue = false;
        return false;
    },
    emitCall(component, eventName, request, callBack){
        // Creamos la subscripción a la respuesta del servicio llamado. Cuando obtengamos la respuesta, nos desubscribimos.
        var serviceNameFull = `${component.serviceName}.${eventName}`;
        component.sockets.subscribe(`${serviceNameFull}.Response`, function(response){
            // TODO: Una manera mas lista de unsubscribe, por si no nos llega respuesta
            component.sockets.unsubscribe(`${serviceNameFull}.Response`);
            callBack(response);
        });
        component.$socket.emit(serviceNameFull, request);
    }
}

export default tools;