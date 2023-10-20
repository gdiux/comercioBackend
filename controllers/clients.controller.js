const { response } = require('express');
const bcrypt = require('bcryptjs');
const short = require('short-uuid');

const Client = require('../models/clients.model');

/** =====================================================================
 *  GET CLIENTS
=========================================================================*/
const getClients = async(req, res = response) => {

    try {

        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limite) || 10;

        const [clients, total] = await Promise.all([

            Client.find()
            .skip(desde)
            .limit(limit),

            Client.countDocuments()
        ]);

        res.json({
            ok: true,
            clients,
            total
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente de nuevo'
        });

    }

};
/** =====================================================================
 *  GET CLIENTS
=========================================================================*/
/** =====================================================================
 *  CREATE CLIENT
=========================================================================*/
const createClient = async(req, res = response) => {

    let { cedula, email, password } = req.body;

    email = email.trim().toLowerCase();
    cedula = cedula.trim().toLowerCase();

    try {

        // VALIDATE CEDULA
        const validarCedula = await Client.findOne({ cedula });
        if (validarCedula) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con este numero de cedula de ciudadania'
            });
        }

        // VALIDATE CEDULA
        const validarEmail = await Client.findOne({ email });
        if (validarEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con este email'
            });
        }

        // SAVE CLIENT
        const client = new Client(req.body);

        // ENCRYPTAR PASSWORD
        if (!password) {
            password = short.generate();
        }

        const salt = bcrypt.genSaltSync();
        client.password = bcrypt.hashSync(password, salt);

        client.referralCode = short.generate();
        client.email = email;
        client.cedula = cedula;
        

        await client.save();

        res.json({
            ok: true,
            client
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};
/** =====================================================================
 *  CREATE CLIENT
=========================================================================*/

/** =====================================================================
 *  UPDATE CLIENT
=========================================================================*/
const updateClient = async(req, res = response) => {

    const cid = req.params.id;

    try {

        // SEARCH CLIENT
        const clientDB = await Client.findById({ _id: cid });
        if (!clientDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }
        // SEARCH CLIENT

        // VALIDATE CEDULA
        const { cedula, ...campos } = req.body;
        if (clientDB.cedula !== cedula) {
            const validarCedula = await Client.findOne({ cedula });
            if (validarCedula) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con este numero de cedula de ciudadania'
                });
            }
        }

        // UPDATE
        campos.cedula = cedula;
        const clientUpdate = await Client.findByIdAndUpdate(cid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            client: clientUpdate
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** =====================================================================
 *  UPDATE CLIENT
=========================================================================*/

/** =====================================================================
 *  DELETE CLIENT
=========================================================================*/
const deleteClient = async(req, res = response) => {

    const cid = req.params.id;

    try {

        // SEARCH CLIENT
        const clientDB = await Client.findById({ _id: cid });
        if (!clientDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }
        // SEARCH CLIENT

        // CHANGE STATUS
        if (clientDB.status === true) {
            clientDB.status = false;
        } else {
            clientDB.status = true;
        }
        // CHANGE STATUS

        const clientUpdate = await Client.findByIdAndUpdate(cid, clientDB, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            client: clientUpdate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** =====================================================================
 *  DELETE CLIENT
=========================================================================*/

// EXPORTS
module.exports = {
    getClients,
    createClient,
    updateClient,
    deleteClient
};