import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop()
  username: string

  @Prop()
  password: string

  @Prop()
  name: string

  @Prop({ default: 'user' })
  role: string

  @Prop({ default: true })
  enabled: boolean

  @Prop({ type: Date, default: Date, required: true })
  time: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
