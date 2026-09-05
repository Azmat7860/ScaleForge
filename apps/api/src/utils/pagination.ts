import { PaginatedResponse } from "../types/shared.types";

export const createPaginatedResponse = <T>(
  items: T[],
  page = 1,
  limit = items.length,
  total = items.length
): PaginatedResponse<T> => {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit))
  };
};
