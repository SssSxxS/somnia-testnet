import { logger } from '@/lib/logger'
import { createWalletsXlsx, getWalletsData, type Wallet } from '@/modules/xlsx'

export const cmdOffAll = async () => {
  try {
    const wallets = await getWalletsData()
    const updatedWallets: Wallet[] = []

    for (const wallet of wallets) {
      updatedWallets.push({ ...wallet, toggle: 'OFF' })
    }
    logger.info(`"ON" 0 wallets, "OFF" ${updatedWallets.length} wallets`)
    await createWalletsXlsx(updatedWallets)
  } catch (err) {
    logger.error('', err)
  }
}
