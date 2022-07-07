import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'

@Injectable()
export class RegisterValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isNaN(value)) {
      throw new BadRequestException(
        `Validation failed. "${value}" is not a no data`,
      )
    }
    return value
  }
}
