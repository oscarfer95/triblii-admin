import {Component, OnInit} from '@angular/core';

import {LoaderService} from '../../services/loader.service';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html'
})
export class LoaderComponent implements OnInit {

  constructor(public loaderService: LoaderService) {
  }

  ngOnInit(): void {
  }
}
