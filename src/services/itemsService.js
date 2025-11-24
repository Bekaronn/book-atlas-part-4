const BASE = 'https://openlibrary.org'

// Поиск книг
export async function searchItems(q = 'the', page = 1, limit = 20) {
  const url = new URL('/search.json', BASE)
  url.searchParams.set('q', q || 'the')
  url.searchParams.set('page', page)
  url.searchParams.set('limit', limit)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)

  const data = await res.json()

  return {
    numFound: data.numFound ?? 0,
    docs: data.docs.map((d) => ({
      id:
        d.key?.replace('/works/', '') ||
        d.cover_edition_key ||
        d.edition_key?.[0] ||
        d.key,

      title: d.title,
      author_name: d.author_name?.join(', ') ?? '',
      first_publish_year: d.first_publish_year,
      cover_i: d.cover_i,
      short_desc:
        (d.subject ? d.subject.slice(0, 5).join(', ') : null) ||
        d.subtitle ||
        '',
      raw: d,
    })),
  }
}

// Получить автора по ключу
async function getAuthor(authorKey) {
  if (!authorKey) return null

  try {
    const res = await fetch(`${BASE}/authors/${authorKey}.json`)
    if (!res.ok) return null

    const data = await res.json()
    return {
      key: authorKey,
      name: data.name,
      birth_date: data.birth_date,
      death_date: data.death_date,
      photos: data.photos ?? [],
    }
  } catch {
    return null
  }
}

// Получить книгу по ID
export async function getItemById(id) {
  if (!id) throw new Error('Missing id')

  const res = await fetch(`${BASE}/works/${id}.json`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Get item failed: ${res.status}`)

  const data = await res.json()

  // Загружаем авторов параллельно
  const authors = await Promise.all(
    (data.authors ?? []).map((a) =>
      getAuthor(a.author?.key?.replace('/authors/', ''))
    )
  )

  return {
    id: data.key?.replace('/works/', '') ?? id,
    title: data.title,
    description:
      typeof data.description === 'string'
        ? data.description
        : data.description?.value ?? '',
    subjects: data.subjects ?? [],
    covers: data.covers ?? [],
    links: data.links ?? [],
    authors: authors.filter(Boolean),
    subject_places: data.subject_places ?? [],
    subject_people: data.subject_people ?? [],
    subject_times: data.subject_times ?? [],
    first_publish_date:
      data.first_publish_date ||
      data.first_publish_year ||
      '—',
    created: data.created,
    last_modified: data.last_modified,
    raw: data,
  }
}