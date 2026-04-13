import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { PetModule } from './modules/pet/pet.module';
import { HealthModule } from './modules/health/health.module';
import { GrowthModule } from './modules/growth/growth.module';
import { DeviceModule } from './modules/device/device.module';
import { VaccinationModule } from './modules/vaccination/vaccination.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_DATABASE', 'pawmind'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    PetModule,
    HealthModule,
    GrowthModule,
    DeviceModule,
    VaccinationModule,
  ],
})
export class AppModule {}
