import { ReactElement } from 'react'

export const Route404 = (): ReactElement => {
	return (
		<div className='flex h-full w-full flex-col items-center justify-center'>
			<div className='text-[15rem] text-blue-800'>404</div>
			<span className='text-[3rem] text-blue-600'>This page doesn&apos;t exist</span>
		</div>
	)
}
