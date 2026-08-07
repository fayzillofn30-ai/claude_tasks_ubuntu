import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  fileStorages,
} from 'src/common/types/upload_types';
import { userApiBody } from 'src/common/types/api.body.types';
import { Public, UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/types/jwt.typs';
import { get } from 'http';
import { MODEL_NAME } from 'src/common/types/auth.types';
import { ModelsEnum } from 'src/common/types/global.types';


@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiExcludeEndpoint()
  @Post("create")
  @ApiConsumes('multipart/form-data')
  @ApiBody(userApiBody)
  @UseInterceptors(FileInterceptor('image', fileStorages(["image"])))
  create(
    @Body() data: CreateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
      return image ? this.usersService.create(data,image.filename) 
      : this.usersService.create(data)
  }

  @Patch("updateimange/:id")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema :{
      type : "object",
      properties : {
        image : {type : "string",format : "binary"}
      }
    } 
  })
  @UseInterceptors(FileInterceptor("image",fileStorages(["image"])))
  updateImage(
    @UploadedFile() image : Express.Multer.File,
    @Param("id") id :  string
  ){
    return this.usersService.updateImage(id,image.filename)
  }

  @Get("get-profile")
  getProfile(@UserData() user : JwtPayload) {
    console.log(user)
    return this.usersService.getProfile(user.id)
  }

  @Public()
  @Get("get-all")
  findAll(@UserData() user : JwtPayload) {
    console.log(user)
    return this.usersService.findAll();
  }


  @Get('get-byid/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get("get-my")
  getMy(@UserData() user : JwtPayload) {
    console.log(user)
    return this.usersService.findOne(user.id)
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor("image",fileStorages(["image"])))
  update(
    @Param('id') id: string, @Body() data: UpdateUserDto,
    @UploadedFile() image? : Express.Multer.File
  ) {
    return image ? this.usersService.update(id, data,image.filename) 
      : this.usersService.update(id, data)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
