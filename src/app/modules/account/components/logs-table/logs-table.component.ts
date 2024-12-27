import { Table } from 'primeng/table';

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'logs-table',
  templateUrl: './logs-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsTableComponent implements OnInit {

  @Input()
  public logList!: any[];


  @ViewChild('dt')
  public table!: Table;

  constructor() {
  }

  public ngOnInit(): void {
  }

  public applyFilterGlobal(event: any, stringVal: string): void {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  public toDate(timestamp: { seconds: number, nanoseconds: number }): any {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString('en-US', {
      month: 'short',   // Mes abreviado (e.g., Dec)
      day: '2-digit',   // Día con dos dígitos (e.g., 27)
      year: 'numeric',  // Año completo (e.g., 2024)
      hour: '2-digit',  // Hora en formato 24 horas (sin AM/PM)
      minute: '2-digit', // Minutos con dos dígitos
      second: '2-digit', // Segundos con dos dígitos
      hour12: false      // Formato de 24 horas
    }).replace(',', ''); // Elimina la coma después del día
  }
}
