import { Injectable, signal } from "@angular/core";

export type ToastTone = "success" | "error" | "info";

export type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

@Injectable({
  providedIn: "root"
})
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);
  private nextId = 1;

  success(message: string): void {
    this.push(message, "success");
  }

  error(message: string): void {
    this.push(message, "error");
  }

  info(message: string): void {
    this.push(message, "info");
  }

  remove(id: number): void {
    this.toasts.update((items) => items.filter((item) => item.id !== id));
  }

  private push(message: string, tone: ToastTone): void {
    const id = this.nextId++;
    const toast: ToastItem = { id, message, tone };

    this.toasts.update((items) => [...items, toast]);

    setTimeout(() => this.remove(id), 3200);
  }
}
