import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TicketController } from './ticket/ticket.controller';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TicketModule],
  controllers: [AppController, TicketController],
  providers: [AppService],
})
export class AppModule {}
