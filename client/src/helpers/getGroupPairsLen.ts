export const getGroupPairsLen = ({
	passedPairsLen,
	currentPairsLen,
	nextRoundParticipantsLen
}: {
	passedPairsLen: number
	currentPairsLen: number
	nextRoundParticipantsLen: number
}) => {
	let roundPairsLen = nextRoundParticipantsLen / 2 + currentPairsLen / 2
	let allPairsLen = passedPairsLen + (currentPairsLen - passedPairsLen) + Math.ceil(roundPairsLen)
	// TODO
	// let fakePairToIncreaseTime = 0;

	while (roundPairsLen > 1) {
		roundPairsLen = Math.floor(roundPairsLen / 2)
		allPairsLen += roundPairsLen
	}

	return { length: allPairsLen, passedGroup: passedPairsLen === allPairsLen }
}
