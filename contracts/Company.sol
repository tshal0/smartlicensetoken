// What I've learned: 

// 1. ERC721 token holders must implement ERC721Receiver and not ERC721Holder. 
// 2. When you get "The contract code couldn't be stored, please check your gas amount", it usually means 
// that you have not fully implemented an interface. In my case, I didn't implement the constructor properly. 
// You have to add your interfaces constructor as well, sort of like base() in c#. 

pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol";

contract Company is ERC721Receiver {

    mapping(address => uint) _clients;
    mapping(string => uint) _licenseTokens;
    address _owner;
    address[] _users;
    string _companyUri;
    
    function onERC721Received(address, uint256, bytes) public returns(bytes4) {
        return ERC721_RECEIVED;
    }

    constructor (string companyUri) public ERC721Receiver()
    {
        _companyUri = companyUri;
        _owner = msg.sender;
    }

    function() payable public {
        revert();
    }

    function kill() public {
        if (msg.sender == _owner) {
            selfdestruct(_owner);
        }
    }

    function registerUser(address user) public {
        _users.push(user);
    }

}