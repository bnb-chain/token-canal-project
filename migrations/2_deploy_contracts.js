const BinancePeggyToken = artifacts.require("BinancePeggyToken");
const BinancePeggyTokenTest = artifacts.require("BinancePeggyTokenTest");
const AdminUpgradeabilityProxy = artifacts.require("AdminUpgradeabilityProxy");
const ABCToken = artifacts.require("ABCToken");

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
    await deployer.deploy(ABCToken, web3.utils.toBN(100e18), "ABC Token", 18, "ABC");
    await deployer.deploy(BinancePeggyToken);
    await deployer.deploy(BinancePeggyTokenTest);
    await deployer.deploy(AdminUpgradeabilityProxy, BinancePeggyToken.address);
  });
};
