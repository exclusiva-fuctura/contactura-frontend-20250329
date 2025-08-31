import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading = new BehaviorSubject<boolean>(false);

  constructor() { }

  setLoading(value: boolean) {
    this.loading.next(value);
  } 
}
