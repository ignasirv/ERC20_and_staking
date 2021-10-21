//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title Reqrd Token (RTK)
 * @author Ignasi Ramos
 * @notice Implements a basic ERC20 staking token with incentive distribution.
 */

contract RewardToken is ERC20, Ownable {
    using SafeMath for uint256;

    /**
     * @notice The constructor for the Staking Token.
     * @param _owner The address to receive all tokens on construction.
     * @param _supply The amount of tokens to mint on construction.
     */
    constructor(address _owner, uint256 _supply) ERC20("Reward", "RTK") public {
        _mint(_owner, _supply);
    }

    
}
