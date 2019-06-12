const alfy = require('alfy');
const fs = require('fs');
const got = require('got');
const path = require('path');
const hmScript = fs.readFileSync(path.join(__dirname, './model-query.hm'), 'utf8');

const CCU_ADDRESS = 'http://192.168.11.10:8181/rega.exe';
const CACHE_KEY = 'model_cache';
const CHARSET_ENCODING = 'latin1';

module.exports = { resolveModel };

function getIconEntry(iconName) {
  return { path: `./icons/${iconName}.png` }
}

function createSwitchActions(device) {
  const actions = [];

  actions.push({
    key: 'Turn On',
    icon: getIconEntry('light_on'),
    cmd: `switch ${device.interface}.${device.address}.STATE.1`
  });

  actions.push({
    key: 'Turn Off',
    icon: getIconEntry('light_off'),
    cmd: `switch ${device.interface}.${device.address}.STATE.0`
  });

  return actions;
}

function createBlindActions(device) {
  const actions = [];

  actions.push({
    key: 'Move up',
    icon: getIconEntry('blind_up'),
    cmd: `blind ${device.interface}.${device.address}.LEVEL.1`
  });

  actions.push({
    key: 'Stop',
    icon: getIconEntry('blind'),
    cmd: `blind ${device.interface}.${device.address}.STOP.1`
  });

  actions.push({
    key: 'Move down',
    icon: getIconEntry('blind_down'),
    cmd: `blind ${device.interface}.${device.address}.LEVEL.0`
  });

  return actions;
}

function createActions(device) {
  switch (device.type) {
    case 'SWITCH':
      return createSwitchActions(device);
    case 'BLIND':
      return createBlindActions(device);
    default:
      return [
        {
          key: 'This type of device is not supported',
          cmd: 'message checkSupportedDevices'
        }
      ];
  }
}

function createGroup(key) {
  return {
    key,
    items: []
  };
}

function createDevice(key) {
  return {
    key,
    items: [],
    interface: '',
    address: '',
    type: ''
  }
}

function mapModel(input) {
  const lines = input.split('\n');
  const model = [];

  let currentGroup;
  let currentDevice;

  lines.forEach(line => {
    if (line.startsWith('group:')) {
      currentGroup = createGroup(line.slice(6).trim());
      model.push(currentGroup);
    }

    if (line.startsWith('device:')) {
      currentDevice = createDevice(line.slice(7).trim());
      currentGroup.items.push(currentDevice);
    }

    if (line.startsWith('interface:')) {
      currentDevice.interface = line.slice(10).trim();
    }

    if (line.startsWith('address:')) {
      currentDevice.address = line.slice(8).trim();
    }

    if (line.startsWith('type:')) {
      currentDevice.type = line.slice(5).trim();
      currentDevice.items = createActions(currentDevice);
    }
  });

  return model;
}

async function resolveModel() {
  if (!alfy.cache.get(CACHE_KEY) || alfy.cache.isExpired(CACHE_KEY)) {
    const response = await got.post(CCU_ADDRESS, {
      responseType: 'text',
      body: hmScript,
      encoding: CHARSET_ENCODING
    });

    alfy.cache.set(CACHE_KEY, mapModel(response.body), { maxAge: 3600000 });
  }

  return alfy.cache.get(CACHE_KEY);
}
