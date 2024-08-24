const { response } = require('express');
const bcrypt = require('bcryptjs');
const short = require('short-uuid');

const Client = require('../models/clients.model');
const { getReferidos } = require('../helpers/query-levels');
const { sendMail } = require('../helpers/send-mail');
const { generarJWTClient } = require('../helpers/jwt');

/** =====================================================================
 *  GET CLIENTS
=========================================================================*/
const getClients = async(req, res = response) => {

    try {

        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limite) || 10;

        const [clients, total] = await Promise.all([

            Client.find({ status: true })
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
 *  GET CLIENT BY ID
=========================================================================*/
const getClientId = async(req, res = response) => {

    try {
        const cid = req.params.id;

        const clientDB = await Client.findById(cid)
            .populate('carrito.items.product');
        if (!clientDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No hemos encontrado este cliente, porfavor intente nuevamente.'
            });
        }

        res.json({
            ok: true,
            client: clientDB
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
 *  CREATE CLIENT WEB
=========================================================================*/
const createClientWeb = async(req, res = response) => {

    let { email, password, cedula } = req.body;

    email = email.trim().toLowerCase();
    cedula = cedula.trim();

    try {

        // VALIDATE EMAIL
        const validarEmail = await Client.findOne({ email });
        if (validarEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con este email'
            });
        }

        // VALIDATE EMAIL
        const validarCedula = await Client.findOne({ cedula });
        if (validarCedula) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con este numero de CC ó Nit'
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

        // EMAIL DE BIENVENIDA ======================================================

        const msg = 'Gracias por registrarte en Comercio Llanero';
        const subject = 'Bienvenido'; // Subject line
        const html = `<div style="box-sizing:border-box;margin:0;font-family: Montserrat,-apple-system,BlinkMacSystemFont;font-size:1rem;font-weight:400;line-height:1.5;text-align:left;background-color:#fff;color:#333">
                <div class="adM">
                    <center>
                        <img src="https://comerciollanero.com/assets/img/logo.png" style="max-width: 250px;">
                    </center>
                </div>
                <div style="box-sizing:border-box;width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto;max-width:620px">
                    <div class="adM">
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div class="adM">
                        </div>
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center;padding-top:20px">
    
                        </div>
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;margin-top:40px;padding:20px 0;background-color:#2d2d2d;color:#fff">
                            <h2 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:2rem;text-align:center!important">Bienvenido (a)</h2>
                        </div>
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                            <h3 style="text-transform: capitalize; box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:2rem;margin:20px 0">Hola, ${client.name} ${client.lastname}</h3>
                            <h5 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:1.25rem;margin:20px 0">Gracias por registrate en nuestra plataforma</h5>
                            <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                                <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                                </div>
                            </div>
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">Eres importante para nosotros, nos gustaria que actualizaras toda la información... </p>
                            <a href="https://comerciollanero.com/login" style="box-sizing:border-box;text-decoration:none;display:inline-block;font-weight:400;text-align:center;white-space:nowrap;vertical-align:middle;border:1px solid transparent;color:#fff;line-height:1.5;margin:10px;border-radius:30px;background-color:#009BE0;border-color:#009BE0;font-size:0.95rem;padding:15px 20px"
                                target="_blank">Inciar sesion ahora</a>
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">tambien puedes copiar este enlace en tu URL</p>
                            <p> https://comerciollanero.com/login</p>
                        </div>
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;margin:40px 0;text-align:center">
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">Si esta solicitud se ha enviado sin su consentimiento, puede ignorar este correo electrónico ó eliminarlo. </p>
                        </div>
                    </div>
    
                </div>
                </div>`;

        const send_mail = await sendMail(email, subject, html, msg);

        const token = await generarJWTClient(client._id);

        res.json({
            ok: true,
            client,
            token
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
 *  CREATE CLIENT WEB
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
        const { cedula, password, ...campos } = req.body;
        if (cedula) {

            if (clientDB.cedula !== cedula) {
                const validarCedula = await Client.findOne({ cedula });
                if (validarCedula) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un usuario con este numero de cedula de ciudadania'
                    });
                }
            }

            campos.cedula = cedula;
        }

        if (password) {
            // ENCRYPTAR PASSWORD
            const salt = bcrypt.genSaltSync();
            campos.password = bcrypt.hashSync(password, salt);
        }

        // UPDATE

        await Client.findByIdAndUpdate(cid, campos, { new: true, useFindAndModify: false });
        const clientUpdate = await Client.findById(cid)
            .populate('carrito.items.product', 'name type description price cost wholesale inventory stock bought sold returned damaged min offert offertPrice offertPercent taxes tax categoria subcategoria visibility status date pid img');

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
    nivelesClient,
    getClientId
};