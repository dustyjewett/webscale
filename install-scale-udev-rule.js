var exec = require('child_process').exec;
var fs = require('fs');

var program = require('commander');
const DEFAULT_VENDOR = "2474";
const DEFAULT_PRODUCT = "0550";

program
  .on('--help', function() {
    console.log('Installs udev rules to allow access to the scale.\n');
    console.log('NOTE: MUST be run as sudo.\n');
  })
  .option('-l, --list', 'List Devices')
  .option('-v, --vendor', `Override Vendor ID (hex) [${DEFAULT_VENDOR}]`, DEFAULT_VENDOR)
  .option('-p, --product', `Override Product ID (hex) [${DEFAULT_PRODUCT}]`, DEFAULT_PRODUCT)
  .parse(process.argv);

if(program.list) {
  let devices = require('node-hid').devices();
  devices.forEach(function(item){
    item.vendorId_hex = item.vendorId.toString(16);
    item.productId_hex = item.productId.toString(16);
  });
  console.log(devices);
  console.log('\n')

} else {


  if (process.getuid() !== 0) {
    console.error("ERROR: Install must be run as root.");
    process.exit(1)
  }
  var vendor = program.vendor || DEFAULT_VENDOR;
  var product = program.product || DEFAULT_PRODUCT;
  var rule = `SUBSYSTEM=="usb", ATTR{idVendor}=="${vendor}", ATTR{idProduct}=="${product}", MODE="0776" SYMLINK="stamps_scale"`;
  var filename = '/etc/udev/rules.d/51-node-webscale.rules';
  var restart = 'service udev restart';

  fs.writeFile(filename, rule, function(error) {
    if (error) {
      console.error(error);
      process.exit(1);
    } else {
      exec(restart, function(error, stdout, stderr) {
        if (error) {
          console.error(error);
          process.exit(1);
        } else {
          console.log("SUCCESS: Rules File Installed");
          process.exit(0);

        }
      })
    }
  });
}
