pragma solidity 0.5.0;

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
        require(msg.sender == owner, "Only contract owner can kill contract");
        selfdestruct(msg.sender); // Can only transfer funds to "address payable" types so use msg.sender here
    }

    function setOnline(bool status) public {
        require(msg.sender == owner, "Only contract onwer can set online status");
        online = status;
    }

    event AddListing(
        address seller,
        string name,
        uint price
    );

    function addItem(string memory name, string memory description, uint price) public returns(uint) {
        require(online == true, "Adding items not allowed when store is offline");
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
        uint, string memory, string memory, uint, bool, bool, bool
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
        require(online = true, "Store must be online to buy items");
        require(msg.value == items[itemId].itemPrice, "Eth submitted must equal purchase price");
        require(items[itemId].sold != true, "Cannot purchase items already sold");
        items[itemId].buyer = msg.sender;
        items[itemId].sold = true;
        return true;
    }

    function shipItem(uint itemId) public {
        require(items[itemId].sold == true, "Cannot ship unsold items");
        items[itemId].shipped = true;
    }

    function receiveItem(uint itemId) public {
        require(items[itemId].shipped == true, "Cannot receive unshipped items");
        require(msg.sender == items[itemId].buyer, "Only buyer can mark item as received");
        items[itemId].received = true;
    }

    function claimFunds(uint itemId) public {
        require(online == true, "Store must be online to claim funds");
        require(msg.sender == items[itemId].seller, "Only seller can claim funds");
        require(items[itemId].received == true, "Cannot claim funds until item received");
        msg.sender.transfer(items[itemId].itemPrice);
    }

}
