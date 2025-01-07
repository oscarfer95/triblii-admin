import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getDayLabel } from 'src/app/modules/shared/utils/get-day-label.util';

@Component({
  selector: 'schedule-form',
  templateUrl: './schedule-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleFormComponent implements OnInit {

  @Input()
  public form!: FormGroup;

  @Input()
  public item!: any;

  @Input()
  public userDataModel!: any;

  private _defaultOpenTime = new Date().setHours(8, 30, 0, 0);

  private _defaultCloseTime = new Date().setHours(20, 30, 0, 0);

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this._initForm();
  }

  public markAsTouched(): void {
    this.form.markAsTouched();
  }

  public getDayLabel(day: string): string {
    return getDayLabel(day)
  }

  private _initForm(): void {
    const days = this.item.schedule?.days || [];
    const daysArray = this._formBuilder.array(
      days.map((day: any) =>
        this._formBuilder.group({
          day: [day.day || '', Validators.required],
          open: [new Date(day.open?.seconds * 1000 || this._defaultOpenTime), Validators.required],
          close: [new Date(day.close?.seconds * 1000 || this._defaultCloseTime), Validators.required],
        })
      )
    );

    this.form.addControl('available', this._formBuilder.control(this.item.schedule?.available || false));
    this.form.addControl('alwaysOpen', this._formBuilder.control(this.item.schedule?.alwaysOpen || false));
    this.form.addControl('days', daysArray);
  }

  get days(): FormArray {
    return this.form.get('days') as FormArray;
  }
}
