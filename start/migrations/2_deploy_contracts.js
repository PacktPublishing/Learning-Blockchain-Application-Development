var Merchandise = artifacts.require("./Merchandise.sol");

module.exports = function(deployer) {
  deployer.deploy(Merchandise);
};
