import {Component, OnInit} from '@angular/core';

import {SsLoaderService} from '../../services/ss-loader.service';

@Component({
  selector: 'ss-loader',
  templateUrl: './ss-loader.component.html'
})
export class SsLoaderComponent implements OnInit {

  constructor(public loaderService: SsLoaderService) {
  }

  ngOnInit(): void {
  }
}
