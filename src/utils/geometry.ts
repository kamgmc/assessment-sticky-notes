import type { Point, Rect, Size } from '../types/geometry.ts'

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

// Converts viewport coordinates to coordinates relative to `bounds`, kept inside it.
export function toLocalPoint(client: { clientX: number; clientY: number }, bounds: DOMRect): Point {
  return {
    x: clamp(client.clientX - bounds.left, 0, bounds.width),
    y: clamp(client.clientY - bounds.top, 0, bounds.height),
  }
}

// Builds a rect from two corners, whichever direction the user dragged in.
export function rectFromPoints(a: Point, b: Point): Rect {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(b.x - a.x),
    height: Math.abs(b.y - a.y),
  }
}

// A rect of `size` centered on `center`, shifted as needed to stay inside `bounds`.
export function centeredRect(center: Point, size: Size, bounds: Size): Rect {
  return {
    x: clamp(center.x - size.width / 2, 0, Math.max(0, bounds.width - size.width)),
    y: clamp(center.y - size.height / 2, 0, Math.max(0, bounds.height - size.height)),
    ...size,
  }
}

export function isAtLeast(size: Size, min: Size): boolean {
  return size.width >= min.width && size.height >= min.height
}

// Positions with transform rather than top/left so moving an element skips layout.
export function toTransform({ x, y }: Point): string {
  return `translate(${x}px, ${y}px)`
}

export function toRectStyle(rect: Rect) {
  const { width, height } = rect
  return {
    transform: toTransform(rect),
    width: `${width}px`,
    height: `${height}px`,
  }
}

export function containsPoint(rect: DOMRect, { x, y }: Point): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}
