pragma solidity 0.4.24;

interface IBinancePeggyToken {
    function initialize(string name, string symbol, uint8 decimals, address owner) public;
    function changeAdmin(address newAdmin) external;
}