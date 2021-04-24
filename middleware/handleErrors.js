const formatServerError = function (err) {
    return [
        {
            status: '500',
            title: 'Internal server error',
            description: err.message || 'Please check the logs'
        }
    ]
}

const formatValidationError = function (err) {
    return Object.values(err).map(e => ({
        status: '400',
        title: 'Validation Error',
        detail: e.message,
        source: {pointer: `/data/attributes/${e.path}`, value: e.value}
    }))
}

const formatResourceError = function (err) {
    return [
        {
            status: err.status,
            title: err.title,
            description: err.message || 'Please check the logs'
        }
    ]
}

export default function handleError (err, req, res, next) {
    const isValidationError = err?.name === 'ValidationError'
    const code = isValidationError ? 400 : err.code || 500 //magic ternary expression
    let payload = [err]
    if (code === 400){
        payload = formatValidationError(err)
    } 
    if (code ===404){
        payload = formatResourceError(err)
    }
    if (code === 500){
        payload = formatServerError(err)
    }

    res.status(code).send({errors: payload})

}