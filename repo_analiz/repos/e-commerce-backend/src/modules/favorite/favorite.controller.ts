import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post("create/:id")
  create(
    @Param("id") id: string, // propertyId
    @UserData() user : JwtPayload // {id : string,role : string}
  ) {
    return this.favoriteService.create(id,user.id);
  }

  @Get("get-myfv")
  findAll(
    @UserData() user : JwtPayload // {id : string,role : string}
  ) {
    return this.favoriteService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string, // propertyid
    @UserData() user : JwtPayload // {id : string,role : string}
  ) {
    return this.favoriteService.findOne(id,user.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string, // propertyId
    @UserData() user : JwtPayload // {id : string,role : string}
  ) {
    return this.favoriteService.remove(id,user.id);
  }
}
