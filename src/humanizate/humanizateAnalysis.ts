import { createCanvas } from 'canvas'
import interpolate from 'color-interpolate'

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

const colors = ['#2862ff', '#5a9bf6', '#d1d4db', '#ef9a9a', '#f44336']
const getColor = interpolate(colors)

const drawImage = (value:number) => {
  const width = 800
  const radius = width / 2 - 150
  const height = radius + 200
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  ctx.lineWidth = 10; // толщина линии

  const gradient = ctx.createRadialGradient(
    width / 2,
    height,
    radius,
    width / 2,
    height,
    0
  )

  // Add three color stops
  gradient.addColorStop(-0.8, getColor(value))
  gradient.addColorStop(.6, 'transparent')

  // Set the fill style and draw a rectangle
  ctx.beginPath()
  ctx.arc(width / 2, height, radius, 0, Math.PI, true)
  ctx.fillStyle = gradient
  
  ctx.fill()


  ctx.font = '25px Impact'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#000'
  ctx.fillText('Активно\nпродавать', 80, 350)
  ctx.fillText('Продавать', 180, 200)
  ctx.fillText('Нейтрально', width / 2, 150)
  ctx.fillText('Покупать', 620, 200)
  ctx.fillText('Активно\nпокупать', 720, 350)
  ctx.font = '40px Impact'
  ctx.strokeStyle = getColor(value)
  // ctx.fillText('АКТИВНО ПРОДАВАТЬ', width / 2, 60)

  drawPart(ctx, colors[0], width, height, radius, 1)
  drawPart(ctx, colors[1], width, height, radius, 2)
  drawPart(ctx, colors[2], width, height, radius, 3)
  drawPart(ctx, colors[3], width, height, radius, 4)
  drawPart(ctx, colors[4], width, height, radius, 5)

  ctx.beginPath()
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#000'
  ctx.moveTo(width / 2, height - 7)
  ctx.lineTo(
    width / 2 + Math.cos(Math.PI * value) * (radius - 30),
    height - Math.sin(Math.PI * value) * (radius - 30),
  )
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(width / 2, height - 7, 40, 0, 2 * Math.PI)
  ctx.fillStyle = '#fff'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(width / 2, height - 7, 7, 0, 2 * Math.PI)
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
      if (analysis.currentPrice / movingAverage < 0.99) {
        re = 'Продавать'
        emoji = '🔴'

        sellRe++;
      } else {
        holdRe++;
      }
    } else if (movingAverage / analysis.currentPrice < 0.99) {
      re = 'Покупать'
      emoji = '🟢'

      buyRe++;
    } else {
      holdRe++;
    }
    text += `${emoji} Средняя (${ days }):\t ~$${toLocaleString(movingAverage)} (${re})\n`      
  })

  text+=`\nПродавать: ${sellRe}; Нейтрально: ${holdRe}; Покупать: ${buyRe} \n`

  const totalRe = sellRe + holdRe + buyRe
  const indx = ((((sellRe - buyRe + (holdRe / 2)) / totalRe / 2) + 0.5) * (Math.PI / 5 * 4) + Math.PI / 10) / Math.PI

  const img = drawImage(indx)

  return {
    chatId,
    text,
    source: img
  }
}