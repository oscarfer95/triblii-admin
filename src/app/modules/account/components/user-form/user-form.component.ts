import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MODULES_LIST } from 'src/app/modules/shared/constants/modules.constant';
import { EntitiesRepositoryService } from 'src/app/modules/shared/services/entities.repository-service';
import { ConfigList } from 'src/framework/repository/config-list.model';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {

  @Input()
  public form!: FormGroup;

  @Input()
  public user!: any;

  @Input()
  public userDataModel!: any;

  public roleList!: any[];
  public entityList!: any[];
  public moduleList: any[] = MODULES_LIST;

  constructor(private _entitiesRepositoryService: EntitiesRepositoryService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._initRoleList();
    this._initForm();
  }

  public getActionKeys(): string[] {
    return Object.keys(this.form?.get('actions')?.value);
  }

  public getActionLabel(action: string): string {
    let label = '';

    switch (action) {
      case 'create':
        label = 'Crear'
        break;

      case 'update':
        label = 'Editar'
        break;

      case 'read':
        label = 'Leer'
        break;

      case 'delete':
        label = 'Eliminar'
        break;
    }

    return label;
  }

  private async _getEntities(): Promise<any[]> {
    const configList: ConfigList = {
      orderByConfigList: [
        {
          field: 'name',
          direction: 'asc'
        }
      ]
    };

    return firstValueFrom(this._entitiesRepositoryService.getByQuerys(configList));
  }

  private async _initRoleList() {
    const superAdminObj = {
      name: 'Super Administrador',
      value: 'SUPERADMIN'
    };

    this.roleList = [
      {
        name: 'Mantenedor',
        value: 'MAINTAINER'
      },
      {
        name: 'Administrador',
        value: 'ADMIN'
      }
    ]

    if (this.userDataModel.role === 'SUPERADMIN') {
      this.roleList.push(superAdminObj);
      this.entityList = await this._getEntities();
    } else[
      this.entityList = [
        {
          id: this.userDataModel.entity.id,
          name: this.userDataModel.entity.name
        }
      ]
    ];

    this._cdr.markForCheck();
  }

  private _initForm(): void {
    const entityId: string = (this.userDataModel?.role === 'ADMIN') ? this.userDataModel.entity.id : this.user.entityId;

    this.form?.addControl('name', this._formBuilder.control(this.user.name, [Validators.required, Validators.min(1), Validators.max(30)]));
    this.form?.addControl('role', this._formBuilder.control(this.user.role, [Validators.required]));
    this.form?.addControl('permissions', this._formBuilder.control(this.user.permissions));
    this.form?.addControl('entityId', this._formBuilder.control(entityId, [Validators.required]));
    this.form?.addControl('email', this._formBuilder.control(this.user.email, [Validators.required]));

    const actionsGroup = this._formBuilder.group({});
    Object.keys(this.user.actions).forEach((action: string) => {
      actionsGroup.addControl(action, this._formBuilder.control(this.user.actions[action]));
    });

    this.form?.addControl('actions', actionsGroup);
  }
}
