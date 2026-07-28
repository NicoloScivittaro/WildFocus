export function isHoneypotFilled(honeypotValue: string): boolean {
  return honeypotValue.trim().length > 0
}

export function hasElapsedMinimumTime(renderedAt: number, submittedAt: number, minMs = 3000): boolean {
  return submittedAt - renderedAt >= minMs
}

export function sanitizeInput(value: string): string {
  return value.trim().replace(/<[^>]*>/g, '')
}
