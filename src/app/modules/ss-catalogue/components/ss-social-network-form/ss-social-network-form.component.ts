import {MessageService} from 'primeng/api';

import {EventEmitter, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

import {SsCatalogueRepositoryService} from 'src/app/modules/ss-shared/services/ss-catalogues.repository-service';
import { SsLoaderService } from 'src/app/modules/ss-shared/services/ss-loader.service';

@Component({
  selector: 'ss-social-network-form',
  templateUrl: './ss-social-network-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsSocialNetworkFormComponent implements OnInit, OnDestroy {

  @Output()
  saveEvent: EventEmitter<void> = new EventEmitter<void>();

  public form!: FormGroup;

  @Input()
  public catalogue!: any;

  constructor(private _catalogueService: SsCatalogueRepositoryService,
              private _loaderService: SsLoaderService,
              private _toastService: MessageService,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
  }

  public saveForm(): Promise<any> {
    this._loaderService.show = true;

    this._mergeSocialNetworkValues();

    const catalogue = {
      id: this.catalogue.id,
      socialNetworks: this.catalogue.socialNetworks,
      updatedAt : Date.now()
    };

    return firstValueFrom(this._catalogueService.update(catalogue, this.catalogue.id))
      .then(() => {
        this._loaderService.show = false;

        this._toastService.add({
          severity: 'success',
          summary: 'Redes sociales guardadas',
          detail: 'Tu catálogo se editó correctamente',
          life: 6000
        });

        this.saveEvent.emit();
        this.initForm();
      }).catch((error: any) => {
        this._loaderService.show = false;

        this._toastService.add({
          severity: 'error',
          summary: 'Error editando redes sociales',
          detail: 'Ocurrio un error al guardar información',
          life: 6000
        });

        console.error(error);
      });
  }

  public getLogoIconName(className: string): string {
    let name = className.split('-')[1];

    return name;
  }

  private _mergeSocialNetworkValues(): void {
    Object.keys(this.form.controls).forEach(key => {
      for (let i = 0; i < this.catalogue?.socialNetworks?.length; i++) {
        if (this.catalogue.socialNetworks[i].name === key) {
          this.catalogue.socialNetworks[i].link = this.form.get(this.catalogue.socialNetworks[i].name)?.value;
        }
      }
    });
  }

  private initForm(): void {
    this.form = this._formBuilder.group({});

    for (let i = 0; i < this.catalogue?.socialNetworks?.length; i++) {
      this.form?.addControl(this.catalogue?.socialNetworks[i]?.name, this._formBuilder.control(this.catalogue?.socialNetworks[i]?.link, [Validators.min(8), Validators.max(30)]));
    }
  }
}
