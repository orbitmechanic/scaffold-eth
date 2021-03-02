pragma solidity 0.8.0;
import "hardhat/console.sol";
import '../included/SafeMath.sol';
import './Transactable.sol';

// SPDX-License-Identifier: UNLICENSED

contract Burnable is Transactable {
    
    event burned(address from, uint256 amount);

    function burn(uint256 burnWeiWorth) public Unpaused returns(uint256){
        uint256 amountBurned = SafeMath.div(burnWeiWorth,_uint['price']);
        uint256 previousAmount = _intMappings['balances'][msg.sender];
        uint256 newAmount = SafeMath.sub(previousAmount,amountBurned);
        _uint['totalSuppy'] = SafeMath.sub(_uint['totalSuppy'],amountBurned);
        _intMappings['balances'][msg.sender] = newAmount;
        send(payable(msg.sender),amountBurned);
        emit burned(msg.sender,amountBurned);
        return newAmount;
    }
}