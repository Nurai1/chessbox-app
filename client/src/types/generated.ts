/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
	'/api/signup': {
		post: {
			requestBody: {
				content: {
					'application/json': {
						username: string
						email: string
						password: string
						role?: string
					}
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': {
							/** @example string */
							accessToken?: string
							data?: components['schemas']['User']
						}
						'application/xml': {
							/** @example string */
							accessToken?: string
							data?: components['schemas']['User']
						}
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/login': {
		post: {
			requestBody: {
				content: {
					'application/json': {
						email: string
						password: string
					}
				}
			}
			responses: {
				/** @description OK */
				200: never
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/user/{id}': {
		get: {
			parameters: {
				path: {
					id: string
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['User']
						'application/xml': components['schemas']['User']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
		delete: {
			parameters: {
				path: {
					id: string
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['User']
						'application/xml': components['schemas']['User']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/users': {
		get: {
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['User'][]
						'application/xml': components['schemas']['User'][]
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/user': {
		post: {
			requestBody: {
				content: {
					'application/json': components['schemas']['User']
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['User']
						'application/xml': components['schemas']['User']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
		patch: {
			requestBody: {
				content: {
					'application/json': components['schemas']['User']
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['User']
						'application/xml': components['schemas']['User']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competition/{id}': {
		get: {
			parameters: {
				path: {
					id: string
				}
			}
			responses: {
				/** @description Competition successfully obtained. */
				200: {
					content: {
						'application/json': components['schemas']['Competition']
						'application/xml': components['schemas']['Competition']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
		delete: {
			parameters: {
				path: {
					id: string
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['Competition']
						'application/xml': components['schemas']['Competition']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
		patch: {
			parameters: {
				path: {
					id: string
				}
			}
			requestBody: {
				content: {
					'application/json': components['schemas']['Competition']
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['Competition']
						'application/xml': components['schemas']['Competition']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competitions': {
		get: {
			responses: {
				/** @description Competition successfully obtained. */
				200: {
					content: {
						'application/json': components['schemas']['Competition'][]
						'application/xml': components['schemas']['Competition'][]
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competition': {
		post: {
			requestBody: {
				content: {
					'application/json': components['schemas']['Competition']
				}
			}
			responses: {
				/** @description Competition successfully created. */
				200: {
					content: {
						'application/json': components['schemas']['Competition']
						'application/xml': components['schemas']['Competition']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competition/defineWinner': {
		patch: {
			requestBody: {
				content: {
					'application/json': {
						competitionId: string
						groupId: string
						pairId: string
						winnerId?: string
						loserId?: string
					}
				}
			}
			responses: {
				/** @description Winner defined. */
				200: never
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competition/launchNextGroupRound': {
		patch: {
			requestBody: {
				content: {
					'application/json': {
						competitionId: string
						groupId: string
					}
				}
			}
			responses: {
				/** @description Next Group Round launched. */
				200: never
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competition/callPairPreparation': {
		patch: {
			requestBody: {
				content: {
					'application/json': {
						competitionId: string
						groupId: string
						pairId: string
					}
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['Competition']
						'application/xml': components['schemas']['Competition']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competition/setJudgesToCompetition': {
		patch: {
			requestBody: {
				content: {
					'application/json': {
						judgesIds: string[]
						competitionId: string
					}
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['Competition']
						'application/xml': components['schemas']['Competition']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competition/{id}/start': {
		patch: {
			parameters: {
				path: {
					id: string
				}
			}
			responses: {
				/** @description OK */
				200: never
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competition/{id}/group': {
		post: {
			parameters: {
				path: {
					id: string
				}
			}
			requestBody: {
				content: {
					'application/json': components['schemas']['CompetitionGroup']
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['Competition']
						'application/xml': components['schemas']['Competition']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competition/{id}/groups': {
		get: {
			parameters: {
				path: {
					id: string
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['CompetitionGroup'][]
						'application/xml': components['schemas']['CompetitionGroup'][]
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
	'/api/competition/{id}/addNewParticipant': {
		patch: {
			parameters: {
				path: {
					id: string
				}
			}
			requestBody: {
				content: {
					'application/json': {
						userId: string
					}
				}
			}
			responses: {
				/** @description OK */
				200: {
					content: {
						'application/json': components['schemas']['Competition']
						'application/xml': components['schemas']['Competition']
					}
				}
				/** @description Internal server error. */
				500: {
					content: {
						'application/json': {
							/** @example string */
							error?: string
						}
						'application/xml': {
							/** @example string */
							error?: string
						}
					}
				}
			}
		}
	}
}

export type webhooks = Record<string, never>

export interface components {
	schemas: {
		/** Competition */
		Competition: {
			/** Format: date-time */
			startDate?: string
			/** Format: date-time */
			endDate?: string
			name: string
			description?: string
			groups?: {
				ageCategory: string
				weightCategory: string
				gender: string
				currentRoundNumber: number
				order?: number
				nextRoundParticipants?: string[]
				allParticipants?: string[]
				passedPairs?: {
					roundNumber?: number
					blackParticipant?: string
					whiteParticipant?: string
					winner?: string
					passed?: boolean
					order?: number
					calledForPreparation?: boolean
					calledForFight?: boolean
					judge?: string
					_id?: string
				}[]
				currentRoundPairs?: {
					roundNumber?: number
					blackParticipant?: string
					whiteParticipant?: string
					winner?: string
					passed?: boolean
					order?: number
					calledForPreparation?: boolean
					calledForFight?: boolean
					judge?: string
					_id?: string
				}[]
				_id?: string
			}[]
			participantsAmount?: number
			lastOrder?: {
				group?: number
				pair?: number
			}
			participants?: string[]
			judges?: string[]
			_id: string
		}
		/** User */
		User: {
			email: string
			hashedPassword: string
			firstName?: string
			lastName?: string
			/** @enum {string} */
			role?: 'guest' | 'participant' | 'judge' | 'chief_judge' | 'admin'
			username: string
			age?: number
			socialNetworks?: {
				whatsup?: string
			}
			gender?: string
			/** Format: date-time */
			birthDate?: string
			ratingNumber: number
			weight?: {
				number?: number
				category?: string
				measureUnit?: string
			}
			competition?: string
			currentGroupId?: string
			competitionsHistory?: {
				competitionId?: string
				groupId?: string
				placeNumber?: number
			}[]
			_id: string
		}
		/** CompetitionGroup */
		CompetitionGroup: {
			ageCategory: string
			weightCategory: string
			gender: string
			currentRoundNumber: number
			order?: number
			nextRoundParticipants?: string[]
			allParticipants?: string[]
			passedPairs?: {
				roundNumber?: number
				blackParticipant?: string
				whiteParticipant?: string
				winner?: string
				passed?: boolean
				order?: number
				calledForPreparation?: boolean
				calledForFight?: boolean
				judge?: string
				_id?: string
			}[]
			currentRoundPairs?: {
				roundNumber?: number
				blackParticipant?: string
				whiteParticipant?: string
				winner?: string
				passed?: boolean
				order?: number
				calledForPreparation?: boolean
				calledForFight?: boolean
				judge?: string
				_id?: string
			}[]
			_id: string
		}
		/** Pair */
		Pair: {
			roundNumber?: number
			blackParticipant?: string
			whiteParticipant?: string
			winner?: string
			passed?: boolean
			order?: number
			calledForPreparation?: boolean
			calledForFight?: boolean
			judge?: string
			_id: string
		}
	}
	responses: never
	parameters: never
	requestBodies: never
	headers: never
	pathItems: never
}

export type external = Record<string, never>

export type operations = Record<string, never>