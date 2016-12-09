var noble = require('noble');
var crc = require('crc');
var sys = require('util')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

var proximityThreshold = 65;
var state = "outside";

noble.on('stateChange', function(state) {
  if (state === 'poweredOn')
    noble.startScanning([], true);
  else
    noble.stopScanning();
});

noble.on('discover', function(peripheral) {
    if (peripheral.advertisement.localName === "Tile"){
      var proximity = Math.abs(peripheral.rssi);
      console.log(peripheral.uuid + ' ' + peripheral.advertisement.localName + ' ' + proximity);
      if (proximity <= proximityThreshold && state === "outside"){
          console.log("inside threshold");
          //exec("/home/pi/[SCRIPT_OR_BINARY_TO_EXECUTE]");
          state="inside";
      }else if (proximity >= proximityThreshold && state === "inside"){
          console.log("outside threshold");
          //exec("/home/pi/[SCRIPT_OR_BINARY_TO_EXECUTE]");
          state="outside";
      }
    }
});

// Handle clean exit event
process.stdin.resume();//so the program will not close instantly
function exitHandler(options, err) {
    console.log('stopScanning & exit');
    noble.stopScanning();
    process.exit();
}
// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
