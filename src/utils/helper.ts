import _ from 'lodash'
import moment from 'moment'

export const toSort = (sortBy: string) => {
  const str = sortBy.toLowerCase()
  const index = sortBy.lastIndexOf('_')
  const property = _.camelCase(str.slice(0, index))
  const order = str.slice(index + 1, sortBy.length) === 'asc' ? 1 : -1

  return { [property]: order }
}

export const parseFilter = (value: string) => {
  if (!value) return null
  //const filter = value.trim()
  const filter = value

  return filter
}

export const sortArray = (array: [any], sortBy: string, orderBy = 'ASC') => {
  const sortedArray = _.sortBy(array, sortBy)

  if (orderBy === 'DESC') {
    sortedArray.reverse()
  }

  return sortedArray
}

export const generateHumanReadableId = (name: string) => {
  const unixString = moment().unix()
  const nameString = name.replace(/\s/g, '_').toUpperCase()
  const string = nameString.concat(`_${unixString}`)

  return string
}

export default {}
