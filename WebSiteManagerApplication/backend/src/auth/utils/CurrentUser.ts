
import { createParamDecorator, UnauthorizedException, ExecutionContext } from '@nestjs/common';

export interface CurrentUserOptions {
  required?: boolean;
}

// export const CurrentUser: (options?: CurrentUserOptions) => ParameterDecorator = createParamDecorator((options: CurrentUserOptions = {}, req) => {
//   const user = req.user;
//   if (options.required && !user) {
//     throw new UnauthorizedException();
//   }
//   return user;
// });

export const CurrentUser = createParamDecorator(
  (options: CurrentUserOptions = {}, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (options.required && !user) {
      throw new UnauthorizedException();
    }

    return user;
  },
);