import { WritableAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { SetStateAction } from 'react'

export type AtomWithDefaultType<T, U = T> = WritableAtom<T, [SetStateAction<U> | typeof RESET], void>
