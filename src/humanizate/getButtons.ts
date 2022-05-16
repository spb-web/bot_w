import { BaseTargetEventWithTransaction } from '@/entries'
import { get } from 'lodash'
import type { Log } from '@ethersproject/abstract-provider'
import { bscscanLink } from '../utils/bscscanLink'

export const getButtons = (log: BaseTargetEventWithTransaction<{ rawLog: Log}> | { rawLog: Log}) => {
  const buttons = [
    { text: '⚡️ BscScan', url: bscscanLink.txBscscan(log.rawLog.transactionHash) }
  ]

  const from:false|string = get(log, ['transaction', 'response', 'from'], false)

  if (from) {
    buttons.push(
      { text: '👛 BscScan', url: bscscanLink.accountBscscan(log.rawLog.transactionHash) },
      { text: '👛 Debank', url: bscscanLink.accountDebank(log.rawLog.transactionHash) },
    )
  }

  return {
    inline_keyboard: [
      buttons,
    ],
  }
}