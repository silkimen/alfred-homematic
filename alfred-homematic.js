const alfy = require('alfy');
const hm = require('./lib/homematic');

const input = alfy.input.split(' ');
const operation = input.shift().toLowerCase();
const query = input.join(' ');

hm.runOperation(operation, query);
