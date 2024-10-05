import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string> {
  private readonly objectIdRegex = /^[0-9a-fA-F]{24}$/;
  transform(value: string): string {
    if (!this.objectIdRegex.test(value)) {
      throw new BadRequestException(`${value} is not a valid ObjectId`);
    }
    return value;
  }
}
