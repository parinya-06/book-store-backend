import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import CreateUserDTO from '../users/dto/create-user.dto'

@Injectable()
export class RegisterValidationPipe implements PipeTransform {
  @Inject() private readonly usersService: UsersService

  async transform(body: CreateUserDTO): Promise<CreateUserDTO> {
    const userExists = await this.usersService.findByUsername(body.username)
    if (userExists) {
      throw new BadRequestException(`User already exists`)
    }
    return body
  }
}
