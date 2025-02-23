import { abiERC20Token, abiERC721Token } from '@/contracts/abis'
import { bytecodeERC20Token, bytecodeERC721Token } from '@/contracts/bytecodes'
import { getRandomName } from '@/contracts/names'
import { getRandomSymbol } from '@/contracts/symbols'
import { getRandomInt } from '@/lib/utils'
import { SOMNIA_TESTNET_RPC_URL } from '@data/config'
import { ethers } from 'ethers'

// export const getGasPrice = async () => {
//   const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL)
//   const feeData = await provider.getFeeData()
//   const gasPrice = ethers.formatUnits(feeData.gasPrice ? feeData.gasPrice : 0, 'gwei')
//   return gasPrice
// }

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
