export const getGroupPairsLen = ({
	currentPairsLen,
	nextRoundParticipantsLen
}: {
	currentPairsLen: number
	nextRoundParticipantsLen: number
}) => {
	let allPairsLen = currentPairsLen + nextRoundParticipantsLen / 2 + currentPairsLen / 2
	let roundPairsLen = nextRoundParticipantsLen / 2 + currentPairsLen / 2

	while (roundPairsLen > 1) {
		roundPairsLen = Math.floor(roundPairsLen / 2)
		allPairsLen += roundPairsLen
	}

	return allPairsLen
}