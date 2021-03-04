pragma solidity 0.8.0;
import "hardhat/console.sol";
import '../included/SafeMath.sol';
import './Transactable.sol';

// SPDX-License-Identifier: UNLICENSED

contract Fungible is Transactable {
    
    event priceSet2(uint256 newPrice);

    event minted(address to, uint256 amount);

    constructor (){
        _uint['price'] = 1; // Start at pairity.
        _uint['totalSupply'] = 0; // in existance
        if (_uint['supplyCap'] == 0){ // in case of Cappable.
            unchecked{_uint['supplyCap'] = uint256(0) - 1;}
        }
    }

    function setPrice(uint256 _newPrice) public onlyOwner {
        _uint['price'] = _newPrice;
        emit priceSet2(_newPrice);
    }

    function price() public view returns (uint256) {
        return _uint['price'];
    }

    function totalSupply() public view returns (uint256){
        return _uint['totalSuppy'];
    }

    function mint() public payable Unpaused returns(uint256){
        uint256 amountPurchased = SafeMath.div(msg.value,_uint['price']);
        uint256 previousAmount = _intMappings['balances'][msg.sender];
        uint256 newAmount = SafeMath.add(previousAmount,amountPurchased);
        require(newAmount <= _uint['supplyCap'],'Exceeds total supply cap.');
        _uint['totalSuppy'] = SafeMath.add(_uint['totalSuppy'],amountPurchased);
        _intMappings['balances'][msg.sender] = newAmount;
        emit minted(msg.sender,amountPurchased);
        return newAmount;
    }

    function balanceOf(address somebody) public view returns (uint256 balance){
        return _intMappings['balances'][somebody];
    }

    function mybalance() public view returns(uint256 balance) {
        return _intMappings['balances'][msg.sender];
    }
}