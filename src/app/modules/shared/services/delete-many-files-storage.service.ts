import {Injectable} from '@angular/core';

import {AngularFireStorage, AngularFireStorageReference} from '@angular/fire/compat/storage';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteManyFilesStorageService {

  constructor(private _angularFireStorage: AngularFireStorage) {
  }

  public execute(fileUrlList: any []): void {
    fileUrlList.forEach(async (url: string) => {
      if (url.includes('https://firebasestorage.googleapis.com')) {
        await this._removeImageFromUrl(url);
      }
    });
  }

  private async _removeImageFromUrl(url: string): Promise<void> {
    const storageRef: AngularFireStorageReference = this._angularFireStorage.refFromURL(url);
    await firstValueFrom(storageRef.delete());
  }
}
