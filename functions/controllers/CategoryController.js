const db = require("../models");
const CategoryModel = require("../models/CategoryModel");
const { Op } = require("sequelize");

const getList = async (req, res) => {
    try {
        const requestBody = req.query;
        
        if(Object.keys(requestBody).length === 0){
            
            const result = await db.Category.findAll({ attributes: ["id", "name", "description", "courseCount"]});
        res.json(result);
            return
        }
        console.log(requestBody)
        const filters = Object.keys(requestBody).filter(key => (
            key !== "_start" && key !== "_end" && key !== "_sort" && key !== "_order"
        ));
        const offset = Number(requestBody._start) || 0;
        const tableSize = await db.Category.count();
        // const limit = requestBody._end == 10  ? tableSize : Number(requestBody._end) - offset;
        const limit = Number(requestBody._end)- offset;


        let whereConditions = {};
        filters.forEach(key => {
            if (!key.includes("_like")) {
                whereConditions[key] = requestBody[key];
            } else {
                const likeKey = key.replace("_like", "");
                if(requestBody[key]){
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

        const result = await db.Category.findAll({ attributes: ["id", "name", "description", "courseCount"], ...queryOptions });

        res.json(result);

    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await db.Category.create(request);
        res.status(200).send("1")
    }
}

const update = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await db.Category.update({ ...request }, { where: { id: request.id } });
        res.status(200).send("1")
    }
}

const deleteOne = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await db.Category.destroy({ where: { id: request.id } });
        res.status(200).send("1")
    }
}

// Get single category
const getCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { getList, create, update, deleteOne,getCategory } 