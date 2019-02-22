module.exports = class APIError extends Error {

	constructor(status, message) {
		super(message);
		this.status = status;
	}

	getStatus() {
		return this.status;
	}

	toJSON() {
		return {
			message: this.message,
			status: this.status
		}
	}
}
