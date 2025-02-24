import { logger } from '@/lib/logger'
import { createWalletsXlsx, getWalletsData, type Wallet } from '@/modules/xlsx'

export const cmdOffZeroBalance = async () => {
  try {
    const wallets = await getWalletsData()
    const updatedWallets: Wallet[] = []

    for (const wallet of wallets) {
      if (wallet.balance === 0) {
        updatedWallets.push({ ...wallet, toggle: 'OFF' })
      } else {
        updatedWallets.push({ ...wallet, toggle: 'ON' })
      }
    }

    await createWalletsXlsx(updatedWallets)
  } catch (err) {
    logger.error('', err)
  }
}
