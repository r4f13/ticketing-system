import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [CommentService, DatabaseService],
  controllers: [CommentController]
})
export class CommentModule {}
