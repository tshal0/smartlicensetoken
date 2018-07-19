const SmartProductLicense = artifacts.require("./SmartProductLicense.sol");
const Company = artifacts.require("./Company.sol");
const SmartProduct = artifacts.require("./SmartProduct.sol");
module.exports = async function(deployer) {
  await deployer.deploy(SmartProductLicense, "SmartProductLicense", "SmartProductLicense");
  const erc721 = await SmartProductLicense.deployed();
  await deployer.deploy(SmartProduct, "SmartProduct", erc721.address);
  await deployer.deploy(Company, "SmartCompany", erc721.address);
  await Company.deployed()
};