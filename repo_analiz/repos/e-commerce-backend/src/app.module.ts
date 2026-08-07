import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './global/guards/jwt.auth.guard';
import { CategoriesModule } from './modules/categories/categories.module';
import { AdditionalModule } from './modules/additional/additional.module';
import { BuildTypeModule } from './modules/build-type/build-type.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { PropertyMediaModule } from './modules/property-media/property-media.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
@Module({
  imports: [
    UsersModule,
    CoreModule,
    CategoriesModule,
    AdditionalModule,
    BuildTypeModule,
    PropertiesModule,
    PropertyMediaModule,
    FavoriteModule, 
  ],
  providers : [
    {
      provide : APP_GUARD,
      useClass : JwtAuthGuard
    }
  ]
})
export class AppModule {}
