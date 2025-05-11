
import { SyllabusItem } from "@/types/api";

export function fetchBoards(): Promise<SyllabusItem[]> {
  return Promise.resolve([{ id: '1', name: 'CBSE' }, { id: '2', name: 'ICSE' }]);
}

export function fetchClasses(): Promise<SyllabusItem[]> {
  return Promise.resolve([{ id: '1', name: 'Class 10' }, { id: '2', name: 'Class 12' }]);
}

export function fetchSubjects(): Promise<SyllabusItem[]> {
  return Promise.resolve([{ id: '1', name: 'Mathematics' }, { id: '2', name: 'Science' }]);
}

export function fetchChapters(): Promise<SyllabusItem[]> {
  return Promise.resolve([{ id: '1', name: 'Algebra' }, { id: '2', name: 'Geometry' }]);
}

export function fetchTopics(): Promise<SyllabusItem[]> {
  return Promise.resolve([{ id: '1', name: 'Quadratic Equations' }, { id: '2', name: 'Linear Equations' }]);
}
