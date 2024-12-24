import { FileUpload } from 'primeng/fileupload';
import { MenuItem } from 'primeng/api';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { UploadFileStorageService } from 'src/app/modules/shared/services/upload-file-storage.service';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { EntitiesRepositoryService } from 'src/app/modules/shared/services/entities.repository-service';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';

@Component({
  selector: 'account-page',
  templateUrl: './account.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountPage implements OnInit, OnDestroy {

  @ViewChild('inputPhoto')
  private _inputPhoto!: FileUpload;

  public tabItems: MenuItem[];
  public activeTab: MenuItem;

  public userDataModel!: UserDataModel | any;

  private _unsubscribe: Subject<void>;

  constructor(private _entitiesRepositoryService: EntitiesRepositoryService,
    private _ssUploadFileStorageService: UploadFileStorageService,
    private _userDataModelService: UserDataModelService,
    private _loaderService: LoaderService,
    private _cdr: ChangeDetectorRef) {
    this.tabItems = [
      { label: 'Usuario', icon: 'pi pi-user-edit' },
      { label: 'Entidad', icon: 'pi pi-id-card' },
      { label: 'País', icon: 'pi pi-map-marker' },
      { label: 'Ajustes', icon: 'pi pi-cog' }
    ];

    this.activeTab = this.tabItems[0];

    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._userDataModelListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public changeTab(target: any): void {
    switch (target.innerText) {
      case 'Usuario':
        this.activeTab = this.tabItems[0];
        break;

      case 'Entidad':
        this.activeTab = this.tabItems[1];
        break;

      case 'País':
        this.activeTab = this.tabItems[2];
        break;

      case 'Ajustes':
        this.activeTab = this.tabItems[3];
        break;
    }
  }

  public async updateEntity(): Promise<any> {
    this.userDataModel.entity = await this._getEntity();

    this._userDataModelService.userDataModel = this.userDataModel;
    this._loaderService.show = false;
  }

  public _getEntity(): Promise<any> {
    return firstValueFrom(this._entitiesRepositoryService.getById(this._userDataModelService.userDataModel.entity.id));
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel.accountId) {
          this.userDataModel = userDataModel;

          this._cdr.markForCheck();
        }
      });
  }

  public uploadPhoto(event: any): void {
    const files: FileList = <FileList>(event.currentFiles);
    const file: File = files[0];

    if (files && files[0]) {
      this._loaderService.show = true;

      firstValueFrom(this._ssUploadFileStorageService.upload(file))
        .then((url: string) => {
          this.updateEntityLogoUrl(url);
        });
    }
  }

  public updateEntityLogoUrl(photoUrl: string): void {
    const entity = { photoUrl: photoUrl };

    firstValueFrom(this._entitiesRepositoryService.update(entity, this.userDataModel.entity.id))
      .then(() => {
        this._userDataModelService.userDataModel.entity.photoUrl = photoUrl;
        this.updateEntity();
        this._inputPhoto.clear();
      });
  }

  public getRoleString(role: string): string {
    let roleString: string = '';

    switch (role) {
      case 'ADMIN':
        roleString = 'Administrador';
        break;

      case 'MAINTAINER':
        roleString = 'Mantenedor';
        break;

      case 'SUPERADMIN':
        roleString = 'Super Admin';
        break;
    }

    return roleString;
  }

}
