const got = require('got');
const messages = require('./messages');

module.exports = { runCommand };

async function runCommand(operation, target) {
  try {
    const parts = target.split('.');
    const type = parts.shift();
    const id = parts.shift();
    const property = parts.shift();
    const value = parts.join('.')

    await got.post('http://192.168.11.10:8181/rega.exe', {
      responseType: 'text',
      body: `dom.GetObject("${type}.${id}.${property}").State(${value});`
    });

    switch (operation) {
      case 'set_level':
        console.log(messages.get('successfullyAppliedLevel', value, id));
        break;
      case 'switch_state':
        console.log(messages.get(value === '1' ? 'successfullyTurnedOn' : 'successfullyTurnedOff', id));
        break;
      case 'apply_action':
        console.log(messages.get('successfullyAppliedAction', property, id));
        break;
    }
  } catch (error) {
    console.log(messages.get('failedOperation', operation, target));
  }
}
