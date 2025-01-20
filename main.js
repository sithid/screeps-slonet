const BotNetwork = require('./botNetwork');
const botNetwork = new BotNetwork();

module.exports.loop = function () {
    botNetwork.update();
}