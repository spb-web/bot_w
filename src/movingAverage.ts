import { DataSnapshot, limitToLast, query } from 'firebase/database'
import { firebaseApiKey } from './config/constants/firebase'
import { MovingAverage } from './libs/MovingAverage'

const movingAverage = new MovingAverage(100)

export const getMovingAverage = () => movingAverage.movingAverage()

const timespan = 60*15*60 // 15 min
const secPerDay = 24 * 60 * 60
export const movingAveragesDays = [10, 20, 30, 50, 100, 200]

export const movingAverages:Readonly<Record<number, MovingAverage>> = movingAveragesDays.reduce((averages, days) => {
  averages[days] = new MovingAverage(days * secPerDay)

  return averages
}, {} as Record<number, MovingAverage>)

const connectToDatabase = async () => {
  const { initializeApp } = await import('firebase/app');
  const { getDatabase, ref, onValue } = await import('firebase/database');

  const firebaseApp = initializeApp({
    apiKey: firebaseApiKey,
    authDomain: 'test-nmx.firebaseapp.com',
    projectId: 'test-nmx',
    storageBucket: 'test-nmx.appspot.com',
    messagingSenderId: '231256088013',
    appId: '1:231256088013:web:2c916888062aa1b1cc7884',
    databaseURL: 'https://test-nmx-default-rtdb.firebaseio.com/',
  });

  const database = getDatabase(firebaseApp)
  const maxItems = 24 * 60 * 60 / (15 * 60) * 200
  const nmxH12Ref = query(ref(database, 'M15'), limitToLast(maxItems))
  const valueListener = onValue(nmxH12Ref, handleValue)
}

const handleValue = (snapshot: DataSnapshot) => {
  if (snapshot.exists()) {
    const periods = snapshot.val()

    const mapDate = new Map()

    Object.values(periods).forEach((period:any) => {
      mapDate.set(period.endTime, {
        time: period.endTime / 1000,
        value: Number(period.endValue),
      });
    });

    const data = Array.from(mapDate.values()).sort(({ time: timeA }, { time: timeB }) => timeA - timeB) as {time: number, value: number}[];

    for (let index = 0; index < movingAveragesDays.length; index++) {
      movingAverages[movingAveragesDays[index]].reset(timespan, data)
      const addTime = data[data.length - 1].time
  
      const maxDuration = secPerDay * movingAveragesDays[index]
  
      if (addTime - movingAverages[movingAveragesDays[index]].startTime() > maxDuration) {
        const items = movingAverages[movingAveragesDays[index]].getItems().filter(({ time }) => addTime - time <= maxDuration)
  
        movingAverages[movingAveragesDays[index]].reset(maxDuration * secPerDay, items)
      }
    }
  }
}

connectToDatabase()