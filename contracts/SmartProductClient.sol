// What I've learned: 

// 1. ERC721 token holders must implement ERC721Receiver and not ERC721Holder. 
// 2. When you get "The contract code couldn't be stored, please check your gas amount", it usually means 
// that you have not fully implemented an interface. In my case, I didn't implement the constructor properly. 
// You have to add your interfaces constructor as well, sort of like base() in c#. 

pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol";
import "./SmartProductLicense.sol";
import "./Company.sol";

contract SmartProductClient is ERC721Receiver {

    SmartProductLicense _smartProductLicense;
    mapping(address => address) _clientCompany;
    mapping(address => bool) _clients;
    address _owner;
    string _clientUri;

    event ReceivedERC721Token(address indexed _sender, bytes32 message);
    
    function onERC721Received(address, uint256, bytes) public returns(bytes4) {
        return ERC721_RECEIVED;
    }

    constructor (address smartProductLicense, string clientUri) public ERC721Receiver()
    {
        _smartProductLicense = SmartProductLicense(smartProductLicense);
        _clientUri = clientUri;
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
    
    function getClientUri() public view returns(string) {
        return _clientUri;
    }

    function sendSmartLicenseToken(address destination, uint256 tokenId) public {
        require(msg.sender == _owner);
        _smartProductLicense.safeTransferFrom(address(this), destination, tokenId);
    }

    function registerCompany(address company) public {
        Company(company).registerClient(address(this));
        _clientCompany[msg.sender] = company;
    }

    function checkoutLicense(address company) public {
        require(_clientCompany[msg.sender] != 0);
        Company(_clientCompany[msg.sender]).checkoutLicenseToken(msg.sender);
        
    }

    
}