import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[DropZone]'
})
export class DropZoneDirective {
  @Output()
  public dropped: EventEmitter<FileList>;

  @Output()
  public dragging: EventEmitter<boolean>;

  constructor() {
    this.dragging = new EventEmitter<boolean>();
    this.dropped = new EventEmitter<FileList>();
  }

  @HostListener('dragover', ['$event'])
  public onDragOver($event: any): void {
    $event.preventDefault();

    this.dragging.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave($event: any): void {
    $event.preventDefault();

    this.dragging.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop($event: any): void {
    $event.preventDefault();

    this.dropped.emit($event.dataTransfer.files);
    this.dragging.emit(false);
  }
}
