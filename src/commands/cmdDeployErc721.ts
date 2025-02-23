import { logger } from '@/lib/logger'
import { getRandomInt, shuffleArray } from '@/lib/utils'
import { deployErc721 } from '@/modules/blockchain'
import { getWalletsData } from '@/modules/xlsx'
import { DEPLOY_SLEEP_RANGE, SHUFFLE_WALLETS, SOMNIA_TESTNET_EXPLORER_URL } from '@data/config'

export const cmdDeployErc721 = async () => {
  try {
    let wallets = await getWalletsData()
    wallets = wallets.filter((wallet) => wallet.toggle.toUpperCase() === 'ON')
    if (SHUFFLE_WALLETS) wallets = shuffleArray(wallets)
    logger.info(`[GOT ${wallets.length} WALLETS]`)

    for (const wallet of wallets) {
      try {
        const tx = await deployErc721(wallet.privateKey)
        logger.success(`(${wallet.id}) Deployed ERC-721 smart-contract ${SOMNIA_TESTNET_EXPLORER_URL}/tx/${tx?.hash}`)

        if (wallet == wallets[wallets.length - 1]) break
        const delay = getRandomInt(DEPLOY_SLEEP_RANGE[0], DEPLOY_SLEEP_RANGE[1])
        logger.info(`Sleeping for ${delay} seconds`)
        await Bun.sleep(delay * 1000)
      } catch (err) {
        logger.error('', err)
      }
    }
  } catch (err) {
    logger.error('', err)
  }
}
