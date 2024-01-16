module.exports = {
	resolveError(err, res) {
		if (err.isOperational)
			res.status(err.statusCode).json(err.message);
		else
			res.status(err.statusCode ?? 400).json({ stack: err.stack });
	}
}