const { verify } = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

function EnsureAuthentication(request, response, next) {
    const authHeader = request.headers.authorization

    if(!authHeader) {
        throw new AppError('JWT token não informado.', 401)
    };

    const [, token ] = authHeader.split(" ");

    try {
        const { sub: user_id } = verify(token, authConfig.JWT.secret);
        console.log(user_id)

        request.user = {
            id: Number(user_id)
        }

        return next()
    } catch {
        throw AppError('JWT token inválido.', 401)
    }
}

module.exports = EnsureAuthentication;