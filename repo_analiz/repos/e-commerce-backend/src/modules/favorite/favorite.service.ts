import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  // Create or toggle favorite
  async create(propertyId: string, userId: string) {
    // tekshiramiz user allaqachon qo‘shganmi
    const exists = await this.prisma.favorite.findFirst({
      where: { propertyId, userId },
    });

    if (exists) {
      // agar mavjud bo‘lsa, o‘chiramiz (toggle)
      await this.prisma.favorite.delete({ where: { id: exists.id } });
      return { message: "Removed from favorites", removed: true };
    }

    const favorite = await this.prisma.favorite.create({
      data: { propertyId, userId },
      include: { property: true },
    });

    return { message: "Added to favorites", favorite };
  }

  // Get all favorites of user
  async findAll(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
    });
  }

  // Get one favorite by propertyId
  async findOne(propertyId: string, userId: string) {
    return this.prisma.favorite.findFirst({
      where: { propertyId, userId },
      include: { property: true },
    });
  }

  // Remove from favorites
  async remove(propertyId: string, userId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: { propertyId, userId },
    });

    if (!favorite) {
      return { message: "Favorite not found" };
    }

    await this.prisma.favorite.delete({ where: { id: favorite.id } });
    return { message: "Favorite removed" };
  }
}
