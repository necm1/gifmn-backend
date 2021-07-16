import {Injectable} from '@nestjs/common';
import {MissingParameterException} from '../../_exception/missing-parameter.exception';
import {WrongTypeException} from '../exception/wrong-type.exception';
import {environment} from '../../environment';
import {AttachmentService} from './attachment.service';
import {AttachmentUrlNotFoundException} from '../exception/attachment-url-not-found.exception';
import * as path from 'path';
import * as fs from 'fs';
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

  public async delete(url: string, type: string): Promise<void> {
    const splittedType = type.split('/');

    const directory = environment.upload.appPath ? path.join(appPath, `${environment.upload.path}`) : environment.upload.path;

    await this.createDirectoryIfNotExists(directory);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fs.unlink(path.join(directory, `${url}.${splittedType[1]}`), () => {});
  }

  /**
   * Handle File Upload
   *
   * @private
   * @async
   * @param files
   * @returns Promise<FileModel[]>
   */
  public async upload(files: any[]): Promise<FileModel[]> {
    const savedFiles: FileModel[] = [];

    for await (const file of files) {
      await this.validateFile(file.fieldname, file.mimetype);
      const name = Math.random().toString(36).substr(2, 7);

      try {
        const entity = await this.attachmentService.getByURL(name);

        // @todo handle entity existence
      } catch (e) {
        // Attachment does not exists
        // so we are ready to go
        if (e instanceof AttachmentUrlNotFoundException) {
          const directory = environment.upload.appPath ? path.join(appPath, `${environment.upload.path}`) : environment.upload.path;

          await this.createDirectoryIfNotExists(directory);

          //pump(file.file, fs.createWriteStream(path.join(directory, `${name}.${file.mimetype.split('/')[1]}`)))
          fs.writeFileSync(path.join(directory, `${name}.${file.mimetype.split('/')[1]}`), await file.toBuffer());

          savedFiles.push({
            name: name,
            type: file.mimetype,
            old: file.filename
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
        !(
          splittedType.indexOf('image') === -1 ||
          !environment.upload.allowedImageTypes.filter(fileType => splittedType[1] === fileType)[0]) &&
        !(
          splittedType.indexOf('video') === -1 ||
          !environment.upload.allowedVideoTypes.filter(fileType => splittedType[1] === fileType)[0]
        )
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
