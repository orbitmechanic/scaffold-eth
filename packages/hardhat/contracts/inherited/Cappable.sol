pragma solidity 0.8.0;
import "hardhat/console.sol";
import './included/Storage.sol';

// SPDX-License-Identifier: UNLICENSED

contract Cappable is Mintable {
    
    cosntructor(uint256 cap) {
        _uint['supplyCap'] = cap;
    }

    function cap() public view returns(uint256) {
        return _uint['supplyCap'];
    }
}