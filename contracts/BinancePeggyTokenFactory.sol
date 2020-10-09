pragma solidity 0.4.24;

import './AdminUpgradeabilityProxy.sol';
import './interface/IBinancePeggyToken.sol';


contract BinancePeggyTokenFactory {

    address public logicImplement;

    event TokenCreated(address indexed token);

    constructor(address _logicImplement) public {
        logicImplement = _logicImplement;
    }

    function createPeggyToken(string name, string symbol, uint8 decimals, address owner, address admin) external returns (address) {
        AdminUpgradeabilityProxy token = new AdminUpgradeabilityProxy(logicImplement);
        IBinancePeggyToken(address(token)).changeAdmin(admin);
        IBinancePeggyToken(address(token)).initialize(name, symbol, decimals, owner);
        emit TokenCreated(address(token));
        return address(token);
    }
}