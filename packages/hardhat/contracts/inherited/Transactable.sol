pragma solidity 0.8.0;
import './Pausable.sol';

// SPDX-License-Identifier: UNLICENSED

// Handles raw ETH balance of a contract.
contract Transactable is Pausable {
    
    event receipt(
        address recipiant, 
        uint256 amount);
    
    modifier Costs(uint256 cost){
        require(msg.value >= cost, 'Insufficient funds sent.');
        _;
    }

    // Absorb ETH
    receive() external payable Unpaused {
        emit receipt(msg.sender, msg.value);
    }
    
    // Safely release ETH
    function send(address payable to, uint256 amount) internal Unpaused {
        require(amount <= address(this).balance, 'Insufficient funds available.');
        to.transfer(amount);  // reverts on fail.
        emit receipt(to, amount);
    }
}