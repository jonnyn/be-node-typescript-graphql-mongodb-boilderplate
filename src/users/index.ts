import { Context } from '../utils/types'
import Users from './store'

export default {
  Query: {
    users: (root: any, { filter }: any) => Users.getUsers({ filter }),
    user: (root: any, { id }: any) => Users.getUser(id),
    me: async (root: any, args: any, context: Context) => {
      const me = await Users.me(context)
      return { user: me }
    },
  },

  Mutation: {
    createUser: async (root: any, { input }: any, context: Context) => {
      const user = await Users.createUser(input, context)
      return { user }
    },

    updateUser: async (root: any, { input }: any, context: Context) => {
      const user = await Users.updateUser(input, context)
      return { user }
    },
  },
}
