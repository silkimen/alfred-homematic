const alfy = require('alfy');
const model = require('./device-model');
const list = require('./device-list');
const executor = require('./command-executor');
const messages = require('./messages');

module.exports = { runOperation }

async function runOperation(operation, query) {
  switch (operation) {
    case 'list':
      return alfy.output(list.getDeviceList(await model.resolveModel(), [], '', query));
    case 'apply_action':
    case 'set_level':
    case 'switch_state':
      return executor.runCommand(operation, query);
    case 'message':
      return console.log(messages.text[query]);
    default:
      return alfy.error(`invalid operation "${operation}"`)
  }
}
