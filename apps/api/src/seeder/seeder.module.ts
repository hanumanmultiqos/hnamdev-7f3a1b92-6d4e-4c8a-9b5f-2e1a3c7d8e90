import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Organization } from '../modules/organizations/organization.entity';
import { SeederService } from '../seeds/seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}