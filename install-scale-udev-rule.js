var exec = require('child_process').exec;

if (process.getuid() !== 0) {
  console.error("ERROR: Install must be run as root.");
  process.exit(1)
}

var cp = 'cp extras/scale.rules /etc/udev/rules.d/51-scale.rules';
var restart = 'service udev restart';

exec(cp, function(error, stdout, stderr) {
  exec(restart, function(error, stdout, stderr) {
    console.log("SUCCESS: Rules File Installed");
    process.exit(0);
  })
});