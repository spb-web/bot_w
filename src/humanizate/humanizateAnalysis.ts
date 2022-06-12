import { createCanvas } from 'canvas'
import { toLocaleString } from '../utils/toLocaleString'

export type HumanizateAnalysisPayload = {
  currentPrice: number,
  movingAverages: {
    days: number,
    movingAverage: number,
  }[],
}

const drawPart = (ctx:CanvasRenderingContext2D, color:string, width:number, height:number, radius:number, index:number) => {
  const max = 5
  
  const start = Math.PI * ((max - index) / max + 1)
  const end = Math.PI * ((max - index + 1) / max + 1)
    
  ctx.beginPath()
  ctx.lineCap = 'square'
  ctx.lineWidth = 10
  ctx.strokeStyle = color
  ctx.arc(width / 2, height, radius + 10, start, end, false)
  ctx.stroke()
}

const drawImage = (value:number) => {
  const size = 600
  const radius = size / 2 - 50
  const height = radius + 50
  const canvas = createCanvas(size, height)
  const ctx = canvas.getContext('2d')

  ctx.lineWidth = 10; // толщина линии

  const gradient = ctx.createRadialGradient(
    size / 2,
    height,
    radius,
    size / 2,
    height,
    0
  )

  // Add three color stops
  gradient.addColorStop(0, 'rgba(247,82,95,0.5)')
  gradient.addColorStop(.6, 'transparent')

  // Set the fill style and draw a rectangle
  ctx.beginPath()
  ctx.arc(size / 2, height, radius, 0, Math.PI, true)
  ctx.fillStyle = gradient
  
  ctx.fill()


  drawPart(ctx, 'rgb(40,98,255)', size, height, radius, 1)
  drawPart(ctx, 'rgba(40, 98, 255, 0.5)', size, height, radius, 2)
  drawPart(ctx, '#aaaaaa', size, height, radius, 3)
  drawPart(ctx, 'rgba(247,82,95,0.5)', size, height, radius, 4)
  drawPart(ctx, 'rgb(247,82,95)', size, height, radius, 5)

  ctx.beginPath()
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#000'
  ctx.moveTo(size / 2, height)
  ctx.lineTo(
    size / 2 + Math.cos(Math.PI * value) * (radius - 20),
    height - Math.sin(Math.PI * value) * (radius - 20),
  )
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(size / 2, height, 40, 0, 2 * Math.PI)
  ctx.fillStyle = '#fff'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(size / 2, height, 10, 0, 2 * Math.PI)
  ctx.strokeStyle = '#000'
  ctx.stroke()

  return canvas.toBuffer()
}

export const humanizateAnalysis = (analysis: HumanizateAnalysisPayload, chatId: string) => {
  let text = `Цена NMX: ~$${toLocaleString(analysis.currentPrice, true)} \n\n`
  text += '*СКОЛЬЗЯЩИЕ СРЕДНИЕ*\n'
  let sellRe = 0
  let buyRe = 0
  let holdRe = 0

  analysis.movingAverages.forEach(({ days, movingAverage }) => {
    let re = 'Нейтрально'
    let emoji = '⚪️'

    if (movingAverage > analysis.currentPrice) {
      if (analysis.currentPrice / movingAverage > 0.05) {
        re = 'Продавать'
        emoji = '🔴'

        sellRe++;
      } else {
        holdRe++;
      }
    } else if (movingAverage / analysis.currentPrice > 0.05) {
      re = 'Покупать'
      emoji = '🟢'

      buyRe++;
    } else {
      holdRe++;
    }
    text += `${emoji} Скользящая средняя (${ days }):\t ~$${toLocaleString(movingAverage)} (${re})\n`      
  })

  text+=`\nПродавать: ${sellRe}; Нейтрально: ${holdRe}; Покупать: ${buyRe} \n`

  const totalRe = sellRe + holdRe + buyRe
  const indx = ((((sellRe - buyRe + holdRe / 2) / totalRe / 2) + 0.5) * (Math.PI / 5 * 4) + Math.PI / 10) / Math.PI

  const img = drawImage(indx)

  return {
    chatId,
    text,
    source: img
  }
}