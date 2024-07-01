import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { TicketController } from './ticket.controller';

@Module({
  controllers: [TicketController],
  providers: [TicketService, DatabaseService, JwtStrategy]
})
export class TicketModule {}
