const ApiError = require("../error/ApiError");
const bcrypt = require('bcrypt')
const { User, Basket } = require("../models/models")
const jwt = require('jsonwebtoken');
const generateToken = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '7d' }
    );
}

const setAuthCookie = (token, res) => {
    const options = {
        maxAge: 1000 * 60 * 60 * 24 * 7,  // 7 days
        httpOnly: true, // The cookie only accessible by the web server
    }

    res.cookie("auth", `Bearer ${token}`, options);
}

class UserController {
    async registration(req, res, next) {
        try {
            const { firstName, lastName, email, password, role } = req.body;

            if (!email || !password || !firstName || !lastName) {
                return next(ApiError.unathorized("Указаны не все поля"));
            }

            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                return next(ApiError.unathorized("Пользователь с таким email уже существует"));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ firstName, lastName, email, role, password: hashPassword });
            const basket = await Basket.create({ userId: user.id });
            const token = generateToken(user.id, user.email, user.role);
            setAuthCookie(token, res);
            return res.json({ user, token });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(ApiError.unathorized('Указаны не все поля'));
            }

            const user = await User.findOne(
                {
                    where: { email }
                }
            );

            if (!user) {
                return next(ApiError.unathorized('Неверный email или пароль'));
            }
            const passwordIsCorrect = bcrypt.compareSync(password, user.password);

            if (!passwordIsCorrect) {
                return next(ApiError.unathorized('Неверный email или пароль'));
            }

            const token = generateToken(user.id, user.email, user.role);
            setAuthCookie(token, res);
            return res.json({ user });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async checkAuth(req, res, next) {
        try {
            const { user } = req;
            const token = generateToken(user.id, user.email, user.role);
            setAuthCookie(token, res);
            const { firstName } = await User.findByPk(user.id);
            return res.json({ user: { ...user, firstName } });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const user = await User.findOne({
                where: { id }
            })
            return res.json({ user });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await User.findAll();
            return res.json({ users });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie('auth', { httpOnly: true });
            return res.status(200).send("Успешный выход");
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

}

module.exports = new UserController();