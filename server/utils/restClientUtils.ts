export default function idempotencyKey(group: string, key: string): Record<string, string> {
  return { 'Idempotency-Key': `${group}:${key}` }
}
