/** API payloads should be arrays; proxies/errors often return objects or HTML. */
const NESTED_LIST_KEYS = ['items', 'data', 'value', 'results', '$values'];

function looksLikeEntity(value) {
  return value && typeof value === 'object' && ('id' in value || 'name' in value);
}

export function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null || typeof value === 'string') return [];

  if (typeof value === 'object') {
    for (const key of NESTED_LIST_KEYS) {
      if (Array.isArray(value[key])) return value[key];
    }

    const values = Object.values(value);
    if (values.length > 0 && values.every(looksLikeEntity)) {
      return values;
    }
  }

  return [];
}

/** Paginated business search: { items, totalCount, page, pageSize, totalPages } */
export function normalizeSearchResponse(data, fallbackPage = 1, pageSize = 12) {
  const items = ensureArray(data?.items ?? data);
  const totalCount = data?.totalCount ?? items.length;
  const page = data?.page ?? fallbackPage;
  const size = data?.pageSize ?? pageSize;
  const totalPages =
    data?.totalPages ?? Math.max(1, Math.ceil(totalCount / size) || 1);

  return { items, totalCount, page, pageSize: size, totalPages };
}
