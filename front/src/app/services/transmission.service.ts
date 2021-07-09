import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class TransmissionService {

  // Observable string sources
  private dataSource = new Subject<String>();

  // Observable string streams
  dataStream = this.dataSource.asObservable();

  // Service message commands
  dataTransmission(username: String) {
    this.dataSource.next(username);
  }


  // Observable string sources
  private filterSource = new Subject<String>();

  // Observable string streams
  filterStream = this.filterSource.asObservable();

  // Service message commands
  filterTransmission(filterinput: String) {
    this.filterSource.next(filterinput);
  }
}