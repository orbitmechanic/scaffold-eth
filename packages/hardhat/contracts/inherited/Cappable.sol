pragma solidity 0.8.0;
import "hardhat/console.sol";
import './Mintable.sol';

// SPDX-License-Identifier: UNLICENSED

contract Cappable is Mintable {
    
    constructor (uint256 _cap) {
        _uint['supplyCap'] = _cap;
    }

    function cap() public view returns(uint256) {
        return _uint['supplyCap'];
    }
}