class ResourceNotFound extends Error {
    constructor (...args) {
        super(...args) //calls the constructor of the class being extended (Error)
        Error.captureStackTrace(this, ResourceNotFound)
        this.code = 404
        this.status = '404'
        this.title = 'Resource does not exist'
        this.description = this.message


    }

}

export default ResourceNotFound
