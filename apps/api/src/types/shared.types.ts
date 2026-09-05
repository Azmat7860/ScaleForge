export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Writable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type StringKeyOf<T> = Extract<keyof T, string>;

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
