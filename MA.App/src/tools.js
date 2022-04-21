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
    }
}

export default tools;