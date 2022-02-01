import type { Log } from '@ethersproject/abstract-provider'
import { bscscanLink } from '../utils/bscscanLink'

export const getButtons = (log: { rawLog: Log}) => {
  return {
    inline_keyboard: [
      [
        { text: 'Transaction', url: bscscanLink.tx(log.rawLog.transactionHash) },
      ],
    ],
  }
}