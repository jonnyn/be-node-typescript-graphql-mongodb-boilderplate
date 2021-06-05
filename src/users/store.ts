import mongoose from 'mongoose'
import _ from 'lodash'
import { Context } from '../utils/types'
import { toSort } from '../utils/helper'
import User from './model'

const querySelector = (filter: any, id: string | number) => {
  let query = () => {
    const q = id ? User.find({ id }) : User.find()
    return q
  }
  if (filter) {
    if (filter.type === 'search') {
      const regFilter = RegExp(filter.data, 'i')
      query = () => {
        const q = User.find(
          {
            $or:
            [
              { firstName: { $regex: regFilter, $options: 'i' } },
              { lastName: { $regex: regFilter, $options: 'i' } },
              { email: { $regex: regFilter, $options: 'i' } },
              { position: { $regex: regFilter, $options: 'i' } },
            ],
          },
        )
        return q
      }
    } else if (filter.type === 'sales_search') {
      const regFilter = RegExp(filter.data, 'i')
      query = () => {
        const q = User.find(
          {
            $and:
            [
              {
                $or: [
                  { firstName: { $regex: regFilter, $options: 'i' } },
                  { lastName: { $regex: regFilter, $options: 'i' } },
                  { email: { $regex: regFilter, $options: 'i' } },
                ],
              },
              { position: 'SALES' },
            ],
          },
        )
        return q
      }
    } else {
      query = () => {
        const q = User.find(
          { [filter.type]: filter.data },
        )
        return q
      }
    }
  }
  return query
}

// Queries
const getUsers = async (params: any) => {
  const {
    id,
    skip = 0,
    limit,
    sortBy = 'FIRST_NAME_DESC',
    filter,
  } = params
  const sort = toSort(sortBy)

  // if filters exist, then its a search, else return all users list
  const query = querySelector(filter, id)

  const count = await query().countDocuments()
  const sortedQuery = query().sort(sort)
  const paginatedQuery = limit ? sortedQuery.skip(skip).limit(limit) : sortedQuery
  const users = await paginatedQuery.exec()

  return { users, count }
}

const getUser = (id: string | number) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null

  return User.findById(id)
}

const me = async (input: any) => {
  const { id } = input.user
  const now = new Date()
  //return User.findOneAndUpdate({ auth0Id: id }, { lastLogin: now })
  return User.findOne({ auth0Id: id })
}

// Mutations
const createUser = async (input: any, context: Context) => {
  const newUser = User.create(input)
  return newUser
}

const updateUser = async (input: any, context: Context) => {
  const { id } = input
  const props = _.omitBy(input, _.isNil)
  const updatedUserData = await User.findByIdAndUpdate(id, props)
  return updatedUserData
}

export default {
  getUsers, createUser, getUser, updateUser, me,
}
