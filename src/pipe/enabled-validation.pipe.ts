import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'

@Injectable()
export class EnabledValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.enabled === true || value.enabled === false) {
      return value
    } else {
      throw new BadRequestException(`User Enabled not found`)
    }
  }
}
