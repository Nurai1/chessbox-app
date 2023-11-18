import { useRef, ReactNode, useState, useEffect } from 'react'

type ClamedTextPropsType = {
	children: ReactNode
	linesNumberProp?: number
	lineHeight?: number
	fontSizeProp?: number
	classes?: string
}

export const ClampedText = ({
	children,
	linesNumberProp = 3,
	lineHeight = 1.5,
	fontSizeProp = 16,
	classes
}: ClamedTextPropsType) => {
	const textRef = useRef<HTMLParagraphElement>(null)
	const [linesNumber, setLinesNumber] = useState('')

	useEffect(() => {
		if (textRef.current) {
			if (textRef.current.clientHeight > linesNumberProp * lineHeight * fontSizeProp) {
				setLinesNumber(String(linesNumberProp))
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className={`${'relative'} ${classes}`}>
			<p
				className={classes}
				ref={textRef}
				style={{
					display: '-webkit-box',
					WebkitLineClamp: linesNumber,
					WebkitBoxOrient: 'vertical',
					overflow: 'hidden',
					lineHeight
				}}
			>
				{children}
			</p>
			{linesNumber && (
				<div className='absolute bottom-0 right-0 z-10 bg-gradient-to-r from-transparent via-white to-white pl-16'>
					<button
						type='button'
						className='bg-white pl-2 transition hover:opacity-70'
						onClick={() => setLinesNumber('')}
					>
						Show more
					</button>
				</div>
			)}
		</div>
	)
}
