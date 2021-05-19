export const badRequestHandler = (err, req, res, next) => (err.status === 400 ? res.status(400).send(err.message) : next(err))

export const notFoundHandler = (err, req, res, next) => (err.status === 404 ? res.status(400).send(err.message) : next(err))

export const defaultErrorHandler = (err, req, res, next) => {
    res.status(500).send()
}
