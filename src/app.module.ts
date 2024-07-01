import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TicketController } from './ticket/ticket.controller';
import { TicketModule } from './ticket/ticket.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { TicketService } from './ticket/ticket.service';

@Module({
  imports: [AuthModule,DatabaseModule,TicketModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController, TicketController],
  providers: [AppService, DatabaseService, TicketService],
})
export class AppModule {}
