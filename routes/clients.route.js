/** =====================================================================
 *  CLIENTS ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarJWTClient } = require('../middlewares/validar-jwt');

// CONTROLLER
const { getClients, createClient, updateClient, deleteClient, createClientWeb, nivelesClient } = require('../controllers/clients.controller');

const router = Router();

/** =====================================================================
 *  GET CLIENTS
=========================================================================*/
router.get('/', validarJWT, getClients);
/** =====================================================================
 *  GET CLIENTS
=========================================================================*/

/** =====================================================================
 *  GET CLIENTS
=========================================================================*/
router.get('/level/:cid', nivelesClient);
/** =====================================================================
 *  GET CLIENTS
=========================================================================*/

/** =====================================================================
 *  CREATE CLIENT
=========================================================================*/
router.post('/', [
        check('name', 'El nombre es olbigatorio').not().isEmpty(),
        check('phone', 'El telefono es obligatorio').not().isEmpty(),
        validarCampos
    ],
    createClient
);
/** =====================================================================
 *  CREATE CLIENT
=========================================================================*/
/** =====================================================================
 *  CREATE CLIENT WEB
=========================================================================*/
router.post('/web', [
        check('name', 'El nombre es olbigatorio').not().isEmpty(),
        check('phone', 'El telefono es obligatorio').not().isEmpty(),
        check('email', 'El correo es obligatorio').not().isEmpty(),
        validarCampos
    ],
    createClientWeb
);
/** =====================================================================
 *  CREATE CLIENT WEB
=========================================================================*/

/** =====================================================================
 *  UPDATE CLIENT
=========================================================================*/
router.put('/:id', [
        validarJWT,
        check('name', 'El nombre es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    updateClient
);
/** =====================================================================
 *  UPDATE CLIENT
=========================================================================*/

/** =====================================================================
 *  UPDATE CLIENT
=========================================================================*/
router.put('/web/:id', [
        validarJWTClient,
        check('name', 'El nombre es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    updateClient
);
/** =====================================================================
*  UPDATE CLIENT
=========================================================================*/

/** =====================================================================
 *  DELETE CLIENT
=========================================================================*/
router.delete('/:id', validarJWT, deleteClient);
/** =====================================================================
 *  DELETE CLIENT
=========================================================================*/

// EXPORTS
module.exports = router;