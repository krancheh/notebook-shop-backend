const ApiError = require("../error/ApiError");
const { Basket, BasketItem, Item, Brand, Type, ItemInfo } = require("../models/models");



class BasketController {

    async createBasket(req, res, next) {
        try {
            const { userId } = req.body;

            if (!userId) {
                next(ApiError.badRequest("Введите id пользователя"));
            }

            const basket = await Basket.create({ userId });
            return res.json({ basket });
        } catch (e) {
            console.log(e);
            next(ApiError.internal("Произошла ошибка"));
        }
    }

    async addItem(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { id: itemId } = req.body;

            const { id: basketId } = await Basket.findOne({ where: { userId } })

            if (!itemId || !basketId) {
                return next(ApiError.badRequest("Не указаны необходимые параметры"));
            }

            const basketItem = await BasketItem.create({ basketId, itemId });

            const item = await Item.findOne({
                where: { id: itemId },
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

            const resultItem = {
                basketItemId: basketItem.id,
                id: item.id,
                name: item.name,
                price: item.price,
                img: item.img,
                brand: item.brand,
                type: item.type,
                info: item.info
            }

            return res.json({ item: resultItem });
        } catch (e) {
            console.log(e);
            next(ApiError.internal("Произошла ошибка"));
        }
    }

    async removeItems(req, res, next) {
        try {
            const { ids } = req.body;
            console.log(req.body);
            const count = await BasketItem.destroy({ where: { id: ids } });
            return res.json({ message: `Удалено товаров в корзине: ${count}` });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async get(req, res, next) {
        try {
            const { id: userId } = req.user;
            const basket = await Basket.findOne({
                where: { userId },
                include: [{
                    model: BasketItem,
                    attributes: ['id', 'itemId'],
                    as: 'items',
                    include: [{
                        model: Item,
                        attributes: ['id', 'name', 'price', 'img'],
                        include: [
                            {
                                model: Brand,
                                attributes: ['name'],
                            },
                            {
                                model: Type,
                                attributes: ['name'],
                            },
                            {
                                model: ItemInfo, as: 'info'
                            }
                        ]
                    }]
                }]
            });

            if (!basket) {
                const { id: newBasketId } = await Basket.create({ userId });
                return res.json({ basketId: newBasketId, items: [] });
            }

            const formattedBasket = {
                id: basket.id,
                items: basket.items.map(basketItem => ({
                    basketItemId: basketItem.id,
                    id: basketItem.itemId,
                    brand: basketItem.item.brand,
                    type: basketItem.item.type,
                    name: basketItem.item.name,
                    img: basketItem.item.img,
                    price: basketItem.item.price,
                    info: basketItem.item.info
                }))
            }

            return res.json({ basket: formattedBasket });
        } catch (e) {
            console.log(e);
            next(ApiError.internal("Произошла ошибка"));
        }
    }
}

module.exports = new BasketController();