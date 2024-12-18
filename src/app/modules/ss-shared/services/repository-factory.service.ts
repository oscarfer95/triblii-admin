import { Injectable } from "@angular/core";
import { AttractionsRepositoryService } from "./attractions.repository-service";
import { EventsRepositoryService } from "./events.repository-service";
import { FoodsRepositoryService } from "./foods.repository-service";
import { HotelsRepositoryService } from "./hotels.repository-service";
import { RestaurantsRepositoryService } from "./restaurants.repository-service";
import { Repository } from "src/framework/repository/repository";

@Injectable({ providedIn: 'root' })
export class RepositoryFactoryService {
  constructor(private _attractionsRepositoryService: AttractionsRepositoryService,
              private _restaurantsRepositoryService: RestaurantsRepositoryService,
              private _hotelsRepositoryService: HotelsRepositoryService,
              private _foodsRepositoryService: FoodsRepositoryService,
              private _eventsRepositoryService: EventsRepositoryService
  ) {}

  public getServiceById(type: string): Repository<any> {
    let service: any;

    switch (type) {
      case 'attractions':
        service = this._attractionsRepositoryService;
        break;
      case 'restaurants':
        service = this._restaurantsRepositoryService;
        break;

      case 'hotels':
        service = this._hotelsRepositoryService;
        break;

      case 'foods':
        service = this._foodsRepositoryService;
        break;

      case 'events':
        service = this._eventsRepositoryService;
        break;
    }

    return service;
  }
}
