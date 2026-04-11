import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  create(@CurrentUser() user: { id: number }, @Body() dto: CreatePetDto) {
    return this.petService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: { id: number }) {
    return this.petService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.petService.findOne(id, user.id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }, @Body() dto: UpdatePetDto) {
    return this.petService.update(id, user.id, dto);
  }

  @Delete(':id')
  archive(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.petService.archive(id, user.id);
  }
}
