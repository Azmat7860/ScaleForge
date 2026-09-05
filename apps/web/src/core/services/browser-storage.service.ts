import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BrowserStorageService {
  getItem<T>(key: string): T | null {
    try {
      const rawValue = localStorage.getItem(key);

      if (!rawValue) {
        return null;
      }

      try {
        return JSON.parse(rawValue) as T;
      } catch {
        return rawValue as T;
      }
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      return;
    }
  }
}
