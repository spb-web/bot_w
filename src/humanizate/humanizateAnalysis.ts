import { toLocaleString } from '../utils/toLocaleString'

export type HumanizateAnalysisPayload = {
  currentPrice: number,
  movingAverages: {
    days: number,
    movingAverage: number,
  }[],
}

export const humanizateAnalysis = (analysis: HumanizateAnalysisPayload, chatId: string) => {
  // let text = `Цена NMX: ${0} (-3% за 24 часа) \n`
  let text = ``
  text += '*СКОЛЬЗЯЩИЕ СРЕДНИЕ*\n'

  analysis.movingAverages.forEach(({ days, movingAverage }) => {
    let re = 'Нейтрально'
    let emoji = '⚪️'

    if (movingAverage > analysis.currentPrice) {
      if (analysis.currentPrice / movingAverage > 0.05) {
        re = 'Продавать'
        emoji = '🔴'
      }
    } else if (movingAverage / analysis.currentPrice > 0.05) {
      re = 'Покупать'
      emoji = '🟢'
    }
    text += `${emoji} Скользящая средняя (${ days }):\t ${toLocaleString(movingAverage)} (${re})\n`      
  })

  return {
    chatId,
    text,
  }
}