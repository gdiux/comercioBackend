const Product = require('../models/products.model');
const Subcategory = require('../models/subcategory.model');
const LogProduct = require('../models/log.products.model');

/** =====================================================================
 *  UPDATE STOCK 
=========================================================================*/
const soldProduct = async(invoice) => {

    try {

        const products = invoice.items;

        for (const item of products) {

            const product = await Product.findOne({ sku: item.sku })
                .populate('categoria')
                .populate('subcategoria');

            product.inventory -= item.quantity;
            product.sold += item.quantity;
            product.save();

            const data = {
                sku: product.sku,
                name: product.name,
                description: `Factura #${invoice.invoice}`,
                type: 'Salida',
                befored: product.inventory + item.quantity,
                qty: item.quantity,
                stock: product.inventory,
                invoice: invoice._id,
                cajero: invoice.create,
                categoria: product.categoria.name || '',
                subcategoria: product.subcategoria.name || ''
            }


            const log = new LogProduct(data);
            await log.save();

        }

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }

};

// EXPORT
module.exports = {
    soldProduct
};