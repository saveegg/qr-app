import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { QRCodeService } from './qrcode/qrcode.service';
import { QRCode } from './qrcode/qrcode.entity';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StaticFileNotFoundFilter } from './filters/StaticFileNotFoundFilter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([QRCode]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '/../..', 'client', 'dist'),
      // serveStaticOptions: { index: false },
    }),
  ],
  controllers: [AppController],
  providers: [
    QRCodeService,
    // {
    //   provide: APP_FILTER,
    //   useClass: StaticFileNotFoundFilter,
    // },
  ],
})
export class AppModule {}
/*export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Add a custom middleware to handle 404 errors
    consumer
      .apply((req, res, next) => {
        console.log('** here **');
        // If no static file is found, return a 404 error
        if (!req.route) {
          console.log(' NOT FOUND****');
          res.status(404).send('Not Found');
        } else {
          next();
        }
      })
      .forRoutes({ path: '/*', method: RequestMethod.ALL }); // Adjust the path accordingly
  }
}*/
