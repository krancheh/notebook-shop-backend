const uuid = require("uuid");
const path = require("path");
const {Item, ItemInfo} = require("../models/models");
const ApiError = require("../error/ApiError");

class ItemController {
    async add(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body;
            const {img} = req.files;
            let fileName = uuid.v4() + '.jpg';
            const item = await Item.create({name, price, brandId, typeId, img: fileName});
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

            return res.json(item);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async get(req, res) {
        let {brandId, typeId, limit, page} = req.query;

        limit = limit || 9;
        page = page || 1;
        let offset = page * limit - limit;

        let items;

        if (!brandId && !typeId) {
            items = await Item.findAndCountAll({limit, offset});
        }
        if (brandId && !typeId) {
            items = await Item.findAndCountAll({where: {brandId}, limit, offset});
        }

        if (!brandId && typeId) {
            items = await Item.findAndCountAll({where: {typeId}, limit, offset});
        }

        if (brandId && typeId) {
            items = await Item.findAndCountAll({where: {brandId, typeId}, limit, offset});
        }

        return res.json(items);
    }

    async getById(req, res) {
        const {id} = req.params;
        const item = await Item.findOne(
            {
                where: {id},
                include: [{ model: ItemInfo, as: 'info' }],
            },
        );
        return res.json(item);
    }
}

module.exports = new ItemController();
