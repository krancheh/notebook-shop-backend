const {Brand} = require("../models/models");

class BrandController {
    async add(req, res) {
        const {name} = req.body;
        const brand = await Brand.create({name});
        return res.json(brand);
    }

    async getAll(req, res) {
        const brands = await Brand.findAll();
        return res.json(brands);
    }

    async getById(req, res) {
        const {id} = req.params;
        const brand = await Brand.findOne({
            where: {id}
        });
        return res.json(brand);
    }
}

module.exports = new BrandController();
