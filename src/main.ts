import { cmdCreateOrUpdateWalletsTable } from '@/commands/cmdCreateOrUpdateWalletsTable'
import { cmdDeployErc20 } from '@/commands/cmdDeployErc20'
import { cmdDeployErc721 } from '@/commands/cmdDeployErc721'
import { cmdExit } from '@/commands/cmdExit'
import { cmdGetSttFromFaucet } from '@/commands/cmdGetSttFromFaucet'
import { cmdSendSttToRandomAddress } from '@/commands/cmdSendSttToRandomAddress'
import { logger } from '@/lib/logger'
import { select, Separator } from '@inquirer/prompts'
import chalk from 'chalk'

type MenuCommand = {
  name: string
  action: () => Promise<void>
  disabled?: boolean
  addSeparator?: boolean
}

const menuCommands: MenuCommand[] = [
  {
    name: 'Create or Update Wallets Table',
    action: async () => await cmdCreateOrUpdateWalletsTable(),
    addSeparator: true,
  },
  {
    name: 'Get $STT from Faucet',
    action: async () => await cmdGetSttFromFaucet(),
  },
  {
    name: 'Send $STT to Random wallets',
    action: async () => await cmdSendSttToRandomAddress(),
  },
  {
    name: 'Deploy ERC-20 smart-contract',
    action: async () => await cmdDeployErc20(),
  },
  {
    name: 'Deploy ERC-721 smart-contract',
    action: async () => await cmdDeployErc721(),
    addSeparator: true,
  },
  {
    name: 'Exit',
    action: async () => await cmdExit(),
  },
]

const choices = menuCommands.flatMap((item, index) => [
  {
    name: item.name,
    short: chalk.bold(item.name),
    value: index,
    disabled: item.disabled,
  },
  ...(item.addSeparator ? [new Separator(' ')] : []),
])

export const main = async () => {
  while (true) {
    try {
      const choice = await select({
        message: 'MENU:',
        choices: choices,
        pageSize: 99,
        loop: false,
      })
      await menuCommands[choice].action()
    } catch (err) {
      logger.error('%o', err)
    }
  }
}
