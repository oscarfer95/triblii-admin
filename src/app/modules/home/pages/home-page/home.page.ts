import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { MODULES_LIST } from 'src/app/modules/shared/constants/modules.constant';
import { Item } from 'src/app/modules/shared/models/item.model';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';
import { RepositoryFactoryService } from 'src/app/modules/shared/services/repository-factory.service';
import { getSingularActionLabel, getSingularModuleLabel } from 'src/app/modules/shared/utils/get-label-text.util';
import { generateMenuItems } from 'src/app/modules/shared/utils/get-side-bar-options.utils';
import { getLogsByAction, getLogsByMonth } from 'src/app/modules/shared/utils/get-stadistics.utils';
import { ConfigList } from 'src/framework/repository/config-list.model';
import { SwiperOptions } from 'swiper';
import * as XLSX from 'xlsx';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChild('inputFile')
  public inputFile: ElementRef<HTMLInputElement>;

  public userDataModel!: UserDataModel | any;
  public interactionData!: any;
  public logByActionData!: any;
  public uploadModuleFiles!: string;
  public menuItems: any = null;
  public logList: any[] | null;
  public items: MenuItem[];
  public swiperConfig: SwiperOptions;

  private _unsubscribe: Subject<void>;

  constructor(private _logsRepositoryService: LogsRepositoryService,
    private _repositoryService: RepositoryFactoryService,
    private _userDataModelService: UserDataModelService,
    private _loaderService: LoaderService,
    private _toastService: MessageService,
    private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this.interactionData = null;
    this.logByActionData = null;
    this.swiperConfig = {
      slidesPerView: 1,
      navigation: false,
      scrollbar: { draggable: true },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      pagination: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: true
      }
    };

    this.items = [
      {
        label: 'Subir archivo',
        icon: 'pi pi-fw pi-upload',
        items: [
          {
            label: 'Módulos'
          },
          {
            separator: true
          },
          {
            label: 'Lugares',
            icon: 'pi pi-map-marker',
            command: () => {
              this.inputFile.nativeElement.click();
              this.uploadModuleFiles = 'attractions';
            }
          },
          {
            label: 'Restaurantes',
            icon: 'bi bi-shop',
            command: () => {
              this.inputFile.nativeElement.click();
              this.uploadModuleFiles = 'restaurants';
            }
          },
          {
            label: 'Comidas',
            icon: 'bi bi-cup-straw',
            command: () => {
              this.inputFile.nativeElement.click();
              this.uploadModuleFiles = 'foods';
            }
          },
          {
            label: 'Hoteles',
            icon: 'pi pi-building',
            command: () => {
              this.inputFile.nativeElement.click();
              this.uploadModuleFiles = 'hotels';
            }
          },
          {
            label: 'Eventos',
            icon: 'pi pi-calendar',
            command: () => {
              this.inputFile.nativeElement.click();
              this.uploadModuleFiles = 'events';
            }
          }
        ]
      },
      {
        label: 'Descargar',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Plantillas'
          },
          {
            separator: true
          },
          {
            label: 'Lugares',
            icon: 'pi pi-map-marker',
            command: () => {
              this.uploadModuleFiles = 'attractions';
              this._downloadTemplate();
            }
          },
          {
            label: 'Restaurantes',
            icon: 'bi bi-shop',
            command: () => {
              this.uploadModuleFiles = 'restaurants';
              this._downloadTemplate();
            }
          },
          {
            label: 'Comidas',
            icon: 'bi bi-cup-straw',
            command: () => {
              this.uploadModuleFiles = 'foods';
              this._downloadTemplate();
            }
          },
          {
            label: 'Hoteles',
            icon: 'pi pi-building',
            command: () => {
              this.uploadModuleFiles = 'hotels';
              this._downloadTemplate();
            }
          },
          {
            label: 'Eventos',
            icon: 'pi pi-calendar',
            command: () => {
              this.uploadModuleFiles = 'events';
              this._downloadTemplate();
            }
          }
        ]
      },
      {
        separator: true
      },
      {
        label: 'Información',
        icon: 'pi pi-info-circle',
        command: () => { }
      }
      // {
      //   label: 'Descargar BD',
      //   icon: 'pi pi-download',
      //   command: () => { }
      // }
    ];

    this._userDataModelListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public toDDMMAAAA(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  public getHour(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  public getActionLabel(action: string): string {
    return getSingularActionLabel(action);
  }

  public getModuleLabel(action: string): string {
    return getSingularModuleLabel(action);
  }

  public onSelectFiles(event: any): void {
    const fileInput = event.target;
    const file = event.target.files[0];
    if (!file) { return; }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (!e.target.result) { return; }

      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const customProps = workbook.Custprops;

      if (!customProps || Object.keys(customProps).length === 0) {
        this._showErrorMessage('No tiene propiedades personalizadas válidas, descarga la plantilla e intenta nuevamente.');
        return;
      }

      const templateID = customProps['templateID'];
      const userId = customProps['userId'];
      const genDate = customProps['genDate'];

      if (templateID !== 'TRIBLII-TEMPLATE') {
        this._showErrorMessage('El archivo NO corresponde a una plantilla oficial, descarga la plantilla e intenta nuevamente.');
        return;
      }

      if (userId !== this.userDataModel.id) {
        this._showErrorMessage('El archivo NO corresponde a una plantilla generada por tí, descarga la plantilla e intenta nuevamente.');
        return;
      }

      if (new Date(genDate) >= new Date()) {
        this._showErrorMessage('La fecha de generación del archivo es inválida, descarga una nueva plantilla e intenta nuevamente.');
        return;
      }

      this._uploadItemsFromFile(workbook);
      fileInput.value = '';
    };

    reader.onerror = (err) => {
      console.error('Error al leer el archivo:', err);
    };

    reader.readAsArrayBuffer(file);
  }

  private _showErrorMessage(text: string) {
    this._toastService.add({
      severity: 'error',
      summary: 'Archivo inválido',
      detail: text,
      life: 6000
    });
  }

  private async _uploadItemsFromFile(workbook: any) {
    try {
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) {
        throw new Error('No se pudo obtener la hoja del archivo Excel.');
      }

      const item: any = Item.createInstance(this.uploadModuleFiles);
      item.location.state = this.userDataModel.entity.location.stateIds[0] || '';
      item.location.city = this.userDataModel.entity.location.cityIds[0] || '';
      item.location.country = this.userDataModel.entity.location.countryIds[0] || '';
      item.entitiesId = this.userDataModel.role !== 'SUPERADMIN'? [this.userDataModel.entity.id, 'triblii-app']: ['triblii-app'];

      const objects = this._parseExcelToObjects(sheet, item);
      this._saveItems(objects);
    } catch (error) {
      console.error('Error al procesar el archivo Excel:', error);
      this._showErrorMessage('Ocurrió un error al procesar el archivo. Intenta nuevamente.');
    }
  }

  private _saveItems(objects: any[]) {
    if (objects.length > 0) {
      this._loaderService.show = true;
      const service: any = this._repositoryService.getServiceById(this.uploadModuleFiles);

      service.createMany(objects)
          .then(() => {
              this._toastService.add({
                  severity: 'success',
                  summary: 'Importación exitosa',
                  detail: 'Se guardaron correctamente los elementos del archivo.',
                  life: 3000
              });
              this._loaderService.show = false;
          })
          .catch((error: any) => {
              console.error('Error al guardar los items:', error);

              this._toastService.add({
                  severity: 'error',
                  summary: 'Error en la importación',
                  detail: 'Ocurrió un error al intentar importar los items. Por favor, inténtalo nuevamente.',
                  life: 3000
              });
              this._loaderService.show = false;
          });
    } else {
      this._showErrorMessage('No hay elementos que subir.');
    }
  }

  private _generateTemplateFile(): XLSX.WorkBook {
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: 'Oficial template',
      Author: this.userDataModel.name,
      Company: 'TRIBLII'
    };

    wb.Custprops = {
      'templateID': 'TRIBLII-TEMPLATE',
      'userId': this.userDataModel.id,
      'genDate': new Date(),
    };

    let item = Item.createInstance(this.uploadModuleFiles);
    let options = this._getItemOptions();
    const dataSheetData = this._generateColumns(item, options);
    const dataSheet = XLSX.utils.aoa_to_sheet(dataSheetData);
    XLSX.utils.book_append_sheet(wb, dataSheet, 'Data');

    return wb;
  }

  private _getItemOptions() {
    return {
      exclude: ['contact', 'coverUrl', 'schedule', 'isFeatured', 'order', 'location', 'foods', 'entitiesId', 'content', 'categories', 'tags', 'rating', 'gallery', 'dates', 'available']
    };
  }

  private _downloadTemplate(): void {
    const workbook = this._generateTemplateFile();
    XLSX.writeFile(workbook, 'triblii-template-' + this.uploadModuleFiles + '.xlsx');
  }

  private _generateColumns(obj: any, options: any = {}) {
    const columns: string[] = [];

    this._flatten(obj, '', columns, options);

    return [columns];
  }

  private _flatten(obj: any, parentKey: string, columns: string[], options: any): void {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (options.exclude && options.exclude.some(k => newKey.startsWith(k))) {
          continue;
        }

        if (Array.isArray(obj[key])) {
          this._handleArray(obj[key], newKey, columns, options);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          this._flatten(obj[key], newKey, columns, options);
        } else {
          columns.push(newKey);
        }
      }
    }
  }

  private _handleArray(array: any[], parentKey: string, columns: string[], options: any): void {
    if (array.length === 0) {
      columns.push(parentKey);
    } else if (typeof array[0] === 'object') {
      array.forEach((item: any, index: number) => {
        this._flatten(item, `${parentKey}[${index}]`, columns, options);
      });
    } else {
      columns.push(parentKey);
    }
  }

  private _filterList(list: any, idList: any[]) {
    return list.filter((menuItem: any) =>
      idList.some(module => module.id === menuItem.id)
    );
  }

  private async _getLogs(): Promise<void> {
    try {
      const configList: ConfigList = this._getConfigList();

      let logs: any = await firstValueFrom(this._logsRepositoryService.getByQuerys(configList));
      this._getLogsByMonth(logs);
      this._getLogsByAction(logs);

      this.logList = logs.length > 4 ? logs.slice(0, 5) : logs;
    } catch (error) {
      console.error('Error al obtener los logs:', error);
    } finally {
      this._cdr.markForCheck();
    }
  }

  private _getConfigList() {
    const configList: ConfigList = {
      orderByConfigList: [
        {
          field: 'date',
          direction: 'desc'
        }
      ],
      queryList: [
        {
          field: 'userId',
          operation: '==',
          value: this.userDataModel.id
        }
      ]
    };

    return configList;
  }

  private _parseExcelToObjects(sheet: XLSX.WorkSheet, template: Item): Item[] {
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (rows.length < 1) {
      throw new Error('El archivo Excel no contiene encabezados.');
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    return dataRows.map(row => {
      const obj: Item = { ...template };

      headers.forEach((header: string, index: number) => {
        if (obj.hasOwnProperty(header)) {
          obj[header] = row[index] = row[index];
        }
      });

      return obj;
    });
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel.accountId) {
          this.userDataModel = userDataModel;
          this._getLogs();
          this.menuItems = this._filterList(generateMenuItems(this.userDataModel.permissions, this.userDataModel.role), MODULES_LIST);

          this._cdr.markForCheck();
        }
      });
  }

  private _getLogsByMonth(logs: any[]): any {
    this.interactionData = getLogsByMonth(logs);
  }

  private _getLogsByAction(logs: any[]): any {
    this.logByActionData = getLogsByAction(logs);
  }
}
