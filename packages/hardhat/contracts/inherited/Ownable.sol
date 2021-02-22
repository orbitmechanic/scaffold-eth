pragma solidity 0.8.0;
import "hardhat/console.sol";
import "./Storage.sol";

// SPDX-License-Identifier: UNLICENSED

contract Ownable is Storage{
    address public _owner;
    event OwnershipTransferred (address newOwner);

    modifier onlyOwner(){
        require(msg.sender == _payable['owner'],
            'Only the contract owner can do that.');
        _;
    }

    constructor() {
        _payable['owner'] = payable(msg.sender); 
    }

    function amIOwner() public view returns (bool) {
        return (address(msg.sender) ==  _payable['owner']); 
    }

    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != _payable['owner'], 
            'Cannot transfer ownership to yourself.');
        _payable['owner'] = newOwner;
        assert(_payable['owner'] == newOwner);
        emit OwnershipTransferred(newOwner);
    }

}
