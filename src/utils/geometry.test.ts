import { describe, expect, it } from 'vitest'
import { TRASH_OVERLAP_RATIO } from '../constants.ts'
import type { Rect } from '../types/geometry.ts'
import {
  area,
  centeredRect,
  clamp,
  containsPoint,
  intersectionArea,
  isOverTrash,
  rectFromPoints,
} from './geometry.ts'

describe('clamp', () => {
  it('keeps values inside the range', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(15, 0, 10)).toBe(10)
  })
})

describe('rectFromPoints', () => {
  it('builds the same rect whichever direction the user dragged in', () => {
    const expected = { x: 10, y: 20, width: 30, height: 40 }
    expect(rectFromPoints({ x: 10, y: 20 }, { x: 40, y: 60 })).toEqual(expected)
    expect(rectFromPoints({ x: 40, y: 60 }, { x: 10, y: 20 })).toEqual(expected)
  })
})

describe('centeredRect', () => {
  const size = { width: 100, height: 50 }
  const bounds = { width: 500, height: 400 }

  it('centers the rect on the point', () => {
    expect(centeredRect({ x: 250, y: 200 }, size, bounds)).toEqual({ x: 200, y: 175, ...size })
  })

  it('shifts the rect to stay inside the bounds', () => {
    expect(centeredRect({ x: 0, y: 0 }, size, bounds)).toEqual({ x: 0, y: 0, ...size })
    expect(centeredRect({ x: 500, y: 400 }, size, bounds)).toEqual({ x: 400, y: 350, ...size })
  })
})

describe('containsPoint', () => {
  const rect = { x: 10, y: 10, width: 20, height: 20 }

  it('includes points inside and on the edges', () => {
    expect(containsPoint(rect, { x: 20, y: 20 })).toBe(true)
    expect(containsPoint(rect, { x: 10, y: 30 })).toBe(true)
  })

  it('excludes points outside', () => {
    expect(containsPoint(rect, { x: 9, y: 20 })).toBe(false)
    expect(containsPoint(rect, { x: 20, y: 31 })).toBe(false)
  })
})

describe('intersectionArea', () => {
  const a = { x: 0, y: 0, width: 100, height: 100 }

  it('returns the shared area of overlapping rects', () => {
    expect(intersectionArea(a, { x: 50, y: 50, width: 100, height: 100 })).toBe(2500)
  })

  it('returns the smaller area when one rect contains the other', () => {
    const inner = { x: 10, y: 10, width: 20, height: 30 }
    expect(intersectionArea(a, inner)).toBe(area(inner))
  })

  it('returns 0 for rects that only touch or are apart', () => {
    expect(intersectionArea(a, { x: 100, y: 0, width: 50, height: 50 })).toBe(0)
    expect(intersectionArea(a, { x: 200, y: 200, width: 50, height: 50 })).toBe(0)
  })
})

describe('isOverTrash', () => {
  const trash: Rect = { x: 0, y: 0, width: 100, height: 100 }
  const pointerOutside = { x: 1000, y: 1000 }

  it('is true when the pointer is inside the trash, even without overlap', () => {
    const farNote = { x: 500, y: 500, width: 100, height: 100 }
    expect(isOverTrash(farNote, { x: 50, y: 50 }, trash)).toBe(true)
  })

  it('is true when the note covers exactly the threshold share of the trash', () => {
    const x = trash.width * (1 - TRASH_OVERLAP_RATIO)
    expect(isOverTrash({ x, y: 0, width: 100, height: 100 }, pointerOutside, trash)).toBe(true)
  })

  it('is false when the note covers just under the threshold', () => {
    const x = trash.width * (1 - TRASH_OVERLAP_RATIO) + 1
    expect(isOverTrash({ x, y: 0, width: 100, height: 100 }, pointerOutside, trash)).toBe(false)
  })

  it('measures small notes against their own area, not the trash', () => {
    // The whole note sits inside the trash but covers far less than half of it.
    const smallNote = { x: 10, y: 10, width: 20, height: 20 }
    expect(isOverTrash(smallNote, pointerOutside, trash)).toBe(true)
  })

  it('is false when nothing overlaps and the pointer is outside', () => {
    expect(isOverTrash({ x: 300, y: 300, width: 50, height: 50 }, pointerOutside, trash)).toBe(false)
  })
})
