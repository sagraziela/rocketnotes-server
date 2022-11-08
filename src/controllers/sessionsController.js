const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const { compare } = require('bcryptjs');
const authConfig = require('../configs/auth');
const { sign } = require('jsonwebtoken');

class SessionsController {
    async create( request, response ) {
        const { email, password } = request.body;

        const user = await knex("users").where({ email }).first();

        if(!user) {
            throw new AppError("Email e/ou senha incorreto(s).", 401)
        }

        const passwordMatches = await compare(password, user.password);

        if(!passwordMatches) {
            throw new AppError("Email e/ou senha incorreto(s).", 401)
        }

        const { secret, expiresIn } = authConfig.JWT;

        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({ user, token });
    }
}

module.exports = SessionsController;