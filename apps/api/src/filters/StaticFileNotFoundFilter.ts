import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Catch(NotFoundException)
export class StaticFileNotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    console.log('** here **');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Assuming your static files are in the 'public' directory
    const publicFolderPath = path.join(__dirname, '..', 'public');
    const notFoundFilePath = path.join(publicFolderPath, '404.html');

    // Check if the requested path corresponds to an existing file
    const requestedFilePath = path.join(publicFolderPath, request.url);
    if (
      fs.existsSync(requestedFilePath) &&
      fs.statSync(requestedFilePath).isFile()
    ) {
      // Send the requested file if it exists
      response.sendFile(requestedFilePath);
    } else {
      // Send the custom 404 page
      response.sendFile(notFoundFilePath);
    }
  }
}
