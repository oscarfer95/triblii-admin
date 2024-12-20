import {EventEmitter, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent implements OnInit, OnDestroy {

  @Output()
  hideEvent: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  public productList!: any;

  @Input()
  public customColor: any;
  
  public isValidHex: boolean = true;

  constructor() {
    this.customColor = '#FFFFFF';
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public getColor():void {
    this.hideEvent.emit(this.customColor);
  }

  public validateHexColor(color: string): void {
    const hexPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    this.isValidHex = hexPattern.test(color);
    if (this.isValidHex) {
      this.customColor = color;
      this.getColor();
    }
  }
}
