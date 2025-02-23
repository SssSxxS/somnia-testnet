import { logger } from '@/lib/logger'
import { getAddressFromPrivateKey, getBalanceStt } from '@/modules/blockchain'
import { createWalletsXlsx, getWalletsData, type Wallet } from '@/modules/xlsx'
import { SOMNIA_TESTNET_EXPLORER_URL } from '@data/config'

export const cmdCreateOrUpdateWalletsTable = async () => {
  try {
    if (await Bun.file('./data/wallets.xlsx').exists()) {
      const wallets = await getWalletsData()
      const updatedWallets: Wallet[] = []

      for (const [index, wallet] of wallets.entries()) {
        try {
          const address = await getAddressFromPrivateKey(wallet.privateKey)
          const explorerUrl = `${SOMNIA_TESTNET_EXPLORER_URL}/address/${address}`
          const balance = await getBalanceStt(address)
          updatedWallets.push({
            id: index + 1,
            toggle: wallet.toggle,
            proxy: wallet.proxy,
            privateKey: wallet.privateKey,
            address: address,
            explorerUrl: explorerUrl,
            balance: parseFloat(balance),
          })
          logger.info(`(${index + 1}) ${address} pushed`)
        } catch (err) {
          updatedWallets.push({
            ...wallet,
            id: index + 1,
            toggle: 'OFF',
          })
          logger.error('', err)
          logger.warn(`(${index + 1}) Failed`)
        }
      }
      await createWalletsXlsx(updatedWallets)
      logger.success('Wallets table has been updated')
    } else {
      const defaultWallets: Wallet[] = [
        {
          id: 1,
          toggle: 'ON',
          proxy: 'host:port:username:password',
          privateKey: '0x123...',
          address: '0xAbc...',
          explorerUrl: '',
          balance: 0.123,
        },
        {
          id: 2,
          toggle: 'OFF',
          proxy: 'host:port:username:password',
          privateKey: '0x123...',
          address: '0xAbc...',
          explorerUrl: '',
          balance: 0.123,
        },
        {
          id: 3,
          toggle: 'OFF',
          proxy: '',
          privateKey: '0x123...',
          address: '0xAbc...',
          explorerUrl: '',
          balance: 0.123,
        },
      ]

      await createWalletsXlsx(defaultWallets)
      logger.success('Wallets table has been created')
    }
  } catch (err) {
    logger.error('', err)
  }
}
