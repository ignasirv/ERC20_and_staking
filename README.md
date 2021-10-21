# ERC20 Stacking contract
# Challenge
Create and deploy (locally) an ERC20 token and a staking contract that will distribute rewards to stakers over time. No need for an app or UI. You can reuse published or open source code, but you must indicate the source and what you have modified.

## User journey
An account with some balance of the tokens can deposit them into the staking contract (which also has the tokens and distributes them over time). As the time goes by and blocks are being produced, this user should accumulate more of the tokens and can claim the rewards and withdraw the deposit.

## RewardToken.sol
This contract defines an ERC20 token that will be used for staking/rewards. The owner should be able to mint the token, change reward rates and enable/disable withdraw fees (also modifiable)

## Staker.sol
This contract will get deployed with some tokens minted for the distribution to the stakers. And then, according to a schedule, allocate the reward tokens to addresses that deposited those tokens into the contract. The schedule is up to you, but you could say that every block 100 tokens are being distributed; then you'd take the allocated tokens and divide by the total balance of the deposited tokens so each depositor get's proportional share of the rewards. Ultimately, a user will deposit some tokens and later will be able to withdraw the principal amount plus the earned rewards. The following functions must be implemented: deposit(), withdraw()

## Scoring criteria
- launch ERC20 token
- implement reward allocation logic
- safe deposit/withdraw functions (avoid common attack vectors)
- add test cases

## Tools
Recommended tools:
- Hardhat
- Truffle/Ganache
- Remix
- web3.js/ethers.js

# Task explanation
I have created a standard ERC20 token contract ready to deploy. At the constructor, the owner and the total supply are defined by input parameter.<br>
The second contract, holds all the complexity of the staking. At the constructor, you can define the address of the ERC20 for the reward and for the staking, in our case, both are the same.<br>
The Staker contract is inspired from Synthetixio -> https://github.com/Synthetixio/synthetix/blob/develop/contracts/StakingRewards.sol
<br>The changes are the following:
 - Moved the rewardsDistributionRecipient logic to the main contract
 - Applied Pausable and Ownable from OpenZeppelin
 - Added the fees logic at the withdraw rewards function
<br>
## Modifications from the requirements (improvements)
Some changes have been implemented for a better user experience of the staking:
 - The user can withdraw the staked tokens and the rewards separately with withdraw() and getReward() functions or at the same call with exit() function
 - The user can add more stake without having to withdraw it
 - The owner can add more rewards after deployment and change the rewards duration and the rewards distribution account
 - Added to support recovering LP Rewards from other systems such as BAL to be distributed to holders


# Setup
```shell
npm i
```
Compile contracts
```shell
npx hardhat compile
```
Run tests
```shell
npx hardhat test
```
Other commands
```shell
npx hardhat accounts
npx hardhat clean
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

