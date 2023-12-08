const Product = require('../models/products.model');

/** =====================================================================
 *  UPDATE STOCK 
=========================================================================*/
const soldProduct = async(products) => {

    try {

        for (const item of products) {

            const product = await Product.findOne({ sku: item.sku });

            product.inventory -= item.quantity;
            product.sold += item.quantity;
            product.save();

            return true;
        }

    } catch (error) {
        console.log(error);
        return false;
    }

};

// EXPORT
module.exports = {
    soldProduct
};