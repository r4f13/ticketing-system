import { CreateTicketDto } from "./create-ticket.dto";
import { PartialType } from "@nestjs/swagger";

export class EditNoteDto extends PartialType(CreateTicketDto){}