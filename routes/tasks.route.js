/** =====================================================================
 *  TASKS ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getTasks, getTaskId, createTask, updateTask, deleteTask } = require('../controllers/tasks.controller');

const router = Router();

/** =====================================================================
 *  POST PREFIX
=========================================================================*/
router.post('/query', validarJWT, getTasks);
/** =====================================================================
 *  POST PREFIX
=========================================================================*/

/** =====================================================================
 *  GET TASK ID
=========================================================================*/
router.get('/:id', validarJWT, getTaskId);
/** =====================================================================
 *  GET TASK ID
=========================================================================*/

/** =====================================================================
 *  POST CREATE TASK
=========================================================================*/
router.post('/', [
        validarJWT,
        check('para', 'El para es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    createTask
);
/** =====================================================================
 *  POST CREATE TASK
=========================================================================*/

/** =====================================================================
 *  PUT TASK
=========================================================================*/
router.put('/:id', validarJWT, updateTask);
/** =====================================================================
 *  PUT TASK
=========================================================================*/

/** =====================================================================
 *  DELETE TASK
=========================================================================*/
router.delete('/:id', validarJWT, deleteTask);
/** =====================================================================
 *  DELETE TASK
=========================================================================*/



// EXPORT
module.exports = router;