import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(BadRequestException)
export class DataValidationExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, _host: ArgumentsHost): Observable<any> {
    return throwError(() => exception);
  }
}
