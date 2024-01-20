import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { QRCodeService } from './qrcode/qrcode.service';

@Controller()
export class AppController {
  constructor(private readonly qrcodeService: QRCodeService) {}

  @Get()
  getHello(): string {
    return this.qrcodeService.getHello();
  }

  @Post('/validate_qr')
  @HttpCode(HttpStatus.OK)
  async validateQRCode(@Body('qr_code') qrCode: string) {
    try {
      const info = await this.qrcodeService.retrieveInfoFromDB(qrCode);
      if (info) {
        return info;
      } else {
        throw new BadRequestException('QR code not found');
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
