import { Button } from '../../ui'

export const CompetitionCard = () => {
	const handleClick = () => {
		return null
	}
	return (
		<article>
			<div>
				<h2>World Competition of Chessboxing June 2024</h2>
				<p>Starts At June 17, 19:00</p>
			</div>
			<div>
				<p>
					The best competition in sport ever. Feel how stronger you become. Come and train your brain and muscles. Lorem
					ipsum delorian van fin uptinum. Lorem ipsum delorian van fin uptinum. Lorem ipsum delorian van fin uptinum.
					Lorem ipsum delorian van fin uptinum.
				</p>
				<div>tags</div>
			</div>
			<div>
				<p>Registration ends in:</p>
				<div>timer</div>
				<Button onClick={handleClick}>Participate</Button>
			</div>
		</article>
	)
}
