import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('devices')
@UseGuards(JwtAuthGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  findByUser(@CurrentUser() user: { id: number }) {
    return this.deviceService.findByUser(user.id);
  }

  @Post()
  bindDevice(@CurrentUser() user: { id: number }, @Body() dto: CreateDeviceDto) {
    return this.deviceService.bindDevice(user.id, dto);
  }

  @Get('products')
  findProducts() {
    return this.deviceService.findProducts();
  }

  @Get('products/:id')
  findProduct(@Param('id', ParseIntPipe) id: number) {
    return this.deviceService.findProduct(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.deviceService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateDeviceDto,
  ) {
    return this.deviceService.update(id, user.id, dto);
  }

  @Delete(':id')
  unbind(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.deviceService.unbind(id, user.id);
  }
}
