import { Body, Controller, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guards/auth.gurad";
import { commentService } from "../services/comments.service";
import { SwaggerForm } from "src/common/enums/swaggerForm.enum";
import { createCommentDto } from "../dto/comments.dto";

@Controller('blog-comment')
@ApiTags('Blog')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)

export class commentController {
    constructor(
        private readonly blogCommentService: commentService,
    ) {}


    @Post('/')
    @ApiConsumes(SwaggerForm.Urlencode, SwaggerForm.Json)
    create(@Body() commentDto: createCommentDto) {
        return this.blogCommentService.createComment(commentDto);
    }

    @Put('/accept/:id')
    accept(@Param('id', ParseIntPipe) id: number) {
        return this.blogCommentService.accept(id);
    }

    @Put('/reject/:id')
    reject(@Param('id', ParseIntPipe) id: number) {
        return this.blogCommentService.reject(id);
    }
}