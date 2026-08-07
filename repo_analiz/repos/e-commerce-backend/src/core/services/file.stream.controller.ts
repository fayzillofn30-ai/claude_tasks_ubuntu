import {
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { FileStreamService } from './file.stream.service';
import { Public } from 'src/global/decorators/auth.decorators';


@Public()
@Controller()
export class FileStreamerController {

  constructor(
    private readonly fileService: FileStreamService
  ) { }

  @Get('video/:file')
  async streamVideo(
    @Param('file') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }

  @Get('archive/:file')
  async streamArchie(
    @Param('fileName') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }
  
  @Get('image/:file')
  async streamImage(
    @Param('file') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }
  
  @Get('docs/:file')
  async streamDocs(
    @Param('file') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }
}
