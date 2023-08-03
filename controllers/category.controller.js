const { response } = require('express');

const Category = require('../models/category.model');


/**
 * The function `getCategories` is an asynchronous function that retrieves categories from a database
 * based on a given query and returns the categories and the total count.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters. It is used to
 * retrieve data from the client and pass it to the server.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an object that contains methods and properties related to the HTTP response, such
 * as `json()` method to send a JSON response, `status()` method to set the status code of the response
 * @returns a JSON response with the following properties:
 * - "ok": a boolean value indicating whether the operation was successful or not.
 * - "categories": an array of category objects.
 * - "total": a number representing the total count of categories that match the query.
 */
const getCategories = async(req, res) => {

    try {

        const { desde, hasta, ...query } = req.body;

        const [categories, total] = await Promise.all([
            Category.find(query)
            .limit(hasta)
            .skip(desde),
            Category.countDocuments()
        ]);

        res.json({
            ok: true,
            categories,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });

    }


};


/**
 * The function `getCategoryId` is an asynchronous function that retrieves a category by its ID from
 * the database and returns it as a JSON response.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as the request method, request headers,
 * request parameters, request body, etc.
 * @param [res] - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an instance of the Express `response` object.
 * @returns a JSON response. If the category is found in the database, it returns a JSON object with
 * the property "ok" set to true and the category object. If the category is not found, it returns a
 * JSON object with the property "ok" set to false and a message indicating that the category was not
 * found. If there is an error during the execution of the function,
 */
const getCategoryId = async(req, res = response) => {

    try {
        const id = req.params.id;

        const categoryDB = await Category.findById(id);
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No hemos encontrado esta categoria, porfavor intente nuevamente.'
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};


/**
 * The function `createCategory` is an asynchronous function that creates a new category and saves it
 * to the database.
 * @param req - The req parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as the request method, request headers,
 * request body, and request parameters.
 * @param [res] - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an optional parameter and has a default value of `response`.
 */
const createCategory = async(req, res = response) => {

    try {

        const uid = req.uid;

        // SAVE TASK
        const category = new Category(req.body);

        await category.save();

        res.json({
            ok: true,
            category
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
};


/**
 * The function `updateCategory` updates a category in a database based on the provided category ID and
 * request body.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes details such as the request method, headers, URL, and any
 * data sent in the request body.
 * @param [res] - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an optional parameter and has a default value of `response`.
 * @returns a JSON response with the updated category object if the category is found and updated
 * successfully. If the category is not found, it returns a JSON response with an error message
 * indicating that no category exists with the provided ID. If there is an error during the process, it
 * returns a JSON response with an error message indicating an unexpected error.
 */
const updateCategory = async(req, res = response) => {

    const catid = req.params.id;

    try {

        // SEARCH USER
        const categoryDB = await Category.findById(catid);
        if (!categoryDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna categoria con este ID'
            });
        }
        // SEARCH USER

        // VALIDATE USER
        let {...campos } = req.body;

        // UPDATE
        const categoryUpdate = await Category.findByIdAndUpdate(catid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            category: categoryUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }

};

/**
 * The function `deleteCategory` is an asynchronous function that deletes a category from the database
 * based on the provided category ID.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as the request method, request headers,
 * request body, and request parameters.
 * @param [res] - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an optional parameter and has a default value of `response`.
 * @returns a JSON response with the following properties:
 * - "ok": a boolean value indicating whether the operation was successful or not.
 * - "msg": a message indicating the result of the operation.
 */
const deleteCategory = async(req, res = response) => {


    try {
        const catid = req.params.id;

        // SEARCH PRODUCT
        const categoryDB = await Category.findById({ _id: catid });
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ninguna categoria con este ID'
            });
        }
        // SEARCH PRODUCT

        await Category.findByIdAndDelete(catid);

        res.json({
            ok: true,
            msg: 'La categoria fue eliminada con exito'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};


// EXPORTS
module.exports = {
    getCategories,
    getCategoryId,
    createCategory,
    updateCategory,
    deleteCategory
};