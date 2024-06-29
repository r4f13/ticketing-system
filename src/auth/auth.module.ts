import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService,DatabaseService],
  controllers: [AuthController]
})
export class AuthModule {}
