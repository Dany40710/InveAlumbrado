import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem({key = '', value = {}}: {key: string, value: any}) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string) {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

}
