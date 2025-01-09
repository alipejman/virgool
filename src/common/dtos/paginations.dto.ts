import { ApiProperty } from "@nestjs/swagger";

export class paginationsDto {
    @ApiProperty({type: "integer"})
    page: number;
    @ApiProperty({type: "integer"})
    limit: number;
}