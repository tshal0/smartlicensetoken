const Company = artifacts.require("./Company.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Company, "Test");
  const erc721 = await Company.deployed()
};