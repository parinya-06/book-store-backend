import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document
@Schema({
  collection: 'users',
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({
    index: true,
    unique: true,
    type: String,
    required: true,
  })
  username: string

  @Prop({
    type: String,
    required: true,
  })
  password: string

  @Prop({
    type: String,
    required: true,
  })
  firstname: string

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  lastname?: string

  @Prop({
    type: String,
    default: 'user',
  })
  role?: string

  @Prop({
    type: Boolean,
    default: true,
  })
  enabled?: boolean

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  refreshToken?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
