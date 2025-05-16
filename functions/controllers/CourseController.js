const db = require("../models");
const CourseModel = require("../models/CourseModel");
const { Op } = require("sequelize");
const cloudinary = require('../cloudinary');

const getList = async (req, res) => {
    try {
        const requestBody = req.query;
        console.log(requestBody);
        if(Object.keys(requestBody).length === 0){
            const result = await db.Course.findAll({ 
                attributes: ["id", "title", "description", "categoryId", "lessonCount", "thumbnail", "isActive", "price"],
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
        const tableSize = await db.Course.count();
        const limit = requestBody._end ? Number(requestBody._end) - offset : 10;
        // const limit = Number(requestBody._end)- offset;

        let whereConditions = {};
        filters.forEach(key => {
            // if(key.includes("_gte")){
            //     whereConditions[key]?.replace("_gte", "") = { [Op.gte]: requestBody[key] };
            // }
            // if(key.includes("_lte")){
            //     whereConditions[key]?.replace("_lte", "") = { [Op.lte]: requestBody[key] };
            // }

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
            attributes: ["id", "title", "description", "categoryId", "lessonCount", "thumbnail", "isActive", "price"],
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
        const {title, description, categoryId, professorId, price} = req.body;
        if (Object.keys(req.body).length < 1) {
            res.status(500).send("request is empty");
            return;
        }

        let thumbnailUrl = null;
        if (req.files?.thumbnail?.[0]) {
          thumbnailUrl = req.files.thumbnail[0].path;
        }
        const course = await db.Course.create({
            title, 
            description, 
            categoryId, 
            professorId,
            thumbnail: thumbnailUrl,
            price
        });
        res.status(200).send("1");
    } catch (error) {
        console.error("Error creating course:", JSON.stringify(error));
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    try {
        const {id, title, description, categoryId, professorId, isActive, price} = req.body;

        if (Object.keys(req.body).length < 1) {
            res.status(500).send("request is empty");
            return;
        }

        // Check if course exists
        const course = await db.Course.findByPk(Number(id));
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        let thumbnailUrl = null;
        if (req.files?.thumbnail?.[0]) {
            thumbnailUrl = req.files.thumbnail[0].path;
        }

        await db.Course.update({ 
            title, 
            description, 
            categoryId, 
            professorId,
            ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
            isActive,
            price
        }, { 
            where: { id: Number(id) } 
        });
        res.status(200).send("1");
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteOne = async (req, res) => {
    const {id} = req.body;
    try {
        await db.Lesson.destroy({ where: { courseId: id } });
        await db.Course.destroy({ where: { id: id } });
        res.status(200).send("1")
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getCourse = async (req, res) => {
    try {
        const course = await db.Course.findByPk(req.params.id, {
            attributes: ["id", "title", "description", "categoryId", "lessonCount", "thumbnail", "isActive", "price"],
            include: [
                { model: db.Category, as: 'category', attributes: ['name'] },
                { model: db.User, as: 'professor', attributes: ['firstName', 'lastName', "id"] }
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
            attributes: ["id", "title", "description", "categoryId", "lessonCount", "thumbnail", "isActive", "price"],
            include: [{ model: db.Category, as: 'category', attributes: ['name'] }]
        });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching professor courses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const toggleCourse = async (req, res) => {
    try {
        const {id, isActive} = req.body;
        await db.Course.update({ 
            isActive: isActive
        }, { 
            where: { id: id } 
        });
        res.status(200).send("1");
    } catch (error) {
        console.error("Error toggling course active:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getList, create, update, deleteOne, getCourse, getProfessorCourses, toggleCourse } 