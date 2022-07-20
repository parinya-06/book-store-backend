import { ApiProperty } from '@nestjs/swagger'
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
  @ApiProperty({
    description: 'The username Length 6-15 char',
    type: String,
    required: true,
    example: 'test001',
  })
  @Prop({
    index: true,
    unique: true,
    type: String,
    required: true,
  })
  username: string

  @ApiProperty({
    description: 'The password Length 8-32 char',
    type: String,
    required: true,
    example: 'testing001',
  })
  @Prop({
    index: true,
    type: String,
    required: true,
  })
  password: string

  @ApiProperty({
    description: 'The firstname Length than 1 char',
    type: String,
    required: true,
    example: 'test',
  })
  @Prop({
    index: true,
    type: String,
    required: true,
  })
  firstname: string

  @ApiProperty({
    type: String,
    required: false,
    example: '001',
  })
  @Prop({
    index: true,
    type: String,
    required: false,
    default: null,
  })
  lastname?: string

  @ApiProperty({
    type: String,
    example: 'user',
  })
  @Prop({
    type: String,
    default: ERole.User,
  })
  roles?: ERole

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Prop({
    type: Boolean,
    default: true,
  })
  enabled?: boolean

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Prop({
    type: Boolean,
    default: true,
  })
  status?: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)
