const alfy = require('alfy');
const model = require('./device-model');
const list = require('./device-list');
const executor = require('./command-executor');

module.exports = { runOperation }

async function runOperation(operation, query) {
  switch (operation) {
    case 'list':
      return alfy.output(list.getDeviceList(await model.resolveModel(), [], '', query));
    case 'switch':
      return executor.runCommand('switch', query);
    case 'message':
      return console.log(query);
    default:
      return alfy.error(`invalid operation "${operation}"`)
  }
}
