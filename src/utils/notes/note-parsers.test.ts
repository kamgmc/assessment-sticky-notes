import { describe, expect, it } from 'vitest'
import type { Note } from '../../types/note.ts'
import { parseNote, parseNotes } from './note-parsers.ts'

const validNote: Note = {
  id: 'a',
  x: 10,
  y: 20,
  width: 200,
  height: 160,
  text: 'Hello',
  color: 'pink',
  zIndex: 3,
}

describe('parseNote', () => {
  it('accepts a valid note', () => {
    expect(parseNote(validNote)).toEqual(validNote)
  })

  it('drops fields that are not part of a note', () => {
    expect(parseNote({ ...validNote, extra: true })).toEqual(validNote)
  })

  it.each([
    ['null', null],
    ['a string', 'note'],
    ['an array', []],
  ])('rejects %s', (_label, value) => {
    expect(parseNote(value)).toBeNull()
  })

  it('rejects a note with a missing field', () => {
    const { text: _text, ...withoutText } = validNote
    expect(parseNote(withoutText)).toBeNull()
  })

  it.each([
    ['a numeric id', { id: 1 }],
    ['a string coordinate', { x: '10' }],
    ['an infinite coordinate', { y: Infinity }],
    ['NaN', { zIndex: Number.NaN }],
    ['a zero width', { width: 0 }],
    ['a negative height', { height: -5 }],
    ['non-string text', { text: 42 }],
    ['an unknown color', { color: 'red' }],
  ])('rejects %s', (_label, override) => {
    expect(parseNote({ ...validNote, ...override })).toBeNull()
  })
})

describe('parseNotes', () => {
  it('rejects values that are not arrays', () => {
    expect(parseNotes({ a: validNote })).toBeNull()
    expect(parseNotes('[]')).toBeNull()
  })

  it('keys the notes by id', () => {
    const other = { ...validNote, id: 'b' }
    expect(parseNotes([validNote, other])).toEqual({ a: validNote, b: other })
  })

  it('drops invalid entries and keeps the rest', () => {
    expect(parseNotes([validNote, { ...validNote, id: 'b', color: 'red' }, null])).toEqual({
      a: validNote,
    })
  })
})
