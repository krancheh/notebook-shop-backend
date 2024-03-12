const uuid = require("uuid");
const path = require("path");
const { Item, ItemInfo } = require("../models/models");
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

    async get(req, res, next) {

        try {
            let { brandId, typeId, limit, page } = req.query;

            limit = limit || 9;
            page = page || 1;
            let offset = page * limit - limit;
            let itemCondition;

            if (brandId) {
                itemCondition.brandId = brandId;
            }

            if (typeId) {
                itemCondition.typeId = typeId;
            }
            const { rows, count } = await Item.findAndCountAll({ where: itemCondition, limit, offset });

            return res.json({ items: rows, count });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async getById(req, res, next) {

        try {
            const { id } = req.params;
            const item = await Item.findOne(
                {
                    where: { id },
                    include: [{ model: ItemInfo, as: 'info' }],
                },
            );
            return res.json({ item });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }
}

module.exports = new ItemController();
