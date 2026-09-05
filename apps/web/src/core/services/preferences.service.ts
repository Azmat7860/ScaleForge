import { DOCUMENT } from "@angular/common";
import { computed, inject, Injectable, signal } from "@angular/core";
import { BrowserStorageService } from "./browser-storage.service";

export type AppPreferences = {
  emailNotifications: boolean;
  weeklyDigest: boolean;
  compactLayout: boolean;
  analyticsPins: boolean;
};

const PREFERENCES_KEY = "scaleforge_preferences";

const defaultPreferences: AppPreferences = {
  emailNotifications: true,
  weeklyDigest: false,
  compactLayout: false,
  analyticsPins: true
};

@Injectable({
  providedIn: "root"
})
export class PreferencesService {
  private readonly storage = inject(BrowserStorageService);
  private readonly document = inject(DOCUMENT);

  readonly preferences = signal<AppPreferences>(defaultPreferences);
  readonly compactLayout = computed(() => this.preferences().compactLayout);
  readonly analyticsPins = computed(() => this.preferences().analyticsPins);

  constructor() {
    const storedPreferences =
      this.storage.getItem<AppPreferences>(PREFERENCES_KEY);

    if (storedPreferences) {
      this.preferences.set({
        ...defaultPreferences,
        ...storedPreferences
      });
    }

    this.applyBodyClasses();
  }

  update(partial: Partial<AppPreferences>): void {
    this.preferences.update((current) => ({
      ...current,
      ...partial
    }));

    this.storage.setItem(PREFERENCES_KEY, this.preferences());
    this.applyBodyClasses();
  }

  save(): void {
    this.storage.setItem(PREFERENCES_KEY, this.preferences());
    this.applyBodyClasses();
  }

  private applyBodyClasses(): void {
    const body = this.document.body;
    const prefs = this.preferences();

    body.classList.toggle("compact-layout", prefs.compactLayout);
    body.classList.toggle("analytics-pinned", prefs.analyticsPins);
  }
}
