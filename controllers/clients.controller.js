const { response } = require('express');
const bcrypt = require('bcryptjs');
const short = require('short-uuid');

const Client = require('../models/clients.model');
const { getReferidos } = require('../helpers/query-levels');

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
 *  GET NIVELES CLIENTS
=========================================================================*/
const nivelesClient = async(req, res = response) => {

    try {

        const cid = req.params.cid;

        let first = [];
        let two = [];
        let three = [];
        let four = [];

        // SEARCH CLIENT
        const clientDB = await Client.findById(cid);
        if (!clientDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }

        // LEVEL ONE
        first = await getReferidos(clientDB.referralCode);
        if (first.length > 0) {

            // PUSH LEVEL TWO
            for (const twoL of first) {
                let refer = await getReferidos(twoL.referralCode);
                if (refer.length > 0) {
                    for (const item of refer) {
                        two.push(item);
                    }
                }
            }
        }

        if (two.length > 0) {
            // PUSH LEVEL THREE
            for (const threeL of two) {
                let refer = await getReferidos(threeL.referralCode);
                if (refer.length > 0) {
                    for (const item of refer) {
                        three.push(item);

                    }
                }
            }
        }

        // LEVEL THREE
        if (three.length > 0) {

            // PUSH LEVEL FOUR
            for (const fourL of three) {
                let refer = await getReferidos(fourL.referralCode);
                if (refer.length > 0) {
                    for (const item of refer) {
                        four.push(item);
                    }
                }
            }
        }


        res.json({
            ok: true,
            first,
            two,
            three,
            four,
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
 *  GET NIVELES CLIENTS
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
 *  CREATE CLIENT
=========================================================================*/
const createClientWeb = async(req, res = response) => {

    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    try {

        // VALIDATE EMAIL
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
    createClientWeb,
    updateClient,
    deleteClient,
    nivelesClient
};