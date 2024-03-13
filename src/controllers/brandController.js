const ApiError = require("../error/ApiError");
const { Brand } = require("../models/models");

class BrandController {
    async add(req, res, next) {
        try {
            const name = req.body.name[0].toUpperCase() + req.body.name.slice(1);

            const candidate = await Brand.findOne({ where: { name } })
            if (candidate) {
                next(ApiError.badRequest("Такой бренд уже существует"));
            }

            const brand = await Brand.create({ name });
            return res.json({ brand });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body;
            const count = await Brand.destroy({ where: { id } });
            return res.json({ message: `Удалено ${count} бренд(ов)` });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async getAll(req, res, next) {
        try {
            const brands = await Brand.findAll();
            return res.json({ brands });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const brand = await Brand.findOne({
                where: { id }
            });
            return res.json({ brand });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }
}

module.exports = new BrandController();
