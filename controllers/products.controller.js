const { response } = require('express');

const Product = require('../models/products.model');
const Subcategory = require('../models/subcategory.model')

/** =====================================================================
 *  GET PRODUCTS EXCEL
=========================================================================*/
const getProducts = async(req, res = response) => {

    try {

        const { desde, hasta, sort, ...query } = req.body;

        const [products, total] = await Promise.all([

            Product.find(query)
            .limit(hasta)
            .skip(desde)
            .sort(sort)
            .populate('categoria')
            .populate('tax')
            .populate('subcategoria'),
            Product.countDocuments({ status: true })
        ])

        res.json({
            ok: true,
            products,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }


}

/** =====================================================================
 *  GET PRODUTS FOR ID
=========================================================================*/
const oneProduct = async(req, res = response) => {

    const id = req.params.id;

    try {

        const product = await Product.findById(id)
            .populate('categoria')
            .populate('tax')
            .populate('subcategoria');

        res.json({
            ok: true,
            product
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });

    }


};


/** =====================================================================
 *  GET PRODUCTS EXCEL
=========================================================================*/
const productsExcel = async(req, res = response) => {

    try {

        const {...query } = req.body;

        const products = await Product.find(query)
            .populate('categoria')
            .populate('tax')
            .populate('subcategoria');

        res.json({
            ok: true,
            products
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }


}

/** =====================================================================
 *  CREATE PRODUCT
=========================================================================*/
const createProduct = async(req, res = response) => {

    const { sku } = req.body;

    try {

        // VALIDATE CODE
        const validateSku = await Product.findOne({ sku });
        if (validateSku) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un producto con este codigo de barras'
            });
        }

        // SAVE PRODUCT
        const productNew = new Product(req.body);
        productNew.inventory = productNew.stock;

        await productNew.save();

        const product = await Product.findById(productNew._id)
            .populate('categoria')
            .populate('subcategoria');

        res.json({
            ok: true,
            product
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};
/** =====================================================================
 *  CREATE PRODUCT
=========================================================================*/

/** =====================================================================
 *  CREATE PRODUCT EXCEL
=========================================================================*/
const createProductExcel = async(req, res = response) => {

    try {

        let products = req.body.products;

        if (products.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'Lista de productos vacias, verifique he intene nuevamente'
            });
        }

        let i = 0;

        for (const producto of products) {

            // VALIDATE CODE
            const validateSku = await Product.findOne({ sku: producto.sku });
            if (!validateSku) {

                const subcategoria = await Subcategory.findOne({ name: producto.subcategoria });

                if (subcategoria) {
                    producto.subcategoria = subcategoria._id;
                    producto.categoria = subcategoria.categoria;
                } else {
                    delete producto.subcategoria;
                    delete producto.categoria;
                }

                producto.inventory = producto.stock;

                // SAVE PRODUCT
                const product = new Product(producto);
                await product.save();
                i++;
            }

        }

        res.json({
            ok: true,
            total: i
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};
/** =====================================================================
 *  CREATE PRODUCT EXCEL
=========================================================================*/

/** =====================================================================
 *  UPDATE PRODUCT
=========================================================================*/
const updateProduct = async(req, res = response) => {

    const pid = req.params.id;

    const user = req.uid;

    try {

        // SEARCH PRODUCT
        const productDB = await Product.findById({ _id: pid });
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun producto con este ID'
            });
        }
        // SEARCH PRODUCT

        // VALIDATE SKU && NAME
        const { sku, name, ...campos } = req.body;

        // SKU
        if (String(productDB.sku) !== String(sku)) {
            const validateSku = await Product.findOne({ sku });
            if (validateSku) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un producto con este codigo de barras'
                });
            }

            campos.sku = sku;
        }

        // NAME
        if (name && productDB.name !== name) {
            const validateName = await Product.findOne({ name });
            if (validateName) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un producto con este nombre'
                });
            }
            campos.name = name;
        }

        // UPDATE        
        const productUpdate = await Product.findByIdAndUpdate(pid, campos, { new: true, useFindAndModify: false });

        const product = await Product.findById(pid)
            .populate('categoria')
            .populate('subcategoria');

        res.json({
            ok: true,
            product
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};
/** =====================================================================
 *  UPDATE PRODUCT
=========================================================================*/

/** =====================================================================
 *  DELETE PRODUCT
=========================================================================*/
const deleteProduct = async(req, res = response) => {

    const _id = req.params.id;

    try {

        // SEARCH PRODUCT
        const productDB = await Product.findById({ _id });
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun producto con este ID'
            });
        }
        // SEARCH PRODUCT

        // CHANGE STATUS
        if (productDB.status === true) {
            productDB.status = false;
        } else {
            productDB.status = true;
        }
        // CHANGE STATUS

        const productUpdate = await Product.findByIdAndUpdate(_id, productDB, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            product: productUpdate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** =====================================================================
 *  DELETE PRODUCT
=========================================================================*/

// EXPORTS
module.exports = {
    getProducts,
    oneProduct,
    productsExcel,
    createProduct,
    createProductExcel,
    updateProduct,
    deleteProduct
};