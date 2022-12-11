const fs = require('fs');

class LogFile {
    static UrlLog;

    static writeLog(txt){
        fs.writeFile(this.UrlLog, (new Date()) + ' => ' + txt + '\n', { flag: 'a' }, err => {
          if (err) {
            console.error('Error de escritura'); 
            console.error(this.UrlLog); 
            console.error(txt);  
            console.error(err);
          }
        });
    }
}

module.exports = LogFile