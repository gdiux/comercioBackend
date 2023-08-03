/** =====================================================================
 *  CATEGORIES ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getSubcategories, getSubcategoryId, createSubcategory, updateSubcategory } = require('../controllers/subcategory.controller');

const router = Router();

/** =====================================================================
 *  POST CATEGORIES
=========================================================================*/
router.post('/query', validarJWT, getSubcategories);
/** =====================================================================
 *  POST CATEGORIES
=========================================================================*/

/** =====================================================================
 *  GET CATEGORY ID
=========================================================================*/
router.get('/:id', validarJWT, getSubcategoryId);
/** =====================================================================
 *  GET CATEGORY ID
=========================================================================*/

/** =====================================================================
 *  POST CREATE CATEGORY
=========================================================================*/
router.post('/', [
        validarJWT,
        check('name', 'El nombre es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    createSubcategory
);
/** =====================================================================
 *  POST CREATE CATEGORY
=========================================================================*/

/** =====================================================================
 *  PUT CATEGORY
=========================================================================*/
router.put('/:id', validarJWT, updateSubcategory);
/** =====================================================================
 *  PUT CATEGORY
=========================================================================*/


// EXPORT
module.exports = router;