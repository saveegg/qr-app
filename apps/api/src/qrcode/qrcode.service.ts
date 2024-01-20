import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QRCode } from './qrcode.entity';

@Injectable()
export class QRCodeService {
  constructor(
    @InjectRepository(QRCode)
    private readonly qrCodeRepository: Repository<QRCode>,
  ) {}

  getHello(): string {
    return 'Hello!';
  }

  async retrieveInfoFromDB(qrCode: string): Promise<any> {
    try {
      if (qrCode !== undefined) {
        const qrCodeEntity = await this.qrCodeRepository.findOne({
          where: { qr_code: qrCode },
        });
        if (qrCodeEntity) {
          return {
            name: qrCodeEntity.name,
            email: qrCodeEntity.email,
            amount: qrCodeEntity.amount,
          };
        } else {
          return null;
        }
      }
    } catch (error) {
      throw new Error(
        'An error occurred while retrieving data from the database.',
      );
    }
  }
}
