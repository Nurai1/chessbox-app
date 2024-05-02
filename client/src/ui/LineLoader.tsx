import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

export const LineLoader: FC<{ classes?: string }> = ({ classes }) => (
	<div className={twMerge('loading-skeleton my-1 h-4 w-full', classes)} />
)
