const SmartLicense = artifacts.require("./SmartLicense.sol");
const Company = artifacts.require("./Company.sol");
module.exports = async function(deployer) {
  await deployer.deploy(SmartLicense, "SmartLicense", "SmartLicense");
  const erc721 = await SmartLicense.deployed();
  await deployer.deploy(Company, "Test", erc721.address);
  await Company.deployed()
};