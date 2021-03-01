pragma solidity 0.8.0;
import "hardhat/console.sol";
import './included/Mintable.sol';

// SPDX-License-Identifier: UNLICENSED

contract Burnable is Mintable {
    
    event burned(address from, uint256 amount)

    function burn(uint256 burnWeiWorth) public Unpaused returns(uint256){
        uint256 amountBurned = SafeMath.div(burnWeiWorth,_uint['price']);
        uint256 previousAmount = intMappings['balances'][msg.sender];
        uint256 newAmount = SafeMath.sub(previousAmount,amountBurned);
        _uint['totalSuppy'] = SafeMath.sub(_uint['totalSuppy'],amountBurned);
        intMappings['balances'][msg.sender] = newAmount;
        send(msg.sender,amountBurned);
        emit burned(msg.sender,amountBurned);
        return newAmount;
    }
}