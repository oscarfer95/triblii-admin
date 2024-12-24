import { ConfirmationService, MessageService } from 'primeng/api';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';

import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import CanDeactivateComponent from '../../../shared/models/router/can-deactivate-component';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { UsersRepositoryService } from 'src/app/modules/shared/services/users.repository-service';
import { User } from 'src/app/modules/shared/models/user.model';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetail implements CanDeactivateComponent, OnInit, OnDestroy {

  public user: any | null;
  public itemForm!: FormGroup;
  private _itemFormSaved: boolean;

  public userDataModel!: UserDataModel;

  private _confirmDeactivate$: Subject<boolean>;

  private _unsubscribe: Subject<void>;

  constructor(private _usersRepositoryService: UsersRepositoryService,
    private _userDataModelService: UserDataModelService,
    private _confirmationService: ConfirmationService,
    private _activatedRoute: ActivatedRoute,
    private _loaderService: LoaderService,
    private _toastService: MessageService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    public location: Location) {
    this._itemFormSaved = false;

    this._confirmDeactivate$ = new Subject();

    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._userDataModelListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public saveForm(): void {
    this._loaderService.show = true;
    const formValue: any = this.itemForm.value;
    const user: any = { ...this.user, ...formValue };

    if (user.id) {
      delete user.id;
      user.entitiesId?.includes(this.userDataModel.entity.id) ? null : user.entitiesId?.push(this.userDataModel.entity.id);
      this._editUser(user);
    } else {
      user.entitiesId?.push(this.userDataModel.entity.id);
      this._createUser(user);
    }
  }

  private _editUser(user: any): void {
    firstValueFrom(this._usersRepositoryService.update(user, this.user.id as string))
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Usuario editado',
          detail: user.name + ' se editó correctamente',
          life: 6000
        });

        this._itemFormSaved = true;
        this._loaderService.show = false;
        this._router.navigate([`/dashboard/account/users`]);
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error editando',
          detail: 'Ocurrio un error al guardar el usuario',
          life: 6000
        });

        this._itemFormSaved = false;
        this._loaderService.show = false;
        console.error(error);
      });
  }

  private _createUser(user: any): void {
    firstValueFrom(this._usersRepositoryService.create(user))
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Usuario añadido',
          detail: user.name + ' se creó correctamente',
          life: 6000
        });

        this._itemFormSaved = true;
        this._loaderService.show = false;
        this._router.navigate([`/dashboard/account/users`]);
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error creando',
          detail: 'Ocurrio un error al crear el usuario',
          life: 6000
        });

        this._itemFormSaved = false;
        this._loaderService.show = false;
        console.error(error);
      });
  }

  private _getItem(): void {
    if (this._activatedRoute.snapshot.params['id'] === 'new') {
      this.user = new User();
    } else {
      firstValueFrom(this._usersRepositoryService.getById(this._activatedRoute.snapshot.params['id']))
        .then((user: any[]) => {
          this.user = user;
          this._cdr.markForCheck();
        });
    }


    this.itemForm = this._formBuilder.group({});
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel.accountId) {
          this.userDataModel = userDataModel;
          this._getItem();

          this._cdr.markForCheck();
        }
      });
  }

  public isFormValid(): boolean {
    return (this.itemForm.invalid);
  }

  public canDeactivate(): boolean | Observable<boolean> {
    if (!this.itemForm.dirty ||
      (this.itemForm.dirty && this._itemFormSaved)) {
      return true;
    }

    this._openConfirmationModal();
    return this._confirmDeactivate$.asObservable();
  }

  private _openConfirmationModal(): void {
    this._confirmationService.confirm({
      message: 'Seguro que deseas salir sin guardar los cambios?',
      header: 'Cambios sin guardar',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      closeOnEscape: true,
      dismissableMask: true,
      rejectButtonStyleClass: 'ss-button--clear ss-txt--black-lighten',
      acceptButtonStyleClass: 'ss-button--red',
      rejectIcon: '',
      acceptIcon: '',
      accept: () => {
        this._confirmDeactivate$.next(true);
      },
      reject: () => {
        this._confirmDeactivate$.next(false);
      }
    });
  }
}
