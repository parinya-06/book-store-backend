import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'

@Injectable()
export class RegisterValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.username) {
      throw new BadRequestException(
        `Validation failed. "username" is not a no data`,
      )
    }
    if (!value.password) {
      throw new BadRequestException(
        `Validation failed. "password" is not a no data`,
      )
    }
    if (!value.firstname) {
      throw new BadRequestException(
        `Validation failed. "firstname" is not a no data`,
      )
    } else {
      return value
    }
  }
}
