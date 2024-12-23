import {Component, OnInit} from '@angular/core';

import {LoaderService} from '../../services/loader.service';

@Component({
  selector: 'ss-loader',
  templateUrl: './ss-loader.component.html'
})
export class SsLoaderComponent implements OnInit {

  constructor(public loaderService: LoaderService) {
  }

  ngOnInit(): void {
  }
}
