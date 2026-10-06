import postgres from 'postgres'

let client: ReturnType<typeof postgres> | undefined

export function useDatabase() {
  const { databaseUrl: configuredUrl } = useRuntimeConfig()
  const databaseUrl = configuredUrl || process.env.DATABASE_URL
  if (!databaseUrl) {
    throw createError({ statusCode: 503, statusMessage: 'Database is not configured' })
  }

  client ??= postgres(databaseUrl, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  })

  return client
}
