import Mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    index: true,
  },
  lastName: {
    type: String,
    required: true,
    index: true,
  },
  userState: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  phone: {
    type: String,
    required: false,
  },
  phoneExt: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: true,
    enum: ['REMAX', 'ROYAL_PACIFIC', 'OAKWYN', 'OTHER'],
    index: true,
    sparse: true,
  },

  position: {
    type: String,
    required: true,
    index: true,
    enum: ['ADMIN', 'CLIENT', 'AGENT'],
  },
  role: {
    type: String,
    required: true,
    index: true,
    enum: ['ADMIN', 'USER'],
  },
  lastLogin: {
    type: Date,
    required: false,
  },
}, { timestamps: true })

UserSchema.set('toJSON', {
  transform: (doc: any, ret: any) => {
    ret.id = ret._id // eslint-disable-line
    delete ret._id // eslint-disable-line
    delete ret.__v // eslint-disable-line
  },
})

export default Mongoose.model('User', UserSchema)
