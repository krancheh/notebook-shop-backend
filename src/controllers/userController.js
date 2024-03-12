const ApiError = require("../error/ApiError");
const bcrypt = require('bcrypt')
const {User, Basket} = require("../models/models")
const jwt = require('jsonwebtoken');
const generateToken = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    );
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body;

        if (!email || !password) {
            return next(ApiError.badRequest("Неверный email или пароль"));
        }

        const candidate = await User.findOne({where: {email}});

        if (candidate) {
            return next(ApiError.badRequest("Пользователь с таким email уже существует"));
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({email, role, password: hashPassword});
        const basket = await Basket.create({userId: user.id});
        const token = generateToken(user.id, user.email, user.role);
        return res.json({token});
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne(
            {
                where: {email}
            }
        );
        if (!user) {
            return next(ApiError.internal('Пользователь с таким email не найден'));
        }

        const passwordIsCorrect = bcrypt.compareSync(password, user.password);
        if (!passwordIsCorrect) {
            return next(ApiError.internal('Указан неверный пароль'));
        }

        const token = generateToken(user.id, user.email, user.role);
        return res.json({token});
    }

    async checkAuth(req, res) {
        const token = generateToken(req.user.id, req.user.email, req.user.role);
        return res.json({token});
    }

    async getById(req, res) {
        const {id} = req.params;

        const user = await User.findOne({
            where: {id}
        })
        return res.json(user);
    }

    async getAll(req, res) {
        const users = await User.findAll();
        return res.json(users);
    }

}

module.exports = new UserController();