const uuid = require("uuid");
const path = require("path");
const { Item, ItemInfo, Brand, Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class ItemController {
    async add(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + '.jpg';
            const item = await Item.create({ name, price, brandId, typeId, img: fileName });
            await img.mv(path.resolve(__dirname, '..', 'static', fileName));

            if (info) {
                info = JSON.parse(info);
                info.forEach(i =>
                    ItemInfo.create({
                        title: i.title,
                        description: i.description,
                        itemId: item.id,
                    })
                )
            }

            return res.json({ item });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body;
            const count = await Item.destroy({ where: { id } });
            return res.json({ message: `Удалено ${count} товаров(ов)` });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async get(req, res, next) {

        try {
            let { brandId, typeId, limit, page } = req.query;

            limit = limit || 9;
            page = page || 1;
            let offset = page * limit - limit;
            let itemsCondition;

            if (brandId) {
                itemsCondition = {
                    brandId
                }
            }

            if (typeId) {
                itemsCondition = {
                    ...itemsCondition,
                    typeId
                }
            }
            const { rows, count } = await Item.findAndCountAll({
                where: itemsCondition, limit, offset,
                attributes: ["id", "name", "price", "img"],
                include: [
                    {
                        model: ItemInfo, as: 'info'
                    },
                    {
                        model: Brand,
                        attributes: ["id", 'name'],
                    },
                    {
                        model: Type,
                        attributes: ['id', 'name'],
                    },
                ]
            });

            return res.json({ items: rows, count });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async getById(req, res, next) {

        try {
            const { id } = req.params;
            const item = await Item.findOne({
                where: { id },
                attributes: ["id", "name", "price", "img"],
                include: [
                    {
                        model: ItemInfo, as: 'info'
                    },
                    {
                        model: Brand,
                        attributes: ["id", 'name'],
                    },
                    {
                        model: Type,
                        attributes: ['id', 'name'],
                    },
                ]
            });
            return res.json({ item });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }
}

module.exports = new ItemController();
