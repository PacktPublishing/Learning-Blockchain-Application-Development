pragma solidity ^0.4.23;

contract Merchandise {
    address owner;
    bool online;
    struct Item {
        uint itemId;
        address seller;
        address buyer;
        string itemName;
        string itemDesc;
        uint itemPrice;
        bool sold;
        bool shipped;
        bool received;
    }

    Item[] public items;

    constructor() public {
        owner = msg.sender;
        online = true;
        // addItem("First Item", "Added by Contract deployment", 1 ether);
    }

    function kill() public {
        require(msg.sender == owner);
        selfdestruct(owner);
    }

    function setOnline(bool status) public {
        require(msg.sender == owner);
        online = status;
    }

    event AddListing(
        address seller,
        string name,
        uint price
    );

    function addItem(string name, string description, uint price) public returns(uint) {
        require(online == true);
        require(price > 0, "Price must be greater than zero");
        uint initialLength = items.length;
        items.push(Item({
            itemId: items.length,
            seller: msg.sender,
            buyer: address(0),
            itemName: name,
            itemDesc: description,
            itemPrice: price,
            sold: false,
            shipped: false,
            received: false
        }));
        emit AddListing(msg.sender, name, price);
        assert(items.length == initialLength + 1);
        return items.length;
    }

    function getItem(uint itemId) public view returns(
        uint, string, string, uint, bool, bool, bool
    ) {
        return (
            items[itemId].itemId,
            items[itemId].itemName,
            items[itemId].itemDesc,
            items[itemId].itemPrice,
            items[itemId].sold,
            items[itemId].shipped,
            items[itemId].received
        );
    }

    function buyItem(uint itemId) public payable returns(bool) {
        require(online = true);
        require(msg.value == items[itemId].itemPrice);
        require(items[itemId].sold != true);
        items[itemId].buyer = msg.sender;
        items[itemId].sold = true;
        return true;
    }

    function shipItem(uint itemId) public {
        require(items[itemId].sold == true);
        items[itemId].shipped = true;
    }

    function receiveItem(uint itemId) public {
        require(items[itemId].shipped == true);
        require(msg.sender == items[itemId].buyer);
        items[itemId].received = true;
    }

    function claimFunds(uint itemId) public {
        require(online == true);
        require(msg.sender == items[itemId].seller);
        msg.sender.transfer(items[itemId].itemPrice);
    }

}