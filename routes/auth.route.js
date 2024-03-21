/** =====================================================================
 *  LOGIN ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarJWTClient } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { login, renewJWT, loginClient, renewJWTClient, rePass } = require('../controllers/auth.controller');

const router = Router();

/** =====================================================================
 *  LOGIN
=========================================================================*/
router.post('/', [
        check('email', 'El email es olbigatorio').not().isEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
);
/** =====================================================================
 *  LOGIN
=========================================================================*/

/** =====================================================================
 *  RECUPERAR CONTRASEÑA
=========================================================================*/
router.post('/recuperar/password', [
        check('email', 'El email es obligatorio').not().isEmpty(),
        validarCampos
    ],
    rePass
);

/** =====================================================================
 *  RENEW TOKEN
=========================================================================*/
router.get('/renew', validarJWT, renewJWT);
/** =====================================================================
*  RENEW TOKEN
=========================================================================*/
/** =====================================================================
 *  LOGIN
=========================================================================*/
router.post('/user', [
        check('email', 'El email es olbigatorio').not().isEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    loginClient
);
/** =====================================================================
 *  LOGIN
=========================================================================*/

/** =====================================================================
 *  RENEW TOKEN
=========================================================================*/
router.get('/user/renew', validarJWTClient, renewJWTClient);
/** =====================================================================
*  RENEW TOKEN
=========================================================================*/


// EXPORT
module.exports = router;