export default class AuthorizationError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}