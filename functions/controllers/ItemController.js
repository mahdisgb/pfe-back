/*const db = require("../models");
const ItemModel = require("../models/ItemModel");
const { Op} = require("sequelize");

const getList = async (req, res) => {
    try {
        const requestBody = req.query;
        const filters = Object.keys(requestBody).filter(key => (
            key !== "_start" && key !== "_end" && key !== "_sort" && key !== "_order"
        ));
        const offset = Number(requestBody._start) || 0;
        const query = await db.sequelize.query(`show table status from inventory_management;`);
        const tableSize = Number(query[0].filter(item => item.name = "Items")[0].Rows)
        const limit = requestBody._end == 10  ? tableSize : Number(requestBody._end) - offset;

        let whereConditions = {};
        filters.forEach(key => {
            if (!key.includes("_like")) {
                whereConditions[key] = requestBody[key];
            } else {
                const likeKey = key.replace("_like", "");
                if(requestBody[key]){
                    console.log("this is value :",requestBody[key].length)
                    whereConditions[likeKey] = { [Op.like]: `%${requestBody[key]}%` }
                }
            }
        });

        let queryOptions = { offset, limit };

        if (requestBody._order && requestBody._sort) {
            queryOptions.order = [[requestBody._sort, requestBody._order.toUpperCase()]];
        }
        if (Object.keys(whereConditions).length > 0) {
            queryOptions.where = whereConditions;
        }

        const result = await ItemModel(db.sequelize).findAll({ attributes: ["id", "name", "category", "quantity", "unit", "price", "to_buy"], ...queryOptions });

        res.json(result);

    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await ItemModel(db.sequelize).create(request);
        res.status(200).send("1")
    }
}
const update = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await ItemModel(db.sequelize).update({ ...request }, { where: { id: request.id } });
        res.status(200).send("1")
    }
}
const deleteOne = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await ItemModel(db.sequelize).destroy({ where: { id: request.id,category:request.category } });
        res.status(200).send("1")
    }
}
module.exports = { getList, create, update, deleteOne }*/