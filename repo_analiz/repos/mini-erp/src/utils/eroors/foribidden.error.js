export default class ForibiddenError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}