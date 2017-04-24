const fs = require('fs');
var dateFormat = require('dateformat');
var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

export default function addLog(action,result,hrend) {
  var res = JSON.stringify(result);

 fs.appendFile('./action.log', '\n\n' +day+' '+ action +' '+ res +
 	', Execution time: '+hrend[0]+'s '+hrend[1]/1000000+'ms ' , function(err){
      if (err)
        return console.log('Error writing to log file');
      console.log('Write in the log file perform!');   
    })
}