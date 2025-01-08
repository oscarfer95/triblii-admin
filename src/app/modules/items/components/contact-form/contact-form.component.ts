import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent implements OnInit {

  @Input()
  public form!: FormGroup;

  @Input()
  public item!: any;

  @Input()
  public userDataModel!: any;

  public types: any[] = [{ label: 'Teléfono', value: 'PHONE' }, { label: 'Link', value: 'LINK' }];
  public phoneOptions: any[] = [
    { logoClass: 'pi-phone', label: 'Teléfono' },
    { logoClass: 'pi-whatsapp', label: 'WhatsApp' },
    { logoClass: 'pi-telegram', label: 'Telegram' }
  ];
  public linkOptions: any[] = [
    { logoClass: 'pi-link', label: 'Página web' },
    { logoClass: 'pi-facebook', label: 'Facebook' },
    { logoClass: 'pi-instagram', label: 'Instagram' },
    { logoClass: 'pi-twitter', label: 'Twitter/X' },
    { logoClass: 'pi-linkedin', label: 'LinkedIn' }
  ];

  public itemList: any[] = [];

  public contactForm!: FormGroup;
  public SearchCountryField = SearchCountryField;
  public CountryISO = CountryISO;

  constructor(private _formBuilder: FormBuilder) {
    this.contactForm = new FormGroup({});
  }

  ngOnInit() {
    this.itemList = this.item.contact?.rrss;
    this._initForm();
    this._initContactForm();
  }

  public markAsTouched(): void {
    this.form.markAsTouched();
  }

  public saveItemList(): void {
    this.itemList.push(this.contactForm.value);
    this.form.get('rrss').setValue(this.itemList);

    setTimeout(() => {
      this.contactForm.get('available').setValue(true);
      this.contactForm.get('type').setValue('PHONE');
      this.contactForm.get('logoClass').setValue('pi-phone');
      this.contactForm.get('phone').setValue(null);
      this.contactForm.get('url').setValue('');
    }, 100);
  }

  public deleteItemList(index: number) {
    this.itemList.splice(index, 1);
    this.form.get('rrss').setValue(this.itemList);
  }

  public changeOptions(event: any) {
    setTimeout(() => {
      if (event.value === 'PHONE') {
        this.contactForm.get('logoClass').setValue('pi-phone');
        this.contactForm.get('url').setValue('');
      } else {
        this.contactForm.get('logoClass').setValue('pi-link');
        this.contactForm.get('phone').setValue(null);
      }
    }, 100);
  }

  private _initForm(): void {
    this.form.addControl('available', this._formBuilder.control(this.item.contact?.available || false));
    this.form.addControl('rrss', this._formBuilder.control(this.item.contact?.rrss || []));
  }

  private _initContactForm(): void {
    this.contactForm.addControl('available', this._formBuilder.control(true, Validators.required));
    this.contactForm.addControl('type', this._formBuilder.control('PHONE', Validators.required));
    this.contactForm.addControl('logoClass', this._formBuilder.control('pi-phone', Validators.required));
    this.contactForm.addControl('phone', this._formBuilder.control(null));
    this.contactForm.addControl('url', this._formBuilder.control(''));
  }
}
