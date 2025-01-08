import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RECURRENCY_DATE } from 'src/app/modules/shared/models/item.model';
import { getDayLabel } from 'src/app/modules/shared/utils/get-day-label.util';

@Component({
  selector: 'dates-form',
  templateUrl: './dates-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatesFormComponent implements OnInit {

  @Input()
  public form!: FormGroup;

  @Input()
  public item!: any;

  @Input()
  public userDataModel!: any;

  public recurrencyDates: any[] = RECURRENCY_DATE;
  public date: Date = new Date();

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    console.log(this.item);
    
    this._initForm();
  }

  public markAsTouched(): void {
    this.form.markAsTouched();
  }

  public getDayLabel(day: string): string {
    return getDayLabel(day)
  }

  get recurrenceDays(): FormArray {
    return this.form.get('recurrenceDays') as FormArray;
  }

  private _initForm(): void {
    const days = this.item?.dates?.recurrenceDays || [];
    const daysArray = this._formBuilder.array(
      days.map((date: any) =>
        this._formBuilder.group({
          day: date.day,
          active: date.active,
        })
      )
    );

    this.form.addControl('recurrenceType', this._formBuilder.control(this.item?.dates?.recurrenceType, [Validators.required]));
    this.form.addControl('startDate', this._formBuilder.control(this.item?.dates?.startDate, [Validators.required]));
    this.form.addControl('endDate', this._formBuilder.control(this.item?.dates?.endDate, [Validators.required]));
    this.form.addControl('startHour', this._formBuilder.control(this.item?.dates?.recurrenceDates, [Validators.required]));
    this.form.addControl('endHour', this._formBuilder.control(this.item?.dates?.recurrenceMonths, [Validators.required]));
    this.form.addControl('recurrenceDays', daysArray);
  }
}
