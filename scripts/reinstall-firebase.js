const packageJson = require('../package.json');
const { spawn } = require('child_process');

function reinstallFirebase() {
  console.log(`Starting to re-install cordova-plugin-firebasex... Go grab some ☕️ or 🍔 while I'm at it. I will get back to you, as soon as I'm done!`);

  const firebaseVersion = packageJson.dependencies['cordova-plugin-firebasex'];

  let command = `ionic cordova plugin remove cordova-plugin-firebasex && ionic cordova plugin add cordova-plugin-firebasex@${firebaseVersion}`;

  const firebaseOptions = packageJson.cordova.plugins['cordova-plugin-firebasex'];

  for (const option in firebaseOptions) {
    if (firebaseOptions.hasOwnProperty(option)) {
      const value = firebaseOptions[option];

      command += ` --variable ${option}=${value}`;
    }
  }

  const npm = spawn(command, {
    cwd: process.cwd(),
    env: process.env,
    shell: true,
  });

  npm.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  npm.on('close', (code) => {
    console.log(`🎉 Fixed firebase for you! 🔥`);
  });
}

reinstallFirebase();