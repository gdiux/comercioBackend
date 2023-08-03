/** =====================================================================
 *  PRODUCTS ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLER
const { getProducts, oneProduct, createProduct, updateProduct, deleteProduct, createProductExcel } = require('../controllers/products.controller');

const router = Router();

/** =====================================================================
 *  ONE GET PRODUCT
=========================================================================*/
router.get('/:id', validarJWT, oneProduct);
/** =====================================================================
 *  ONE GET PRODUCT
=========================================================================*/

/** =====================================================================
 *  CREATE PRODUCTS
=========================================================================*/
router.post('/', [
        validarJWT,
        check('sku', 'El codigo es obligatorio').not().isEmpty(),
        validarCampos
    ],
    createProduct
);
/** =====================================================================
 *  CREATE PRODUCTS
=========================================================================*/

/** =====================================================================
 *  GET PRODUCTS
=========================================================================*/
router.post('/query', validarJWT, getProducts);
/** =====================================================================
 *  GET PRODUCTS 
=========================================================================*/

/** =====================================================================
 *  GET PRODUCTS
=========================================================================*/
router.post('/query/excel', validarJWT, getProducts);
/** =====================================================================
 *  GET PRODUCTS 
=========================================================================*/

/** =====================================================================
 *  CREATE PRODUCTS EXCEL
=========================================================================*/
router.post('/create/excel', validarJWT, createProductExcel);
/** =====================================================================
*  CREATE PRODUCTS EXCEL
=========================================================================*/

/** =====================================================================
 *  UPDATE PRODUCT
=========================================================================*/
router.put('/:id', [
        validarJWT,
        check('sku', 'El codigo es obligatorio').not().isEmpty(),
        validarCampos
    ],
    updateProduct
);
/** =====================================================================
 *  UPDATE PRODUCT
=========================================================================*/

/** =====================================================================
 *  DELETE PRODUCT
=========================================================================*/
router.delete('/:id', validarJWT, deleteProduct);
/** =====================================================================
 *  DELETE PRODUCT
=========================================================================*/


// EXPORT
module.exports = router;