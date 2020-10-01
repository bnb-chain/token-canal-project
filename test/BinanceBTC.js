const BinanceBTC = artifacts.require("BinanceBTC");
const AdminUpgradeabilityProxy = artifacts.require("AdminUpgradeabilityProxy");

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const fs = require('fs');

contract('AdminUpgradeabilityProxy', (accounts) => {
    it('Initilize', async  () => {
        const BTCBOwner = accounts[1];
        const jsonFile = "test/abi/BTCB.json";
        const abi= JSON.parse(fs.readFileSync(jsonFile));

        const binanceBTC = new web3.eth.Contract(abi, AdminUpgradeabilityProxy.address);
        const tx = await binanceBTC.methods.initialize("Binance BTC", "BTCB", 8, BTCBOwner).send({from: BTCBOwner});
        console.log(tx);
    });
    it('Test ERC20 query methods', async () => {
        const jsonFile = "test/abi/BTCB.json";
        const abi= JSON.parse(fs.readFileSync(jsonFile));

        BTCBOwner = accounts[1];

        const erc20 = new web3.eth.Contract(abi, AdminUpgradeabilityProxy.address);

        const name = await erc20.methods.name().call({from: BTCBOwner});
        assert.equal(name, "Binance BTC", "wrong token name");

        const symbol = await erc20.methods.symbol().call({from: BTCBOwner});
        assert.equal(symbol, "BTCB", "wrong token symbol");

        const decimals = await erc20.methods.decimals().call({from: BTCBOwner});
        assert.equal(decimals, 8, "wrong token decimals");

        const totalSupply = await erc20.methods.totalSupply().call({from: BTCBOwner});
        assert.equal(totalSupply, web3.utils.toBN(0), "wrong totalSupply");

        const erc20OwnerBalance = await erc20.methods.balanceOf(erc20Owner).call({from: BTCBOwner});
        assert.equal(erc20OwnerBalance, web3.utils.toBN(0), "wrong balance");

        const owner = await erc20.methods.getOwner().call({from: BTCBOwner});
        assert.equal(owner, BTCBOwner, "wrong owner");
    });
    //
    // it('Test erc20 transaction methods', async () => {
    //     const jsonFile = "test/abi/IBEP20.json";
    //     const abi= JSON.parse(fs.readFileSync(jsonFile));
    //
    //     erc20Owner = accounts[1];
    //
    //     const erc20 = new web3.eth.Contract(abi, AdminUpgradeabilityProxy.address);
    //
    //     const balanceOld = await erc20.methods.balanceOf(accounts[2]).call({from: erc20Owner});
    //     assert.equal(balanceOld, web3.utils.toBN(0), "wrong balance");
    //
    //     await erc20.methods.transfer(accounts[2], web3.utils.toBN(1e17)).send({from: erc20Owner});
    //
    //     const balanceNew = await erc20.methods.balanceOf(accounts[2]).call({from: erc20Owner});
    //     assert.equal(balanceNew, web3.utils.toBN(1e17), "wrong balance");
    //
    //     await erc20.methods.approve(accounts[3], web3.utils.toBN(1e17)).send({from: erc20Owner});
    //
    //     let allowance = await erc20.methods.allowance(erc20Owner, accounts[3]).call({from: accounts[3]});
    //     assert.equal(allowance, web3.utils.toBN(1e17), "wrong allowance");
    //
    //     await erc20.methods.transferFrom(erc20Owner, accounts[4], web3.utils.toBN(1e17)).send({from: accounts[3]});
    //
    //     allowance = await erc20.methods.allowance(erc20Owner, accounts[3]).call({from: accounts[3]});
    //     assert.equal(allowance, web3.utils.toBN(0), "wrong allowance");
    //     const balance = await erc20.methods.balanceOf(accounts[4]).call({from: accounts[4]});
    //     assert.equal(balance, web3.utils.toBN(1e17), "wrong balance");
    // });
    //
    // it('Test mint and burn', async () => {
    //     const jsonFile = "test/abi/BEP20Implementation.json";
    //     const abi= JSON.parse(fs.readFileSync(jsonFile));
    //
    //     erc20Owner = accounts[1];
    //
    //     const erc20 = new web3.eth.Contract(abi, AdminUpgradeabilityProxy.address);
    //
    //     let totalSupply = await erc20.methods.totalSupply().call({from: erc20Owner});
    //     assert.equal(totalSupply, web3.utils.toBN(1e18), "wrong totalSupply");
    //
    //     await erc20.methods.mint(web3.utils.toBN(9e18)).send({from: erc20Owner});
    //
    //     totalSupply = await erc20.methods.totalSupply().call({from: erc20Owner});
    //     assert.equal(totalSupply, web3.utils.toBN(10e18), "wrong totalSupply");
    //
    //     await erc20.methods.transfer(accounts[5], web3.utils.toBN(2e18)).send({from: erc20Owner});
    //     await erc20.methods.burn(web3.utils.toBN(2e18)).send({from: accounts[5]});
    //
    //     totalSupply = await erc20.methods.totalSupply().call({from: accounts[5]});
    //     assert.equal(totalSupply, web3.utils.toBN(8e18), "wrong totalSupply");
    // });
});
