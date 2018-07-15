const SmartLicense = artifacts.require("./SmartLicense.sol");

module.exports = async function(deployer) {
  await deployer.deploy(SmartLicense, "SmartLicense", "SmartLicense")
  const erc721 = await SmartLicense.deployed()
};