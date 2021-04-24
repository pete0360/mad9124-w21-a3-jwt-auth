export default function requireAdmin(req, res, next) {
    if (!req.isAdmin){
        return res.status(401).send({
        errors: [
            {
            status: '401',
            title: 'Authentication failed',
            description: 'User is not admin',
            },
        ],
        })
        next
    }
    next()
  }
  