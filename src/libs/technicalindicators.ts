import { firebaseApiKey } from '../config/constants/firebase'
import { DataSnapshot, limitToLast, query } from 'firebase/database'
import * as technicalindicators from 'technicalindicators'

const getLast = <T>(arr:T[]) => arr.length > 0 ? arr[arr.length - 1] : undefined

let technicalindicatorsData = {}
const candelsPerDay = 96

const calc = (values: number[]) => {
  technicalindicatorsData = {
    sma: {
      10: getLast(
        technicalindicators.sma({
          period: 10 * candelsPerDay,
          values,
        })
      ),
      20: getLast(
          technicalindicators.sma({
          period: 20 * candelsPerDay,
          values,
        })
      ),
      30: getLast(
        technicalindicators.sma({
          period: 30 * candelsPerDay,
          values,
        })
      ),
      50: getLast(
        technicalindicators.sma({
          period: 50 * candelsPerDay,
          values,
        })
      ),
      100: getLast(
        technicalindicators.sma({
          period: 100 * candelsPerDay,
          values,
        })
      ),
      200: getLast(
        technicalindicators.sma({
          period: 200 * candelsPerDay,
          values,
        })
      ),
    },
    ema: {
      10: getLast(
        technicalindicators.ema({
          period: 10 * candelsPerDay,
          values,
        })
      ),
      20: getLast(
          technicalindicators.ema({
          period: 20 * candelsPerDay,
          values,
        })
      ),
      30: getLast(
        technicalindicators.ema({
          period: 30 * candelsPerDay,
          values,
        })
      ),
      50: getLast(
        technicalindicators.ema({
          period: 50 * candelsPerDay,
          values,
        })
      ),
      100: getLast(
        technicalindicators.ema({
          period: 100 * candelsPerDay,
          values,
        })
      ),
      200: getLast(
        technicalindicators.ema({
          period: 200 * candelsPerDay,
          values,
        })
      ),
    },
    // ИНДЕКС ОТНОСИТЕЛЬНОЙ СИЛЫ (RSI)
    rsi: getLast(
      technicalindicators.rsi({
        period: 10,
        values,
      })
    ),
    // // ИНДЕКС ТОВАРНОГО КАНАЛА (CCI)
    // cci: technicalindicators.cci(),
    // ИНДИКАТОР СРЕДНЕГО НАПРАВЛЕННОГО ДВИЖЕНИЯ (ADX)
    // adx: getLast(
    //   technicalindicators.adx({
    //     period: 10,
    //     values,
    //   })
    // ),
  }
}

export const getTechnicalindicators = () => {
  return technicalindicatorsData
}

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
  const maxItems = candelsPerDay * 250
  const nmxH12Ref = query(ref(database, 'M12'), limitToLast(maxItems))
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

    const data:number[] = Array.from(mapDate.values()).sort(({ time: timeA }, { time: timeB }) => timeA - timeB).map(({ value }) => value);

    calc(data)

    console.log(getTechnicalindicators())
  }
}


connectToDatabase()