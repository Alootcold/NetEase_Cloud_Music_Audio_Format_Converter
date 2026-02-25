export type Status = 'pending' | 'processing' | 'done' | 'error'

export interface Item {
  file: string
  status: Status
}

export type SaveTo = 'original' | 'custom'
