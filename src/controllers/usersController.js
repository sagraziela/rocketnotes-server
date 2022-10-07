const { hash, compare } = require('bcryptjs');
const AppError = require("../utils/AppError");
const sqliteConnection = require('../database/sqlite');

class UsersController {
    // Boas práticas: controllers têm no máximo 5 métodos!
    async create(request, response) {
        const { name, email, password } = request.body;

        const database = await sqliteConnection();
        const checkIfUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (checkIfUserExists) {
            throw new AppError("Este usuário já existe.")
        }

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [ name, email, hashedPassword ]
        );

        return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        if (!user) {
            throw new AppError('Usuário não encontrado.')
        }

        const userWithUpatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (userWithUpatedEmail && userWithUpatedEmail.id !== user.id) {
            throw new AppError('Este email já está em uso.')
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("Você precisa informar sua senha antiga para definir uma nova senha.")
        }

       if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (checkOldPassword === false) {
               throw new AppError("A senha antiga não confere.");
            }

            console.log()

            user.password = await hash(password, 8)
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, id]
        );

        return response.json()
    }
}


module.exports = UsersController