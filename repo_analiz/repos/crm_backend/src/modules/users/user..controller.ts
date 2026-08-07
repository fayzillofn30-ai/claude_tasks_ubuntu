import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) { }


  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: "string", example : "Fayzillo"},
        lastName: { type: "string",example : "Ummatov" },
        father: { type: "string" ,example : "Soliyev Ziyodulla"},
        phone: { type: "string",example : "+998992422141" },
        birthDay: { type: "string",format : "date" },
        email: { type: "string" ,example : "ovovovlululutvata@gmail.com"},
        password: { type: "string" ,example : "12345678"},
        image : {
          type : "string",
          format : "binary"
        }
      },
      required : ["firstName","lastName","email","password","birthDay","phone"]
    },
  })
  @ApiConsumes("multipart/form-data")
  @Post("create")
  @UseInterceptors(FileInterceptor("image", fileStorages(["image"])))
  create(
    @Body() createStaffDto: CreateUserDto,
    @UserData() user: JwtPayload,
    @UploadedFile() image?: Express.Multer.File
  ) {
    console.log("Staff Controller ",image)
    return this.UsersService.create(createStaffDto,image);
  }

  @Get("get-all")
  findAll() {
    return this.UsersService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.UsersService.findOne(id);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: "string", example : "Fayzillo"},
        lastName: { type: "string",example : "Ummatov" },
        father: { type: "string" ,example : "Soliyev Ziyodulla"},
        phone: { type: "string",example : "+998992422141" },
        birthDay: { type: "string",format : "date" },
        email: { type: "string" ,example : "ovovovlululutvata@gmail.com"},
        role: { type: "string",example : "STUDENT",examples : ["STUDENT","ADMIN","TEACHER"] },
        password: { type: "string" ,example : "12345678"},
        image : {
          type : "string",
          format : "binary"
        }
      },
    },
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("image", fileStorages(["image"])))
  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateUserDto) {
    return this.UsersService.update(id, updateStaffDto);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.UsersService.remove(id);
  }
}
