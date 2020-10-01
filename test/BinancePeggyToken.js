const BinancePeggyToken = artifacts.require("BinancePeggyToken");
const BinancePeggyTokenTest = artifacts.require("BinancePeggyTokenTest");
const AdminUpgradeabilityProxy = artifacts.require("AdminUpgradeabilityProxy");
const ABCToken = artifacts.require("ABCToken");

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const fs = require('fs');

contract('AdminUpgradeabilityProxy', (accounts) => {
    it('Initilize', async  () => {
        const BTCBOwner = accounts[1];
        const jsonFile = "test/abi/BTCB.json";
        const abi= JSON.parse(fs.readFileSync(jsonFile));

        const binanceBTC = new web3.eth.Contract(abi, AdminUpgradeabilityProxy.address);
        await binanceBTC.methods.initialize("Binance BTC", "BTCB", 8, BTCBOwner).send({from: BTCBOwner, gas: 4700000});
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

        const BTCBOwnerBalance = await erc20.methods.balanceOf(BTCBOwner).call({from: BTCBOwner});
        assert.equal(BTCBOwnerBalance, web3.utils.toBN(0), "wrong balance");
    });
    it('Test mint and burn', async () => {
        const jsonFile = "test/abi/BTCB.json";
        const abi= JSON.parse(fs.readFileSync(jsonFile));

        BTCBOwner = accounts[1];

        const erc20 = new web3.eth.Contract(abi, AdminUpgradeabilityProxy.address);

        let totalSupply = await erc20.methods.totalSupply().call({from: BTCBOwner});
        assert.equal(totalSupply, web3.utils.toBN(0), "wrong totalSupply");

        await erc20.methods.mint(BTCBOwner, web3.utils.toBN(10000e8)).send({from: BTCBOwner, gas: 4700000});

        totalSupply = await erc20.methods.totalSupply().call({from: BTCBOwner});
        assert.equal(totalSupply, web3.utils.toBN(10000e8), "wrong totalSupply");

        await erc20.methods.transfer(accounts[5], web3.utils.toBN(1e8)).send({from: BTCBOwner, gas: 4700000});

        await erc20.methods.burn(web3.utils.toBN(1e8)).send({from: BTCBOwner, gas: 4700000});

        totalSupply = await erc20.methods.totalSupply().call({from: BTCBOwner});
        assert.equal(totalSupply, web3.utils.toBN(9999e8), "wrong totalSupply");
    });

    it('Test erc20 transaction methods', async () => {
        const jsonFile = "test/abi/BTCB.json";
        const abi= JSON.parse(fs.readFileSync(jsonFile));

        BTCBOwner = accounts[1];

        const erc20 = new web3.eth.Contract(abi, AdminUpgradeabilityProxy.address);

        const balanceOld = await erc20.methods.balanceOf(accounts[2]).call({from: BTCBOwner});
        assert.equal(balanceOld, web3.utils.toBN(0), "wrong balance");

        await erc20.methods.transfer(accounts[2], web3.utils.toBN(1e8)).send({from: BTCBOwner, gas: 4700000});

        const balanceNew = await erc20.methods.balanceOf(accounts[2]).call({from: BTCBOwner});
        assert.equal(balanceNew, web3.utils.toBN(1e8), "wrong balance");

        await erc20.methods.approve(accounts[3], web3.utils.toBN(2e8)).send({from: BTCBOwner, gas: 4700000});

        let allowance = await erc20.methods.allowance(BTCBOwner, accounts[3]).call({from: accounts[3]});
        assert.equal(allowance, web3.utils.toBN(2e8), "wrong allowance");

        await erc20.methods.transferFrom(BTCBOwner, accounts[4], web3.utils.toBN(2e8)).send({from: accounts[3], gas: 4700000});

        allowance = await erc20.methods.allowance(BTCBOwner, accounts[3]).call({from: accounts[3]});
        assert.equal(allowance, web3.utils.toBN(0), "wrong allowance");
        const balance = await erc20.methods.balanceOf(accounts[4]).call({from: accounts[4]});
        assert.equal(balance, web3.utils.toBN(2e8), "wrong balance");
    });

    it('Test pause and unpause', async () => {
        const jsonFile = "test/abi/BTCB.json";
        const abi= JSON.parse(fs.readFileSync(jsonFile));

        BTCBOwner = accounts[1];

        const erc20 = new web3.eth.Contract(abi, AdminUpgradeabilityProxy.address);

        await erc20.methods.pause().send({from: BTCBOwner, gas: 4700000});

        const paused = await erc20.methods.paused().call({from: accounts[1]});
        assert.equal(paused, true, "wrong balance");

        try {
            await erc20.methods.transfer(accounts[3], web3.utils.toBN(1e8)).send({from: accounts[4], gas: 4700000});
            assert.fail();
        } catch (error) {
        }

        await erc20.methods.unpause().send({from: BTCBOwner, gas: 4700000});

        const balanceOld = await erc20.methods.balanceOf(accounts[6]).call({from: BTCBOwner});
        assert.equal(balanceOld, web3.utils.toBN(0), "wrong balance");

        await erc20.methods.transfer(accounts[6], web3.utils.toBN(1e8)).send({from: BTCBOwner, gas: 4700000});

        const balanceNew = await erc20.methods.balanceOf(accounts[6]).call({from: BTCBOwner});
        assert.equal(balanceNew, web3.utils.toBN(1e8), "wrong balance");
    });

    it('Test reclaim', async () => {
        const jsonFile = "test/abi/BTCB.json";
        const abi= JSON.parse(fs.readFileSync(jsonFile));

        const ERC20JsonFile = "test/abi/ERC20.json";
        const ERC20ABI= JSON.parse(fs.readFileSync(ERC20JsonFile));

        BTCBOwner = accounts[1];

        const btcb = new web3.eth.Contract(abi, AdminUpgradeabilityProxy.address);

        const abcToken = new web3.eth.Contract(ERC20ABI, ABCToken.address);

        const balance1 = await abcToken.methods.balanceOf(AdminUpgradeabilityProxy.address).call();
        assert.equal(balance1, web3.utils.toBN(0), "wrong balance");

        await abcToken.methods.transfer(AdminUpgradeabilityProxy.address, web3.utils.toBN(1e18)).send({from: accounts[0], gas: 4700000});

        const balance2 = await abcToken.methods.balanceOf(AdminUpgradeabilityProxy.address).call();
        assert.equal(balance2, web3.utils.toBN(1e18), "wrong balance");

        const balance3 = await abcToken.methods.balanceOf(BTCBOwner).call();
        assert.equal(balance3, web3.utils.toBN(0), "wrong balance");

        await btcb.methods.reclaimToken(ABCToken.address).send({from: BTCBOwner, gas: 4700000});

        const balance4 = await abcToken.methods.balanceOf(AdminUpgradeabilityProxy.address).call();
        assert.equal(balance4, web3.utils.toBN(0), "wrong balance");

        const balance5 = await abcToken.methods.balanceOf(BTCBOwner).call();
        assert.equal(balance5, web3.utils.toBN(1e18), "wrong balance");
    });

    it('Test upgrade', async () => {
        const upgradeProxyJsonFile = "test/abi/UpgradeProxy.json";
        const upgradeProxyAbi= JSON.parse(fs.readFileSync(upgradeProxyJsonFile));

        const upgradeProxy = new web3.eth.Contract(upgradeProxyAbi, AdminUpgradeabilityProxy.address);
        admin = accounts[0];

        const jsonFile = "test/abi/BTCBNew.json";
        const abi= JSON.parse(fs.readFileSync(jsonFile));

        const btcb = new web3.eth.Contract(abi, AdminUpgradeabilityProxy.address);

        const balanceOriginal = await btcb.methods.balanceOf(accounts[2]).call({from: BTCBOwner});

        await upgradeProxy.methods.upgradeTo(BinancePeggyTokenTest.address).send({from: admin, gas: 4700000});

        const message = await btcb.methods.testUpgrade().call({from: accounts[1]});
        assert.equal(message, "upgrade is successful", "wrong balance");

        const balanceAfterUpgrade = await btcb.methods.balanceOf(accounts[2]).call({from: BTCBOwner});
        assert.equal(balanceAfterUpgrade, balanceOriginal, "wrong balance");

        await btcb.methods.transfer(accounts[2], web3.utils.toBN(1e8)).send({from: BTCBOwner, gas: 4700000});

        const balanceNew = await btcb.methods.balanceOf(accounts[2]).call({from: BTCBOwner});
        assert.equal(web3.utils.toBN(balanceNew.toString()).sub(web3.utils.toBN(balanceAfterUpgrade.toString())).eq(web3.utils.toBN(1e8)), true, "wrong balance");
    });
});
