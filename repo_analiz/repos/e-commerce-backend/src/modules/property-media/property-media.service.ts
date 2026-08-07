import { Injectable } from '@nestjs/common';
import { CreatePropertyMediaDto } from './dto/create-property-media.dto';
import { UpdatePropertyMediaDto } from './dto/update-property-media.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { urlGenerator } from 'src/common/types/generator.types';
import { ConfigService } from '@nestjs/config';
import { checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class PropertyMediaService {
  constructor(private prisma: PrismaService,private config : ConfigService) {}

  async create(
    data: CreatePropertyMediaDto,
    files: {
      features?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
      attachments?: Express.Multer.File[];
    }
  ) {

    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.PROPERTIES,"id",data.propertyId)
    console.log(files)
    const featuresUrls = files.features ? 
      files.features.map(file => urlGenerator(this.config,file.filename) ) : []
    
    const galleryUrls = files.gallery ? 
      files.gallery.map(file => urlGenerator(this.config,file.filename)) : []
    
    const attachmentsUrls = files.attachments ? 
      files.attachments.map(file => urlGenerator(this.config,file.filename)) : [];

    return await this.prisma.propertyMedia.create({
      data: {
        propertyId: data.propertyId,
        features: featuresUrls,
        gallery: galleryUrls,
        attachments: attachmentsUrls,
      },
      include: {
        property: true
      }
    });
  }

  async findAll() {
    return await this.prisma.propertyMedia.findMany({
      include: {
        property: {
          select: {
            title: true,
            additionals: true,
            owner : {
              select : {
                fullName : true,
                email : true,
                avatar : true,
                role : true,
              },
            },
            locationUrl : true,
            address : true,
            category : true,
            description : true,
            price :  true,
            isSale : true,
            status : true,
            features : true,
            discount : true,
            id : true,
            ownerId : true,
          }
        }
      }
    });
  }

  async findOne(id: string) {
    return await this.prisma.propertyMedia.findUnique({
      where: { id },
      include: {
        property: true
      }
    });
  }

  async update(
    id: string, 
    updatePropertyMediaDto: UpdatePropertyMediaDto,
    files?: {
      features?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
      attachments?: Express.Multer.File[];
    }
  ) {
    const updateData: any = {};

    if (files?.features) {
      updateData.features = files.features.map(file => this.saveFile(file));
    }

    if (files?.gallery) {
      updateData.gallery = files.gallery.map(file => this.saveFile(file));
    }

    if (files?.attachments) {
      updateData.attachments = files.attachments.map(file => this.saveFile(file));
    }

    return await this.prisma.propertyMedia.update({
      where: { id },
      data: updateData,
      include: {
        property: true
      }
    });
  }

  async remove(id: string) {
    return await this.prisma.propertyMedia.delete({
      where: { id }
    });
  }

  // Fayl saqlash helper method
  private saveFile(file: Express.Multer.File): string {
    // Bu yerda fayl saqlash logic yozing
    // Masalan: AWS S3, local storage, CloudFlare va h.k.
    
    // Misol uchun:
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `uploads/${fileName}`;
    
    // Faylni saqlash logic...
    // fs.writeFileSync(filePath, file.buffer);
    
    return filePath; // yoki URL qaytaring
  }
}