const { response } = require('express');

const Subcategory = require('../models/subcategory.model');



/**
 * The function `getSubcategories` is an asynchronous function that retrieves subcategories from a
 * database based on a given query and returns them along with the total count.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters. It is used to
 * retrieve data from the client and send a response back to the client.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an instance of the Express `Response` object.
 * @returns a JSON response with the following properties:
 * - "ok": a boolean value indicating whether the operation was successful or not.
 * - "subcategories": an array of subcategories that match the query parameters.
 * - "total": the total number of subcategories in the database.
 */
const getSubcategories = async(req, res) => {

    try {

        const { desde, hasta, ...query } = req.body;

        const [subcategories, total] = await Promise.all([
            Subcategory.find(query)
            .populate('categoria')
            .limit(hasta)
            .skip(desde),
            Subcategory.countDocuments()
        ]);

        res.json({
            ok: true,
            subcategories,
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
 * The function `getSubcategoryId` is an asynchronous function that retrieves a subcategory by its ID
 * and returns it as a response.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes details such as the request method, URL, headers, and body.
 * @param [res] - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an instance of the `response` object from the Express framework.
 * @returns a JSON response with the subcategory object if it is found in the database. If the
 * subcategory is not found, it returns a JSON response with an error message. If there is an
 * unexpected error, it returns a JSON response with an error message as well.
 */
const getSubcategoryId = async(req, res = response) => {

    try {
        const id = req.params.id;

        const subcategoryDB = await Subcategory.findById(id)
            .populate('categoria');
        if (!subcategoryDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No hemos encontrado esta subcategoria, porfavor intente nuevamente.'
            });
        }

        res.json({
            ok: true,
            subcategory: subcategoryDB
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};


const createSubcategory = async(req, res = response) => {

    try {

        const uid = req.uid;

        // SAVE TASK
        const subcategoryNew = new Subcategory(req.body);

        await subcategoryNew.save();

        const subcategory = await Subcategory.findById(subcategoryNew._id)
            .populate('categoria');

        res.json({
            ok: true,
            subcategory
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
 * This function updates a subcategory in a database based on the provided ID.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes details such as the request method, headers, URL, and body.
 * @param [res] - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an optional parameter and has a default value of `response`, which is an object
 * that provides methods for sending the response.
 * @returns a JSON response. If the subcategory is found and updated successfully, it will return a
 * JSON object with the properties "ok" set to true and "subcategory" containing the updated
 * subcategory. If the subcategory is not found, it will return a JSON object with "ok" set to false
 * and "msg" containing an error message. If there is an unexpected error,
 */
const updateSubcategory = async(req, res = response) => {

    const subcaid = req.params.id;

    try {

        // SEARCH USER
        const subcategoryDB = await Subcategory.findById(subcaid);
        if (!subcategoryDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna subcategoria con este ID'
            });
        }
        // SEARCH USER

        // VALIDATE USER
        let {...campos } = req.body;

        // UPDATE
        const subcategoryUpdate = await Subcategory.findByIdAndUpdate(subcaid, campos, { new: true, useFindAndModify: false });

        const subcategory = await Subcategory.findById(subcaid)
            .populate('categoria');

        res.json({
            ok: true,
            subcategory
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }

};


// EXPORTS
module.exports = {
    getSubcategories,
    getSubcategoryId,
    createSubcategory,
    updateSubcategory
};