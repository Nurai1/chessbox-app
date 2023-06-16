type Pairs = {
	roundNumber: number
	blackParticipant: string
	whiteParticipant: string
	_id: string
}

type Groups = {
	ageCategory: string
	weightCategory: string
	gender: string
	currentRoundNumber: number
	nextRoundParticipants: string[] | []
	allParticipants: string[] | []
	pairs?: Pairs[]
	_id: string
	passedPairs: string[] | []
	currentRoundPairs: string[] | []
}

type Competition = {
	lastOrder: {
		group: number
		pair: number
	}
	judges: string[] | []
	_id: string
	startDate: string
	endDate: string
	name: string
	description: string
	participants: string[] | []
	pairs?: string[] | []
	groups?: Groups[]
}

type Weight = {
	number: number
	measureUnit: string
	category: string
}

export type User = {
	_id: string
	email: string
	firstName?: string
	lastName?: string
	weight?: Weight
	hashedPassword: string
	role: string
	username: string
	accessToken?: string
	birthDate?: string
	socialNetworks?: {
		whatsUp?: string
	}
	age?: number
	gender?: string
	club?: string
	ratingNumber: number
	competition?: Competition
	currentGroupId?: string
	competitionsHistory:
		| {
				competitionId: string
				placeNumber: number
				groupId: string
		  }[]
		| []
}
