const ethers = require("ethers");
const config = require("../config/config");
const provider = new ethers.providers.JsonRpcProvider(config.host, ethers.networks.mainnet);

const WeiDex = require("../../build/contracts/WeiDex");
const ERC20Mock = require("../../build/contracts/ERC20Mock");
const OldERC20Mock = require("../../build/contracts/OldERC20Mock");
const NewWeiDex = require("../../build/contracts/WeiDexMock");


module.exports = { deployWeiDexExchangeContract, deployNewWeidexExchangeContract, deployToken, deployOldToken };

async function deployWeiDexExchangeContract(wallet, feeWallet) {
    const params = [feeWallet.address, config.feeRate, config.referralFeeRate, config.defaultAddress, config.tokenRatio];
    return await _deployExchange(WeiDex, wallet, params);
}

async function deployNewWeidexExchangeContract(wallet) {
    const params = [];
    return await _deployExchange(NewWeiDex, wallet, params);
}

async function deployOldToken(wallet, decimals) {
    return await _deployERC20(OldERC20Mock, wallet, "TestToken", "TT", decimals);
}

async function deployToken(wallet, decimals) {
    return await _deployERC20(ERC20Mock, wallet, "TestToken", "TT", decimals);
}

async function _deployExchange(mock, wallet, params) {
    return await _getContract(mock, wallet, params);
}

async function _deployERC20(mock, wallet, name, symbol, decimal) {
    const params = [name, symbol, decimal];
    return await _getContract(mock, wallet, params);
}

async function _getContract(mock, wallet, params) {
    const contract = {
        bytecode: mock.bytecode,
        abi: mock.abi
    };
    const contractAddress = await _deploy(wallet, contract, undefined, params);
    return [contractAddress, contract.abi];
}

async function _deploy(wallet, contract, gasLimit = config.defaultGasLimit, params) {
    const weidexDeployTransaction = ethers.Contract.getDeployTransaction(contract.bytecode, contract.abi, ...params);
    weidexDeployTransaction.gasLimit = gasLimit;
    const weidexDeployTransactionHash = (await wallet.sendTransaction(weidexDeployTransaction)).hash;
    return (await provider.getTransactionReceipt(weidexDeployTransactionHash)).contractAddress;
}
