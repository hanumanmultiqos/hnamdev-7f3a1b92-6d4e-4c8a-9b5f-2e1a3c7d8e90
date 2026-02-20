import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuditModule } from './modules/audit/audit.module';
import { SeederModule } from './seeder/seeder.module';

// Services
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/api/.env',
    }),
    DatabaseModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    RolesModule,
    OrganizationsModule,
    TasksModule,
    AuditModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
