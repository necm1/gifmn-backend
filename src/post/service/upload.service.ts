import {Injectable} from '@nestjs/common';
import {MissingParameterException} from '../../_exception/missing-parameter.exception';
import {WrongTypeException} from '../exception/wrong-type.exception';
import {environment} from '../../environment';
import {AttachmentService} from './attachment.service';
import {AttachmentUrlNotFoundException} from '../exception/attachment-url-not-found.exception';
import * as path from 'path';
import * as fs from 'fs';
import * as pump from 'pump';
import {appPath} from '../../main';
import {FileModel} from '../model/file.model';

@Injectable()
/**
 * @class UploadService
 */
export class UploadService {
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
   * @returns Promise<FileModel[]>
   */
  public async upload(files: any): Promise<FileModel[]> {
    const savedFiles: FileModel[] = [];

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

          savedFiles.push({
            name: `${name}.${file.mimetype.split('/')[1]}`,
            type: await this.getFileType(file.mimetype.split('/')[1])
          });
        }
      }
    }

    return savedFiles;
  }

  /**
   *
   * @param type
   * @private
   */
  private getFileType(type: string): Promise<'image' | 'video'> {
    return new Promise<'image' | 'video'>(resolve => {
      const videoTypes = environment.upload.allowedVideoTypes;
      const imageTypes = environment.upload.allowedImageTypes;

      const videoType = videoTypes.filter(vType => vType === type);

      if (videoType && videoType[0]) {
        resolve('video');
      }

      const imageType = imageTypes.filter(iType => iType === type);

      if (imageType && imageType[0]) {
        resolve('image');
      }

      throw new WrongTypeException(type);
    });
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
   * @param field
   * @param type
   * @returns Promise<void>
   */
  private validateFile(field: string, type: string): Promise<void> {
    return new Promise<void>(resolve => {
      if (field !== 'images') {
        throw new MissingParameterException('images');
      }

      // Get type and subtype
      const splittedType = type.split('/');

      // check for type
      if (
        splittedType[0] !== 'image' ||
        !environment.upload.allowedImageTypes.filter(fileType => splittedType[1] === fileType)[0]
      ) {
        throw new WrongTypeException(type);
      }

      if (
        // @ts-ignore
        splittedType[0] !== 'video' ||
        !environment.upload.allowedVideoTypes.filter(fileType => splittedType[1] === fileType)[0]
      ) {
        throw new WrongTypeException(type);
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
    } catch (e) {
      // Create Directory
      await fs.promises.mkdir(path);
    }
  }
}
