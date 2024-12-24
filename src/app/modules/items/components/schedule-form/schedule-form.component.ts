import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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

  public isLoading: boolean = true;

  constructor(private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef) {
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
          day: [day.day],
          open: [day.open],
          close: [day.close],
        })
      )
    );

    this.form.addControl('available', this._formBuilder.control(this.item.schedule?.available || false));
    this.form.addControl('days', daysArray);
  }

  get days(): FormArray {
    return this.form.get('days') as FormArray;
  }
}
