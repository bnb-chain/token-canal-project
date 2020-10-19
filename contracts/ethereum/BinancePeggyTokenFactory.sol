pragma solidity 0.4.24;

import './AdminUpgradeabilityProxy.sol';
import '../interface/IBinancePeggyToken.sol';


contract BinancePeggyTokenFactory {

    address public logicImplement;

    event TokenCreated(address indexed token);

    constructor(address _logicImplement) public {
        logicImplement = _logicImplement;
    }

    function createPeggyToken(string name, string symbol, uint8 decimals, address owner, address admin) external returns (address) {
        IBinancePeggyToken token = IBinancePeggyToken(new AdminUpgradeabilityProxy(logicImplement));
        token.changeAdmin(admin);
        token.initialize(name, symbol, decimals, owner);
        emit TokenCreated(address(token));
        return address(token);
    }
}