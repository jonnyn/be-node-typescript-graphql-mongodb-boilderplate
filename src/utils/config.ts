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
    ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    REGION: process.env.AWS_REGION || 'us-west-2',
    S3: {
      BUCKET: process.env.S3_BUCKET || 'staging.tipbox.io',
    },
    COGNITO: {
      USER_POOL_ID: process.env.COGNITO_POOL_ID || 'us-west-2_GfObF7yPW',
      CLIENT_ID: process.env.COGNITO_CLIENT_ID || '4a331mnhf2fhfo83hr88rqa339',
      JWKS_URL: process.env.COGNITO_JWKS || 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_GfObF7yPW/.well-known/jwks.json',
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
