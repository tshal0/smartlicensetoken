import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { utils } from 'mocha';
var customUtils = require("./customUtils.js");
chai.use(chaiAsPromised)
const { expect, assert } = chai

var Company = artifacts.require("Company");
var SmartProductLicense = artifacts.require("SmartProductLicense");

contract('Testing Company contract', function(accounts) {

    let company;
    let token;
    const name="SmartProductLicenseToken";
    const symbol="SLT";
    const account1 = accounts[1]

    const account2 = accounts[2]

    const account3 = accounts[3]

    it(' should be able to deploy Company', async () => {
        token = await SmartProductLicense.new(name, symbol);
        company = await Company.new(token.address, "companyuri");

        expect(await company.getCompanyUri()).to.equal("companyuri");
    })

    it(' should be able to register and remove clients', async () => {
        await company.registerClient(account1);
        expect(await company.clientExists(account1)).to.equal(true);
        await company.removeClient(account1);
        expect(await company.clientExists(account1)).to.equal(false);
        await company.registerClient(account1);
    })

    it(' should be able to receive tokens', async () => {
        let result = await token.mintUniqueTokenTo(company.address, 1000, "tokenuri", {from: accounts[0]})
            .then(() => customUtils.assertEvent(token, {event: "Transfer", logIndex: 0, args:{_from: '0x0000000000000000000000000000000000000000', _to: company.address}})
                .then((log) => { })
                .catch((err) => { assert(false, err); })
            );
        expect(await token.ownerOf(1000)).to.equal(company.address);
    })

    it(' should be able to transfer tokens', async () => {
        await company.sendSmartLicenseToken(account1, 1000);
            
        expect(await token.ownerOf(1000)).to.equal(account1);
    })

    it(' should be able to allow user get all licenses owned by company', async () => {
        let tokens;
        await token.mintUniqueTokenTo(company.address, 1001, "tokenuri", {from: accounts[0]});
        await token.mintUniqueTokenTo(company.address, 1002, "tokenuri", {from: accounts[0]});
        await token.mintUniqueTokenTo(company.address, 1003, "tokenuri", {from: accounts[0]});
        await company.getLicenseTokens().then((bigNumTokens) => {
            tokens = bigNumTokens.map(t => t.toFixed());
        })

        //company.getLicenseTokens.estimateGas().then((g) => {console.log(g)});
        
        expect(tokens).to.eql(['1001', '1002', '1003']);

        await token.tokenURI(parseInt(tokens[0])).then((tokenUri) => {
            
        })
    })

    it(' should be able to allow client to checkout license', async () => {
        let tokens;
        await company.getLicenseTokens().then((bigNumTokens) => {
            tokens = bigNumTokens.map(t => parseInt(t.toFixed()));
        });
        
        await company.checkoutLicenseToken(tokens[0], {from: account1});
        expect(await company.hasCheckedOutLicense(tokens[0], {from: account1})).to.eql(true);
    })

    it(' should allow client to checkin license', async () => {
        let tokens;
        await company.getLicenseTokens().then((bigNumTokens) => {
            tokens = bigNumTokens.map(t => parseInt(t.toFixed()));
        });
        await company.checkinLicenseToken(tokens[0], {from: account1});
        expect(await company.hasCheckedOutLicense(tokens[0], {from: account1})).to.eql(false);
    })
});