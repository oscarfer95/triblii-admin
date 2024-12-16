import {Observable} from 'rxjs';

export default interface CanDeactivateComponent {
  canDeactivate: () => boolean | Observable<boolean>;
}
