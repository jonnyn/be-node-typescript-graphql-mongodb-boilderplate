import join from 'url-join'
import { GraphQLClient } from 'graphql-request'
import CONFIG from 'utils/config'

export const EmailsApi = new GraphQLClient(join(CONFIG.EMAIL.PROJECT_EMAILS_API, '/graphql'))

const sendInvitationEmail = async (input: unknown): Promise<unknown> => {
  const query = `
    mutation sendInvitationEmail($input: InvitationEmailInput!) {
      sendInvitationEmail(input: $input) {
        error { code }
      }
    }
  `
  const { InvitationEmailOutput: response } = await EmailsApi.request(query, { input })

  return response
}

export default {
  sendInvitationEmail,
}
