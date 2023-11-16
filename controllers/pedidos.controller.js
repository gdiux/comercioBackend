const { response } = require('express');

const Pedido = require('../models/pedidos.model');

const getPedido = async(req, res) => {

    try {

        const { desde, hasta, sort, ...query } = req.body;

        const [pedidos, total] = await Promise.all([
            Pedido.find(query)
            .populate('client')
            .populate('items.product')
            .sort(sort)
            .limit(hasta)
            .skip(desde),
            Pedido.countDocuments(query)
        ]);

        res.json({
            ok: true,
            pedidos,
            total
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
            .populate('client');
        if (!pedidoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No hemos encontrado este pedido, porfavor intente nuevamente.'
            });
        }

        res.json({
            ok: true,
            invoice: pedidoDB
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

        // SAVE INVOICE
        const pedido = new Pedido(req.body);
        pedido.client = cid;

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
        const pedidoUpdate = await Pedido.findByIdAndUpdate(peid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            pedido: pedidoUpdate
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
    updatePedido
};