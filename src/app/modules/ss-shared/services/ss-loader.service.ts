import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SsLoaderService {

  public show: boolean;

  constructor() {
    this.show = false;
  }
}
