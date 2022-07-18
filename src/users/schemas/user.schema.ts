import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ERole } from '../enums/enum-role'

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
    index: true,
    type: String,
    required: true,
  })
  password: string

  @Prop({
    index: true,
    type: String,
    required: true,
  })
  firstname: string

  @Prop({
    index: true,
    type: String,
    required: false,
    default: null,
  })
  lastname?: string

  @Prop({
    type: String,
    default: ERole.User,
  })
  roles?: ERole

  @Prop({
    type: Boolean,
    default: true,
  })
  enabled?: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)
