const got = require('got');

module.exports = { runCommand };

async function runCommand(operation, target) {
  try {
    const parts = target.split('.');

    await got.post('http://192.168.11.10:8181/rega.exe', {
      responseType: 'text',
      body: `dom.GetObject("${parts[0]}.${parts[1]}.${parts[2]}").State(${parts[3]});`
    });

    console.log(`Successfully performed "${operation}" operation on "${target}".`);
  } catch (error) {
    console.log(`An error occured while performing "${operation}" operation on "${target}".`);
  }
}
