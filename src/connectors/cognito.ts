/* eslint-disable @typescript-eslint/no-explicit-any */
import AWS from 'aws-sdk'
import CONFIG from 'utils/config'

const tempPassword = 'Tt123456!!'
const cognito = new AWS.CognitoIdentityServiceProvider({
  accessKeyId: CONFIG.AWS.ACCESS_KEY,
  secretAccessKey: CONFIG.AWS.SECRET_ACCESS_KEY,
  region: CONFIG.AWS.REGION,
})

// ------------------------------------
// Helpers
// ------------------------------------

const createCognitoUsername = (name: string) => {
  const fullName = name.replace(/\s+/g, ' ').replace(/^\s|\s$/g, '')
  const names = fullName.split(' ')
  const first_name = names[0].toLowerCase() || ''
  const time = `_${new Date().getTime()}`
  return first_name + time
}

const generatePassword = () => {
  let pass = ''
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  for (let i = 0; i < 5; i += 1) {
    const rand = Math.floor(Math.random() * upperChars.length)
    pass += upperChars.substring(rand, rand + 1)
  }
  for (let i = 0; i < 5; i += 1) {
    const rand = Math.floor(Math.random() * lowerChars.length)
    pass += lowerChars.substring(rand, rand + 1)
  }
  for (let i = 0; i < 5; i += 1) {
    const rand = Math.floor(Math.random() * numbers.length)
    pass += numbers.substring(rand, rand + 1)
  }
  return pass
}

// ------------------------------------
// Cognito
// ------------------------------------

/**
 * create user in cognito
 * default user account status "FORCE_CHANGE_PASSWORD"
 * @param {string} name
 * @param {sting} email
 */
const createUser = (name: string, email: string) =>
  new Promise((resolve, reject) => {
    cognito.adminCreateUser(
      {
        UserAttributes: [
          { Name: 'name', Value: name },
          { Name: 'email', Value: email },
          { Name: 'preferred_username', Value: name },
          { Name: 'email_verified', Value: 'true' },
        ],
        Username: name,
        UserPoolId: CONFIG.AWS.COGNITO.USER_POOL_ID,
        TemporaryPassword: tempPassword,
        MessageAction: 'SUPPRESS',
      },
      (err, data) => {
        if (err) {
          // if the email has already been registered
          if (err.code === 'UsernameExistsException') {
            resolve({ isNewUser: false })
            return
          }
          reject(err)
          return
        }
        if (data && !data.User) {
          reject(new Error('user does not exists'))
          return
        }
        resolve({ isNewUser: true })
      },
    )
  })

/**
 * get session to update account status
 * @param {sting} name
 */
const initiateAuth = async (name: string) => {
  cognito.adminInitiateAuth(
    {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: CONFIG.AWS.COGNITO.USER_POOL_ID,
      ClientId: CONFIG.AWS.COGNITO.CLIENT_ID,
      AuthParameters: {
        USERNAME: name,
        PASSWORD: tempPassword,
      },
    },
    (err, data) => {
      if (err) return err
      return data
    },
  )
}

/**
 * respond to auth challenge to update account status to "Confirm"
 * @param {string} challengeName
 * @param {sting} session
 */
const respondToAuthChallenge = async (input: any) => {
  cognito.adminRespondToAuthChallenge(
    {
      ...input,
      UserPoolId: CONFIG.AWS.COGNITO.USER_POOL_ID,
      ClientId: CONFIG.AWS.COGNITO.CLIENT_ID,
    },
    (err, data) => {
      if (err) return err
      return data
    },
  )
}

// ------------------------------------
// Accessors
// ------------------------------------

/**
 * create user in cognito and verify account
 * @param {string} name
 * @param {string} email
 */
const createCognitoUser = async (name: string, email: string): Promise<any> => {
  try {
    const username = createCognitoUsername(name)
    const { isNewUser }: any = await createUser(username, email)
    if (isNewUser) {
      const { ChallengeName, Session }: any = await initiateAuth(username)
      await respondToAuthChallenge({
        ChallengeName,
        Session,
        ChallengeResponses: {
          NEW_PASSWORD: generatePassword(),
          USERNAME: username,
        },
      })
    }
    return { isNewUser }
  } catch (err) {
    return err
  }
}

export default {
  createCognitoUser,
}
