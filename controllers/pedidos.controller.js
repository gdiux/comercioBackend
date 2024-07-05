const { response } = require('express');

const Pedido = require('../models/pedidos.model');
const { updateWalletClient } = require('../helpers/update-wallet');

const getPedido = async(req, res) => {

    try {

        const { desde, hasta, sort, ...query } = req.body;

        const [pedidos, total, pendientes, enviandos, entregados] = await Promise.all([
            Pedido.find(query)
            .populate('client')
            .populate('invoice')
            .populate('items.product')
            .sort(sort)
            .limit(hasta)
            .skip(desde),
            Pedido.countDocuments(),
            Pedido.countDocuments({ estado: 'Pendiente' }),
            Pedido.countDocuments({ estado: 'Enviando' }),
            Pedido.countDocuments({ estado: 'Entregado' })
        ]);

        res.json({
            ok: true,
            pedidos,
            total,
            pendientes,
            enviandos,
            entregados
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });

    }


};

const getPedidoId = async(req, res = response) => {

    try {
        const id = req.params.id;

        const pedidoDB = await Pedido.findById(id)
            .populate('items.product')
            .populate('invoice')
            .populate('client');
        if (!pedidoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No hemos encontrado este pedido, porfavor intente nuevamente.'
            });
        }

        res.json({
            ok: true,
            pedido: pedidoDB
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

const createPedido = async(req, res = response) => {

    try {

        const cid = req.cid;
        const { saldo, ...formaData } = req.body;

        // SAVE INVOICE
        const pedido = new Pedido(formaData);
        pedido.client = cid;

        if (saldo || saldo > 0) {
            pedido.saldo = saldo;
            await updateWalletClient(cid, saldo);
        }

        await pedido.save();

        res.json({
            ok: true,
            pedido
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
};

const updatePedido = async(req, res = response) => {

    const peid = req.params.id;

    try {

        // SEARCH PEDIDO
        const pedidoDB = await Pedido.findById(peid);
        if (!pedidoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun pedido con este ID'
            });
        }
        // SEARCH PEDIDO

        let {...campos } = req.body;

        // UPDATE
        await Pedido.findByIdAndUpdate(peid, campos, { new: true, useFindAndModify: false });

        // PEDIDO
        const pedido = await Pedido.findById(peid)
            .populate('items.product')
            .populate('invoice')
            .populate('client');

        res.json({
            ok: true,
            pedido
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }

};

const delPedido = async(req, res = response) => {

    try {

        const peid = req.params.id;

        // SEARCH PEDIDO
        const pedidoDB = await Pedido.findById(peid);
        if (!pedidoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun pedido con este ID'
            });
        }
        // SEARCH PEDIDO

        await Pedido.findByIdAndDelete(peid);

        res.json({
            ok: true,
            msg: 'El pedido se ha eliminado exitosamente!'
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }

};


// EXPORTS
module.exports = {
    getPedido,
    getPedidoId,
    createPedido,
    updatePedido,
    delPedido
};