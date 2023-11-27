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
    downscaleImage(dataUrl, newWidth, newHeight, imageType, imageArguments) {
        let image, oldWidth, oldHeight, newHeightReal, canvas, ctx;

        return new Promise((resolve, reject)=>{
            image = document.createElement("img");
            image.src = dataUrl;
            image.onload = function () {

                imageType = imageType || "image/jpeg";
                imageArguments = imageArguments || 0.6;
            
                // Creamos una imagen temporal en base a la original.
                oldWidth = image.width;
                oldHeight = image.height;
                if (!newHeight) {
                    newHeight = newWidth; // Por defecto, cuadradas
                }
                newHeightReal = Math.floor(oldHeight / oldWidth * newWidth);
                
            
                // Creamos un canva para dibujar la nueva imagen.
                canvas = document.createElement("canvas");
                canvas.width = newWidth;
                canvas.height = newHeight;
            
                // Dibuamos la nueva imagen comprimida en el canva
                ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, (newHeight - newHeightReal) / 2, newWidth, newHeightReal);
            
                // Obtenemos el dataURL de la nueva imagen comprimida
                //y hacemos un return.
                resolve(canvas.toDataURL(imageType, imageArguments));              
            }
        });
    }
}

export default tools;