import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

const privateKeyPath =
  process.env.PRIVATE_KEY_FILE || 'default/path/to/private-key.pem';
const certificatePath =
  process.env.CERTIFICATE_FILE || 'default/path/to/certificate.pem';

const httpsOptions = {
  key: fs.readFileSync(privateKeyPath),
  cert: fs.readFileSync(certificatePath),
};

async function bootstrap() {
  // eslint-disable-next-line prettier/prettier
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions });
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });

  app.setGlobalPrefix('api');
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
