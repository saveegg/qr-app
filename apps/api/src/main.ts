import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

async function bootstrap() {
  const httpsEnabled = process.env.HTTPS_ENABLED === 'true';
  const privateKeyPath =
    process.env.PRIVATE_KEY_FILE || 'default/path/to/private-key.pem';
  const certificatePath =
    process.env.CERTIFICATE_FILE || 'default/path/to/certificate.pem';

  let httpsOptions = null;
  const port = process.env.PORT || 3000;

  if (httpsEnabled) {
    // Configure HTTPS options
    httpsOptions = {
      key: fs.readFileSync(privateKeyPath),
      cert: fs.readFileSync(certificatePath),
    };
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });
  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
