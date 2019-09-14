import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  flag: boolean = false;
  no: number = undefined;

  constructor() {
    (typeof localStorage != undefined) ? this.flag = true : this.flag = false;
    if (!this.flag) throw new Error("Please enable local storage.");
  }

  writeData(key, data) {
    if (this.flag) {
      this.no = data.no;
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  readData(key) {
    if (this.flag) {
      let item = undefined;
      if (localStorage.getItem(key)) item = localStorage.getItem(key);
      // debugger;
      if (item) this.no = JSON.parse(item).no || 1;
      return item;
    }
  }

  deleteData(key) {
    if (this.flag) localStorage.removeItem(key);
  }

  clearData() {
    if (this.flag) localStorage.clear();
  }
}
