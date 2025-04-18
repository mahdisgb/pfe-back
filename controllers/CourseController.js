const db = require("../models");
const CourseModel = require("../models/CourseModel");
const { Op } = require("sequelize");

const getList = async (req, res) => {
    try {
        const requestBody = req.query;
        if(Object.keys(requestBody).length === 0){
            const result = await db.Course.findAll({ 
                attributes: ["id", "title", "content", "document", "trainingId", "description", "categoryId"],
                include: [{ model: db.Category, as: 'category', attributes: ['name'] }]
            });
            res.json(result);
            return;
        }
        const filters = Object.keys(requestBody).filter(key => (
            key !== "_start" && key !== "_end" && key !== "_sort" && key !== "_order"
        ));
        const offset = Number(requestBody._start) || 0;
        const query = await db.sequelize.query(`show table status from inventory_management;`);
        const tableSize = Number(query[0].filter(item => item.name = "Courses")[0].Rows)
        const limit = requestBody._end == 10  ? tableSize : Number(requestBody._end) - offset;

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

        let queryOptions = { 
            offset, 
            limit,
            attributes: ["id", "title", "content", "document", "trainingId", "description", "categoryId"],
            include: [{ model: db.Category, as: 'category', attributes: ['name'] }]
        };

        if (requestBody._order && requestBody._sort) {
            queryOptions.order = [[requestBody._sort, requestBody._order.toUpperCase()]];
        }
        if (Object.keys(whereConditions).length > 0) {
            queryOptions.where = whereConditions;
        }

        const result = await db.Course.findAll(queryOptions);
        res.json(result);

    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await db.Course.create(request);
        res.status(200).send("1")
    }
}

const update = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await db.Course.update({ ...request }, { where: { id: request.id } });
        res.status(200).send("1")
    }
}

const deleteOne = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await db.Course.destroy({ where: { id: request.id } });
        res.status(200).send("1")
    }
}

const getCourse = async (req, res) => {
    try {
        const course = await db.Course.findByPk(req.params.id, {
            include: [{ model: db.Category, as: 'category', attributes: ['name'] }]
        });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getList, create, update, deleteOne, getCourse } 