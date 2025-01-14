export type ThresholdItem<T> = {
  threshold: number
  value: T
}

export const binarySearchThreshold = <T>(
  items: ThresholdItem<T>[],
  searchValue: number
): T => {
  let left = 0
  let right = items.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (searchValue <= items[mid].threshold) {
      right = mid - 1
    } else {
      left = mid + 1
    }
  }

  if (left >= items.length) {
    return items[items.length - 1].value
  }

  return items[left].value
}
