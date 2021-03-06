// Inspired by https://github.com/AdExNetwork/adex-protocol-eth/blob/master/contracts/libs/SafeERC20.sol
pragma solidity 0.4.24;

import "../token/IOldERC20.sol";

library SafeOldERC20 {
	// definitely not a pure fn but the compiler complains otherwise
    function checkSuccess()
        private
        pure
		returns (bool)
	{
        uint256 returnValue = 0;

        assembly {
			// check number of bytes returned from last function call
			switch returndatasize

			// no bytes returned: assume success
			case 0x0 {
				returnValue := 1
			}

			// 32 bytes returned: check if non-zero
			case 0x20 {
				// copy 32 bytes into scratch space
				returndatacopy(0x0, 0x0, 0x20)

				// load those bytes into returnValue
				returnValue := mload(0x0)
			}

			// not sure what was returned: don't mark as success
			default { }
        }

        return returnValue != 0;
    }

    function transfer(address token, address to, uint256 amount) internal {
        IOldERC20(token).transfer(to, amount);
        require(checkSuccess(), "Transfer failed");
    }

    function transferFrom(address token, address from, address to, uint256 amount) internal {
        IOldERC20(token).transferFrom(from, to, amount);
        require(checkSuccess(), "Transfer From failed");
    }
}
