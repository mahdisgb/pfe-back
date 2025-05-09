const db = require("../models");
const CourseModel = require("../models/CourseModel");
const { Op } = require("sequelize");
const cloudinary = require('../cloudinary');

const getList = async (req, res) => {
    try {
        const requestBody = req.query;
        if(Object.keys(requestBody).length === 0){
            const result = await db.Course.findAll({ 
                attributes: ["id", "title", "content", "description", "categoryId", "lessonCount", "thumbnail"],
                include: [
                    { model: db.Category, as: 'category', attributes: ['name'] },
                    { model: db.User, as: 'professor', attributes: ['firstName', 'lastName'] }
                ]
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
            attributes: ["id", "title", "content", "description", "categoryId", "lessonCount", "thumbnail"],
            include: [
                { model: db.Category, as: 'category', attributes: ['name'] },
                { model: db.User, as: 'professor', attributes: ['firstName', 'lastName'] }
            ]
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
    try {
        const {title, content, document, description, categoryId, professorId} = req.body;
        if (Object.keys(req.body).length < 1) {
            res.status(500).send("request is empty");
            return;
        }

        let thumbnailUrl = null;
        if (req.file) {
            thumbnailUrl = req.file.path;
        }

        const course = await db.Course.create({
            title, 
            content, 
            description, 
            categoryId, 
            professorId,
            thumbnail: thumbnailUrl
        });
        res.status(200).send("1");
    } catch (error) {
        console.error("Error creating course:", JSON.stringify(error));
        res.status(500).json({ error: "Internal Server Error" });
    }
};

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
            attributes: ["id", "title", "content", "description", "categoryId", "lessonCount", "thumbnail"],
            include: [
                { model: db.Category, as: 'category', attributes: ['name'] },
                { model: db.User, as: 'professor', attributes: ['firstName', 'lastName',"id"] }
            ]
        });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProfessorCourses = async (req, res) => {
    try {
        const professorId = req.params.professorId;
        const courses = await db.Course.findAll({
            where: { professorId },
            attributes: ["id", "title", "content",  "description", "categoryId", "lessonCount"],
            include: [{ model: db.Category, as: 'category', attributes: ['name'] }]
        });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching professor courses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getList, create, update, deleteOne, getCourse, getProfessorCourses } 