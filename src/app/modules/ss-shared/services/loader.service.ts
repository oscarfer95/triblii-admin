import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public show: boolean;

  constructor() {
    this.show = false;
  }
}
