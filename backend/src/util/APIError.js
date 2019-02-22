module.exports = class APIError extends Error {

	constructor(status, message) {
		super(message);
		this.status = status;
	}

	getStatus() {
		return this.status;
	}
}
