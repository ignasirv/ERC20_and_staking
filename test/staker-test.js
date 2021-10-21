const { expect } = require("chai");
const { ethers } = require("hardhat");
let owner;
let alice;
let bob;
let staker;
let rewardToken;
const supply = "10000000000000000";

describe("Staker", function () {
  it("Should deploy RewardToken smart contract and check supply", async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const RewardToken = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardToken.deploy(owner.address, supply);
    await rewardToken.deployed();

    expect(await rewardToken.totalSupply()).to.equal(supply);
    expect(await rewardToken.balanceOf(owner.address)).to.equal(supply);
  });

  it("Should transfer tokens to Alice", async function () {
    await rewardToken.transfer(alice.address, supply / 4);

    expect(await rewardToken.totalSupply()).to.equal(supply);
    expect(await rewardToken.balanceOf(alice.address)).to.equal(supply / 4);
  });

  it("Should Deploy Staker and set reward distribution", async function () {
    const Staker = await ethers.getContractFactory("Staker");
    staker = await Staker.deploy(rewardToken.address, rewardToken.address);
    //Deploy staker
    await staker.deployed();
    //Set owner as rewards distribution
    await staker.setRewardsDistribution(owner.address);
    //Transfer tokens to staker for the rewards
    await rewardToken.transfer(staker.address, supply / 2);
    //Notify new reward amount
    await staker.notifyRewardAmount(supply / 2);

    expect(await staker.totalSupply()).to.equal(0);
    expect(await rewardToken.balanceOf(staker.address)).to.equal(supply / 2);
  });

  it("Should get last time reward applicable", async function () {
    const lastTimeRewardApplicable = await staker.lastTimeRewardApplicable();
    expect(parseInt(lastTimeRewardApplicable)).to.greaterThan(0);
  });

  it("Alice should Stake her balance", async function () {
    const aliceAmount = await rewardToken.balanceOf(alice.address);
    //Approve allowance
    await rewardToken.connect(alice).approve(staker.address, aliceAmount);
    //Stake tokens
    await staker.connect(alice).stake(aliceAmount);

    expect(await staker.totalSupply()).to.equal(aliceAmount);
    expect(await staker.balanceOf(alice.address)).to.equal(aliceAmount);
  });

  it("Alice should check rewards per token", async function () {
    //Mine blocks for a week
    await addEvmTime(604800);
    await mineBlocks(1);
    const rewardPerToken = await staker.rewardPerToken();
    const earned = await staker.earned(alice.address);
    const rewardForDuration = await staker.getRewardForDuration();
    const lastTimeRewardApplicable = await staker.lastTimeRewardApplicable();
    const aliceBalance = await staker.balanceOf(alice.address);
    console.log("Balance of Alice: ", String(aliceBalance));
    console.log("rewardPerToken: ", String(rewardPerToken));
    console.log("earned: ", String(earned));
    console.log("rewardForDuration: ", String(rewardForDuration));
    console.log("lastTimeRewardApplicable: ", String(lastTimeRewardApplicable));
  });

  it("Alice should exit and get balance + rewards", async function () {
    await staker.connect(alice).exit();
    const aliceBalance = await rewardToken.balanceOf(alice.address)
    expect(parseInt(aliceBalance)).to.be.greaterThan(0);
  });

  it("Alice should fail trying to Stake 0", async function () {
    await expect(
        staker.connect(alice).stake(0)
      ).to.be.revertedWith("Cannot stake 0");
  });

  it("Alice should fail trying to withdraw 0", async function () {
    await expect(
        staker.connect(alice).withdraw(0)
      ).to.be.revertedWith("Cannot withdraw 0");
  });
});

async function addEvmTime(time) {
  await ethers.provider.send("evm_increaseTime", [time]);
}
async function mineBlocks(blockNumber) {
  while (blockNumber > 0) {
    blockNumber--;
    await ethers.provider.send("evm_mine");
  }
}
