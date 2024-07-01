import { AuthGuard } from '@nestjs/passport';

export class ReadonlyJwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();       
    if (user) return user;
    else{
      return null;
    }
  }
}