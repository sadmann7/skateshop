// @see https://gist.github.com/rphlmr/0d1722a794ed5a16da0fdf6652902b15

export function takeFirst<T>(items: T[]) {
  return items.at(0)
}

export function takeFirstOrThrow<T>(items: T[]) {
  const first = takeFirst(items)

  if (!first) {
    throw new Error("First item not found")
  }

  return first
}
