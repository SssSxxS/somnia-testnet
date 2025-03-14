import { logger } from '@/lib/logger'
import { getRandomInt, shuffleArray } from '@/lib/utils'
import { approveToken, swapToken } from '@/modules/blockchain'
import { getWalletsData } from '@/modules/xlsx'
import {
  SHUFFLE_WALLETS,
  SOMNIA_TESTNET_EXPLORER_URL,
  SWAP_PONGPING_AMOUNT,
  SWAP_PONGPING_SLEEP_RANGE,
} from '@data/config'

export const cmdSwapPong = async () => {
  try {
    let wallets = await getWalletsData()
    wallets = wallets.filter((wallet) => wallet.toggle.toUpperCase() === 'ON')
    if (SHUFFLE_WALLETS) wallets = shuffleArray(wallets)
    logger.info(`[GOT ${wallets.length} WALLETS]`)

    for (const wallet of wallets) {
      try {
        const amount = getRandomInt(SWAP_PONGPING_AMOUNT[0], SWAP_PONGPING_AMOUNT[1])
        const approve = await approveToken(
          wallet.privateKey,
          '0x7968ac15a72629e05f41b8271e4e7292e0cc9f90',
          '0x6aac14f090a35eea150705f72d90e4cdc4a49b2c',
          String(amount)
        )
        logger.success(`(${wallet.id}) Approve ${amount} $PONG ${SOMNIA_TESTNET_EXPLORER_URL}/tx/${approve.hash}`)

        const swap = await swapToken(
          wallet.privateKey,
          '0x7968ac15a72629e05f41b8271e4e7292e0cc9f90',
          '0xbecd9b5f373877881d91cbdbaf013d97eb532154',
          amount,
          wallet.address.replace(/^0x/, '').toLowerCase(),
          String((amount * 0.97).toFixed(3))
        )
        logger.success(`(${wallet.id}) Swap ${amount} $PONG ${SOMNIA_TESTNET_EXPLORER_URL}/tx/${swap?.hash}`)

        if (wallet == wallets[wallets.length - 1]) break
        const delay = getRandomInt(SWAP_PONGPING_SLEEP_RANGE[0], SWAP_PONGPING_SLEEP_RANGE[1])
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
