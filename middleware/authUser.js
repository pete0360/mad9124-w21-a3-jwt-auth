import jwt from 'jsonwebtoken'

const secretKey = 'secretKey'

const parseToken = function (headerValue) {
    if (headerValue) {
        const [type, token] = headerValue.split(' ')
        if (type === 'Bearer' && typeof token !== 'undefined') {
            return token
        }
        }
    return undefined
    }

    const checkApiKey = function (key) {
        if (key === 'liko0007' || key === 'pete0360') {
            return key
        }
        return undefined
    }
    
    
    export default function (req, res, next) {
        const headerValue = req.header('Authorization')
        const apiKey = req.header('x-api-key')
        checkApiKey(apiKey)
        const token = parseToken(headerValue)
    
        if (!token) {
            return res.status(401).send({
            errors: [
                {
                status: '401',
                title: 'Authentication failed',
                description: 'Missing Bearer token',
                },
            ],
            })
        }

        if (!apiKey) {
            return res.status(401).send({
                errors: [
                    {
                    status: '401',
                    title: 'Authentication failed',
                    description: 'Missing or Invalid Api Key',
                    },
                ],
                })
        }

    // Validate the JWT
    try {
        const payload = jwt.verify(token, secretKey, { algorithms: ['HS256'] })
        req.user = { _id: payload.uid }
        next()
    } catch (err) {
        res.status(401).send({
        errors: [
            {
            status: '401',
            title: 'Authentication failed',
            description: 'Invalid Bearer token',
            },
        ],
        })
    }
}
