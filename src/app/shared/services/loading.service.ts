import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private isLoading = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoading.asObservable();

    toggleLoading(value: boolean) {
        this.isLoading.next(value);
    }
}
