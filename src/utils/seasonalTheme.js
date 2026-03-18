const DEFAULT_THEME = {
  primaryBlue: '#000080',
  primaryDarkBlue: '#000066',
  primaryMidColor: '#1a1a6e',
  primaryShadowRgb: '0, 0, 128',
  seasonIconFile: 'default.svg'
}

export const SEASONAL_SCHEDULE = [
  {
    start: '03-18',
    end: '03-19',
    theme: {
      primaryBlue: '#000080',
      primaryDarkBlue: '#000066',
      primaryMidColor: '#1a1a6e',
      primaryShadowRgb: '0, 0, 128',
      seasonIconFile: 'cross.svg'
    }
  },
  {
    start: '03-21',
    end: '03-21',
    theme: {
      primaryBlue: '#000080',
      primaryDarkBlue: '#000066',
      primaryMidColor: '#1a1a6e',
      primaryShadowRgb: '0, 0, 128',
      seasonIconFile: 'frbishoy.svg'
    }
  },
  {
    start: '03-22',
    end: '03-22',
    theme: {
      primaryBlue: '#000080',
      primaryDarkBlue: '#000066',
      primaryMidColor: '#1a1a6e',
      primaryShadowRgb: '0, 0, 128',
      seasonIconFile: 'me5ala3.svg'
    }
  },
  {
    start: '03-29',
    end: '03-29',
    theme: {
      primaryBlue: '#000080',
      primaryDarkBlue: '#000066',
      primaryMidColor: '#1a1a6e',
      primaryShadowRgb: '0, 0, 128',
      seasonIconFile: 'a3ma.svg'
    }
  },
  {
    start: '04-05',
    end: '04-05',
    theme: {
      primaryBlue: '#15803d',
      primaryDarkBlue: '#166534',
      primaryMidColor: '#166534',
      primaryShadowRgb: '21, 128, 61',
      seasonIconFile: 'sunday.svg'
    }
  },
  {
    start: '04-06',
    end: '04-08',
    theme: {
      primaryBlue: '#000000',
      primaryDarkBlue: '#111111',
      primaryMidColor: '#0a0a0a',
      primaryShadowRgb: '0, 0, 0',
      seasonIconFile: 'holyweek.svg'
    }
  },
  {
    start: '04-09',
    end: '04-09',
    theme: {
      primaryBlue: '#000000',
      primaryDarkBlue: '#111111',
      primaryMidColor: '#0a0a0a',
      primaryShadowRgb: '0, 0, 0',
      seasonIconFile: 'thursday.svg'
    }
  },
  {
    start: '04-10',
    end: '04-10',
    theme: {
      primaryBlue: '#000000',
      primaryDarkBlue: '#111111',
      primaryMidColor: '#0a0a0a',
      primaryShadowRgb: '0, 0, 0',
      seasonIconFile: 'friday.svg'
    }
  },
  {
    start: '04-11',
    end: '05-31',
    theme: {
      primaryBlue: '#7f1d1d',
      primaryDarkBlue: '#5f1212',
      primaryMidColor: '#6e1919',
      primaryShadowRgb: '127, 29, 29',
      seasonIconFile: 'risen.svg'
    }
  }
]

const monthDayToValue = (monthDay) => {
  const [month, day] = monthDay.split('-').map(Number)
  return month * 100 + day
}

const isInRange = (currentValue, startValue, endValue) => {
  if (startValue <= endValue) {
    return currentValue >= startValue && currentValue <= endValue
  }

  return currentValue >= startValue || currentValue <= endValue
}

export const getSeasonalTheme = (date = new Date()) => {
  const currentValue = (date.getMonth() + 1) * 100 + date.getDate()

  const matchedSeason = SEASONAL_SCHEDULE.find(({ start, end }) => {
    return isInRange(currentValue, monthDayToValue(start), monthDayToValue(end))
  })

  return matchedSeason ? matchedSeason.theme : DEFAULT_THEME
}
