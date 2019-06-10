const expect = require('chai').expect;
const dl = require('../lib/device-list');
const model = require('./model.mock');

describe('Device list processor', () => {
  it('filters groups correctly', () => {
    expect(dl.getDeviceList(model, [], '', 'gro').length).to.equal(2);
  });

  it('filters devices correctly', () => {
    expect(dl.getDeviceList(model, [], '', 'Group1 My').length).to.equal(1);
  });

  it('resolves group correctly', () => {
    expect(dl.getDeviceList(model, [], '', 'group1')).to.eql([{
      autocomplete: 'Group1 ',
      title: 'Group1',
      valid: false,
      arg: undefined
    }]);
  });

  it('resolves device correctly', () => {
    expect(dl.getDeviceList(model, [], '', 'Group1 My Device 3')).to.eql([{
      autocomplete: 'Group1 My Device 3 ',
      title: 'My Device 3',
      valid: false,
      arg: undefined
    }]);
  });
});
