import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HOTEL_SERVICES } from 'src/app/modules/shared/constants/hotel-services.constant';

@Component({
  selector: 'services-form',
  templateUrl: './services-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesFormComponent implements OnInit {

  @Input()
  public form!: FormGroup;

  @Input()
  public item!: any;

  @Input()
  public userDataModel!: any;

  public services: any[] = HOTEL_SERVICES;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this._initForm();
  }

  public markAsTouched(): void {
    this.form.markAsTouched();
  }

  public removeItem(item: any) {
    const selectedServices = this.form.get('services')?.value || [];
    const updatedServices = selectedServices.filter((service: string) => service !== item);
    this.form.get('services')?.setValue(updatedServices);
  }

  public getService(id: string) {
    return HOTEL_SERVICES.find(service => service.id === id) || null;
  }

  private _initForm(): void {
    this.form.addControl('services', this._formBuilder.control(this.item.services || []));
  }
}
