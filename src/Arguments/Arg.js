const validCommands = ['show'];
const validTypes = {
  show: ['monster', 'weapon'],
};
const isCommandValid = command => validCommands.includes(command);

const isTypeValid = (command, type) => validTypes[command].includes(type);

exports.isCommandValid = isCommandValid;
exports.isTypeValid = isTypeValid;

exports.validCommands = validCommands;
exports.validTypes = validTypes;
