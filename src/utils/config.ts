export default {
  PROJECT_NAME: 'Tipbox API',
  VERSION: '0.0.1',
  FILE_SIZE: '15mb',
  PORT: process.env.PORT || 8080,
  ENV: process.env.NODE_ENV || 'production',
  APP: {
    URL: process.env.APP_URL || 'http://localhost:8080',
  },
  MONGO: {
    URI: process.env.MONGO_URI || 'mongodb+srv://tipbox:xBGFbJSpIE0jiplF@staging-tipbox.wq2hk.mongodb.net/tipboxDB?retryWrites=true&w=majority',
  },
  AWS: {
    S3: {
      REGION: 'us-west-2',
      BUCKET: process.env.AWS_S3_BUCKET || 'staging.tipbox.io',
      ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
      SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    COGNITO: {
      REGION: 'us-west-2',
      ACCESS_KEY: '',
      SECRET_ACCESS_KEY: '',
      USER_POOL_ID: '',
      CLIENT_ID: '',
      JWKS_URL: process.env.COGNITO_JWKS || 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_yj5VWaMtA/.well-known/jwks.json',
    },
  },
  CORE_API: {
    URL: '',
    TOKEN: '',
  },
  EMAIL: {
    PROJECT_EMAILS_API: '',
  },
}
