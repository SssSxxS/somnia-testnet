import { abiERC20Token, abiERC721Token } from '@/contracts/abis'
import { bytecodeERC20Token, bytecodeERC721Token, bytecodeMintPongPing } from '@/contracts/bytecodes'
import { getRandomName } from '@/contracts/names'
import { getRandomSymbol } from '@/contracts/symbols'
import { getRandomInt } from '@/lib/utils'
import { SOMNIA_TESTNET_RPC_URL } from '@data/config'
import { ethers } from 'ethers'

export const getAddressFromPrivateKey = async (privateKey: string) => {
  const wallet = new ethers.Wallet(privateKey)
  return wallet.address
}

export const getBalanceStt = async (address: string) => {
  const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL)
  const balanceWei = await provider.getBalance(address)
  const balanceEther = ethers.formatEther(balanceWei)
  return balanceEther
}

export const sendSttToRandomAddress = async (privateKey: string, amount: number) => {
  const wallet = new ethers.Wallet(privateKey)
  const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL)
  const signer = wallet.connect(provider)

  const tx = await signer.sendTransaction({
    to: ethers.Wallet.createRandom().address,
    value: ethers.parseEther(String(amount)),
  })

  await tx.wait()
  return tx.hash
}

export const deployErc20 = async (privateKey: string) => {
  const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL)
  const signer = new ethers.Wallet(privateKey, provider)
  const contractFactory = new ethers.ContractFactory(abiERC20Token, bytecodeERC20Token, signer)

  const name = getRandomName()
  const symbol = getRandomSymbol()
  const initialSupply = ethers.parseUnits(String(getRandomInt(1000000, 1000000000)), 18)

  const contract = await contractFactory.deploy(name, symbol, initialSupply)
  const deployedContract = await contract.waitForDeployment()
  return deployedContract.deploymentTransaction()
}
export const deployErc721 = async (privateKey: string) => {
  const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL)
  const signer = new ethers.Wallet(privateKey, provider)
  const contractFactory = new ethers.ContractFactory(abiERC721Token, bytecodeERC721Token, signer)

  const name = getRandomName()
  const symbol = getRandomSymbol()

  const contract = await contractFactory.deploy(name, symbol)
  const deployedContract = await contract.waitForDeployment()
  return deployedContract.deploymentTransaction()
}

export const mintPongPing = async (privateKey: string, contractAddress: string) => {
  const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL)
  const signer = new ethers.Wallet(privateKey, provider)

  const tx = {
    to: contractAddress,
    data: bytecodeMintPongPing(signer.address),
  }

  return signer.sendTransaction(tx)
}

export const approveToken = async (
  privateKey: string,
  tokenAddress: string,
  spenderAddress: string,
  amount: string
) => {
  const tokenAbi = [
    'function approve(address spender, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
  ]

  const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL)
  const wallet = new ethers.Wallet(privateKey, provider)
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet)
  const decimals = await tokenContract.decimals()
  const amountWithDecimals = ethers.parseUnits(amount, decimals)

  const tx = await tokenContract.approve(spenderAddress, amountWithDecimals)
  const receipt = await tx.wait()

  return receipt
}

export const swapToken = async (
  privateKey: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: number,
  recipient: string,
  amountOutMinimum: string,
  sqrtPriceLimitX96: number = 0,
  deadline: number = 0
) => {
  const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL)
  const signer = new ethers.Wallet(privateKey, provider)

  const fee = 500
  const swapRouterAddress = '0x6aac14f090a35eea150705f72d90e4cdc4a49b2c'

  const functionSelector = '0x04e45aaf'
  const amountInBigInt = ethers.parseUnits(String(amountIn), 18)
  const amountOutMinimumBigInt = ethers.parseUnits(amountOutMinimum, 18)

  const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'address', 'uint24', 'address', 'uint256', 'uint256', 'uint160', 'uint256'],
    [tokenIn, tokenOut, fee, recipient, amountInBigInt, amountOutMinimumBigInt, sqrtPriceLimitX96, deadline]
  )

  const data = functionSelector + encodedParams.substring(2)

  const tx = await signer.sendTransaction({
    to: swapRouterAddress,
    data: data,
  })
  const receipt = await tx.wait()
  return receipt
}
