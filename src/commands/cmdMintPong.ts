import { logger } from '@/lib/logger'
import { getRandomInt, shuffleArray } from '@/lib/utils'
import { mintPongPing } from '@/modules/blockchain'
import { getWalletsData } from '@/modules/xlsx'
import { MINT_PONGPING_SLEEP_RANGE, SHUFFLE_WALLETS, SOMNIA_TESTNET_EXPLORER_URL } from '@data/config'

export const cmdMintPong = async () => {
  try {
    let wallets = await getWalletsData()
    wallets = wallets.filter((wallet) => wallet.toggle.toUpperCase() === 'ON')
    if (SHUFFLE_WALLETS) wallets = shuffleArray(wallets)
    logger.info(`[GOT ${wallets.length} WALLETS]`)

    for (const wallet of wallets) {
      try {
        const tx = await mintPongPing(wallet.privateKey, '0x7968ac15a72629e05f41b8271e4e7292e0cc9f90')
        logger.success(`(${wallet.id}) Minted 1000 $PONG ${SOMNIA_TESTNET_EXPLORER_URL}/tx/${tx?.hash}`)

        if (wallet == wallets[wallets.length - 1]) break
        const delay = getRandomInt(MINT_PONGPING_SLEEP_RANGE[0], MINT_PONGPING_SLEEP_RANGE[1])
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
