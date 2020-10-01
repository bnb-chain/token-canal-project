const BinanceBTC = artifacts.require("BinanceBTC");
const AdminUpgradeabilityProxy = artifacts.require("AdminUpgradeabilityProxy");

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
    await deployer.deploy(BinanceBTC);
    await deployer.deploy(AdminUpgradeabilityProxy, BinanceBTC.address);
  });
};
