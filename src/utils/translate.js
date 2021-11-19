const names = require('../languages/names');

module.exports.translate = function(name, target = 'en') {
  return names['de'][name][target];
}