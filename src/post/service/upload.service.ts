import {Injectable} from '@nestjs/common';
import {MissingParameterException} from '../../_exception/missing-parameter.exception';
import {WrongImageTypeException} from '../exception/wrong-image-type.exception';
import {environment} from '../../environment';
import {AttachmentService} from './attachment.service';
import {AttachmentUrlNotFoundException} from '../exception/attachment-url-not-found.exception';
import * as path from 'path';
import * as fs from 'fs';
import * as pump from 'pump';
import {appPath} from '../../main';

@Injectable()
export class UploadService {
  /**
   * @public
   * @property
   */
  public savedFiles: string[] = [];

  /**
   * @private
   * @property
   */
  private mimeTypes: string[] = environment.upload.allowedImages ?? [];

  /**
   * UploadService Constructor
   *
   * @constructor
   * @param attachmentService
   */
  constructor(
    private attachmentService: AttachmentService
  ) {
  }

  /**
   * Handle File Upload
   *
   * @private
   * @async
   * @param files
   * @returns Promise<void>
   */
  public async upload(files: any): Promise<(string[] | void)> {
    const savedFiles: string[] = [];

    for await (const file of files) {
      console.log(file);
      await this.validateFile(file.fieldname, file.mimetype);
      let name = Math.random().toString(36).substr(2, 7);

      try {
        name = await this.validateEntity(name);
      } catch (e) {
        // Attachment does not exists
        // so we are ready to go
        if (e instanceof AttachmentUrlNotFoundException) {
          const directory = environment.upload.appPath ? path.join(appPath, `${environment.upload.path}`) : environment.upload.path;

          await this.createDirectoryIfNotExists(directory);

          pump(file.file, fs.createWriteStream(path.join(directory, `${name}.${file.mimetype.split('/')[1]}`)))

          savedFiles.push(`${name}.${file.mimetype.split('/')[1]}`);
        }
      }
    }

    return savedFiles;
  }

  private async validateEntity(name: string): Promise<string> {
    const entity = await this.attachmentService.getByURL(name);

    // Redo the whole process
    // to generate a new name
    if (entity) {
      return await this.validateEntity(Math.random().toString(36).substr(2, 7));
    }

    return name;
  }

  /**
   * Validate Request & File
   *
   * @private
   * @async
   * @param field
   * @param type
   * @returns Promise<void>
   */
  private async validateFile(field: string, type: string): Promise<void> {
    return new Promise<void>(resolve => {
      if (field !== 'images') {
        throw new MissingParameterException('images');
      }

      // Get type and subtype
      const splittedType = type.split('/');

      // check for image type
      if (splittedType[0] !== 'image' || !this.mimeTypes.filter(fileType => splittedType[1] === fileType)[0]) {
        throw new WrongImageTypeException(type);
      }

      resolve();
    });
  }

  /**
   * Validate Directory
   *
   * @private
   * @param path
   * @returns Promise<void>
   */
  private async createDirectoryIfNotExists(path: string): Promise<void> {
    try {
      // Directory exists
      await fs.promises.access(path, fs.constants.F_OK);
    }
    catch (e) {
      // Create Directory
      await fs.promises.mkdir(path);
    }
  }
}
