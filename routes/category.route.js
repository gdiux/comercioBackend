/** =====================================================================
 *  CATEGORIES ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getCategories, getCategoryId, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');

const router = Router();

/** =====================================================================
 *  POST CATEGORIES
=========================================================================*/
router.post('/query', getCategories);
/** =====================================================================
 *  POST CATEGORIES
=========================================================================*/

/** =====================================================================
 *  GET CATEGORY ID
=========================================================================*/
router.get('/:id', validarJWT, getCategoryId);
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
    createCategory
);
/** =====================================================================
 *  POST CREATE CATEGORY
=========================================================================*/

/** =====================================================================
 *  PUT CATEGORY
=========================================================================*/
router.put('/:id', validarJWT, updateCategory);
/** =====================================================================
 *  PUT CATEGORY
=========================================================================*/

/** =====================================================================
 *  DELETE CATEGORY
=========================================================================*/
router.delete('/:id', validarJWT, deleteCategory);
/** =====================================================================
 *  DELETE CATEGORY
=========================================================================*/



// EXPORT
module.exports = router;