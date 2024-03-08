const winston = require('winston');

let today = new Date();

let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const logger =  winston.createLogger({
  
  transports: [
    new winston.transports.File({ filename: `./logs/logs-${date}_.log`, level: 'info',tailable:true, maxFiles:101 }),
  ],
  level: 'info'
});

module.exports = logger;