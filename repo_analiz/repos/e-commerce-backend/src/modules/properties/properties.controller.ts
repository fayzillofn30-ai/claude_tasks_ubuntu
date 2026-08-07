import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PropertyApiBody } from 'src/common/types/api.body.types';
import { Public, UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';
import { Response } from 'express';
import { Property } from '@prisma/client';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) { }

  // @ApiConsumes('multipart/form-data') 
  // @ApiBody(PropertyApiBody)
  @Post("create")
  create(@Body() data: any, @UserData() user: JwtPayload) {
    console.log(data)
    return this.propertiesService.create(data, user.id);
  }

  @Public()
  @Get("get-all")
  findAll(@Query() queries: Partial<Property>) {
    console.log(queries)
    return this.propertiesService.findAll(undefined,queries);
  }

  @Get("get-all/my-properties")
  myProperties(
    @Query() queries: Partial<Property>,
    @UserData() user : JwtPayload
  ) {
    console.log(queries)
    return this.propertiesService.findAll(user.id,queries);
  }


  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
