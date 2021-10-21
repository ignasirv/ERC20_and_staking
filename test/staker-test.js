const { expect } = require("chai");
const { ethers } = require("hardhat");
let owner;
let alice;
let bob;
let staker;
let rewardToken;
describe("Staker", function () {

    it("Should deploy RewardToken smart contract", async function () {
        const RewardToken = await ethers.getContractFactory("Staker");
        rewardToken  = await RewardToken.deploy(owner.address, 1000);
        await rewardToken.deployed();
    
        [owner, alice, bob] = await ethers.getSigners();
    
        expect(await vnrService.lockNamePrice()).to.equal("10000000000000000");
      });

})