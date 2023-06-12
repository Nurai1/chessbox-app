/* eslint-disable max-classes-per-file */

export interface IRequestResponseError {
	message: string
	type?: 'Bad request.' | 'Internal server error.' | 'Client error.'
}

export class BaseError implements IRequestResponseError {
	message: string

	constructor(args: { message?: string }) {
		this.message = args.message || 'Unknown error.'
	}
}

export class ClientRequestError extends BaseError {
	type: 'Bad request.'

	constructor(args: { message?: string }) {
		super({ ...args, message: args.message || 'Bad request.' })

		this.type = 'Bad request.'
	}
}

export class InternalServerError extends BaseError {
	type: 'Internal server error.'

	constructor(args: { message?: string }) {
		super({ ...args, message: args.message || 'Internal server error.' })

		this.type = 'Internal server error.'
	}
}

export class ClientError extends BaseError {
	type: 'Client error.'

	constructor(args: { message?: string }) {
		super({ ...args, message: args.message })

		this.type = 'Client error.'
	}
}

export class RequestResponseValidationError extends ClientError {
	message: string

	constructor(args: { message: string }) {
		super(args)

		this.message = `Invalid response data. Full error JSON: ${args.message}`
	}
}
