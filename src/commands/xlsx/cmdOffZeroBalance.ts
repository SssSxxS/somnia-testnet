import { logger } from '@/lib/logger'
import { createWalletsXlsx, getWalletsData, type Wallet } from '@/modules/xlsx'

export const cmdOffZeroBalance = async () => {
  try {
    const wallets = await getWalletsData()
    const updatedWallets: Wallet[] = []

    let onCount = 0
    let offCount = 0
    for (const wallet of wallets) {
      if (wallet.balance === 0) {
        updatedWallets.push({ ...wallet, toggle: 'OFF' })
        offCount++
      } else {
        updatedWallets.push({ ...wallet, toggle: 'ON' })
        onCount++
      }
    }
    logger.info(`"ON" ${onCount} wallets, "OFF" ${offCount} wallets`)
    await createWalletsXlsx(updatedWallets)
  } catch (err) {
    logger.error('', err)
  }
}
