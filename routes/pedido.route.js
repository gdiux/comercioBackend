/** =====================================================================
 *  PEDIDO ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWTClient } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getPedido, getPedidoId, createPedido, updatePedido } = require('../controllers/pedidos.controller');

const router = Router();

/** =====================================================================
 *  POST PEDIDO
=========================================================================*/
router.post('/query', validarJWTClient, getPedido);
/** =====================================================================
 *  POST PEDIDO
=========================================================================*/

/** =====================================================================
 *  GET PEDIDO ID
=========================================================================*/
router.get('/:id', validarJWTClient, getPedidoId);
/** =====================================================================
 *  GET PEDIDO ID
=========================================================================*/

/** =====================================================================
 *  POST CREATE PEDIDO
=========================================================================*/
router.post('/', [
        validarJWTClient
    ],
    createPedido
);
/** =====================================================================
 *  POST CREATE PEDIDO
=========================================================================*/

/** =====================================================================
 *  PUT PEDIDO
=========================================================================*/
router.put('/:id', validarJWTClient, updatePedido);
/** =====================================================================
 *  PUT PEDIDO
=========================================================================*/

// EXPORT
module.exports = router;