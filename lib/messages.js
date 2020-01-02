const text = {
  chosenNotSupportedDevice: 'You have chosen a device which is not supported.',
  deviceTypeNotSupported: 'This type of device is not supported.',
  failedOperation: 'An error occured while performing "${0}" operation for query "${1}".',
  successfullyAppliedAction: 'Successfuly applied "${0}" action on device "${1}".',
  successfullyAppliedLevel: 'Successfully applied level "${0}" on device "${1}".',
  successfullyTurnedOff: 'Successfully turned off device "${0}".',
  successfullyTurnedOn: 'Successfully turned on device "${0}".',
}

const get = (id, ...replace) => {
  return text[id].replace(/\${(\d+)}/g, (match, marker) => replace[marker]);
}

module.exports = {
  text,
  get
};