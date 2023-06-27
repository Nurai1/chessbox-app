import { LastOrder, Groups } from './user'

export type Competition = {
	lastOrder: LastOrder
	judges: string[] | []
	_id: string
	startDate: string
	endDate: string
	registrationEndsAt: string
	name: string
	description: string
	participants: string[] | []
	pairs?: string[] | []
	groups: Groups[]
	price: string
}
