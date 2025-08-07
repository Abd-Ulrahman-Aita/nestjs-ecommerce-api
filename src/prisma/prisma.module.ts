import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // make PrismaService avaliable in every where wihotut need to import it 
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}