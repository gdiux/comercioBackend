const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/users.model');
const Client = require('../models/clients.model');

const { generarJWT, generarJWTClient } = require('../helpers/jwt');

/** =====================================================================
 *  REEBOOT PASSWORD
=========================================================================*/
const rePass = async(req, res = response) => {

    try {

        const email = req.body.email;

        // VALIDATE USER
        const clientDB = await Client.findOne({ email });
        if (!clientDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun usuario con este email.'
            });

        }
        // VALIDATE USER

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = Math.random().toString(36).replace(/[.!"#$%&/()=]+/g, '');

        const salt = bcrypt.genSaltSync();
        clientDB.password = bcrypt.hashSync(result, salt);

        // ========================= NODEMAILER =================================

        const msg = 'Se ha enviado un correo electronico a su email con la nueva contraseña';
        const subject = 'Recuperar contraseña '; // Subject line
        const html = `<div style="box-sizing:border-box;margin:0;font-family: Montserrat,-apple-system,BlinkMacSystemFont;font-size:1rem;font-weight:400;line-height:1.5;text-align:left;background-color:#fff;color:#333">
                <div class="adM">
                    <center>
                        <img src="https://comerciollanero.com/assets/img/logo.webp" style="max-width: 250px;">
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
                            <h2 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:2rem;text-align:center!important">Recuperar Contraseña</h2>
                        </div>
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                            <h3 style="text-transform: capitalize; box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:2rem;margin:20px 0">Hola ${client.name} ${client.lastname}</h3>
                            <h5 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:1.25rem;margin:20px 0">Hemos recibido su solicitud de recuperación de contraseña.</h5>
                            <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                                <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                                </div>
                            </div>
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">Tu nueva contraseña es: ${result}</p>
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

        await workerDB.save();

        res.json({
            ok: true,
            msg: 'Hemos enviado al correo la nueva contraseña, verifica la carpeta de correos spam'
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }

};

/** =====================================================================
 *  LOGIN
=========================================================================*/
const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // VALIDATE USER
        const userDB = await User.findOne({ email });
        if (!userDB) {

            return res.status(404).json({
                ok: false,
                msg: 'El email o la contraseña es incorrecta'
            });

        }
        // VALIDATE USER

        // PASSWORD
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El email o la contraseña es incorrecta'
            });
        } else {

            if (userDB.status) {
                const token = await generarJWT(userDB.id);

                res.json({
                    ok: true,
                    token
                });
            } else {
                return res.status(401).json({
                    ok: false,
                    msg: 'Tu cuenta a sido desactivada por un administrador'
                });
            }

        }

        // JWT - JWT

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }


};
/** =====================================================================
 *  LOGIN
=========================================================================*/

/** =====================================================================
 *  RENEW TOKEN
======================================================================*/
const renewJWT = async(req, res = response) => {

    const uid = req.uid;

    // GENERAR TOKEN - JWT
    const token = await generarJWT(uid);

    // SEARCH USER
    const usuario = await User.findById(uid, 'email name role img address uid valid fecha status');
    // SEARCH USER

    res.status(200).json({
        ok: true,
        token,
        usuario
    });

};
/** =====================================================================
 *  RENEW TOKEN
=========================================================================*/

/** =====================================================================
 *  LOGIN CLIENT
=========================================================================*/
const loginClient = async(req, res = response) => {

    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    try {

        // VALIDATE USER
        const clientDB = await Client.findOne({ email });
        if (!clientDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El email o la contraseña es incorrecta'
            });

        }
        // VALIDATE USER

        // PASSWORD
        const validPassword = bcrypt.compareSync(password, clientDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El email o la contraseña es incorrecta'
            });
        } else {

            if (clientDB.status) {
                const token = await generarJWTClient(clientDB.id);

                res.json({
                    ok: true,
                    token
                });
            } else {
                return res.status(401).json({
                    ok: false,
                    msg: 'Tu cuenta a sido desactivada por un administrador'
                });
            }

        }

        // JWT - JWT

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }


};
/** =====================================================================
 *  LOGIN
=========================================================================*/

/** =====================================================================
 *  RENEW TOKEN
======================================================================*/
const renewJWTClient = async(req, res = response) => {

    const cid = req.cid;

    // GENERAR TOKEN - JWT
    const token = await generarJWTClient(cid);

    // SEARCH CLIENT
    const usuario = await Client.findById(cid, 'name lastname cedula phone email address city department referralCode referredBy walletBalance status cid fecha'); // SEARCH CLIENT

    res.status(200).json({
        ok: true,
        token,
        usuario
    });

};
/** =====================================================================
 *  RENEW TOKEN
=========================================================================*/


module.exports = {
    login,
    renewJWT,
    loginClient,
    renewJWTClient,
    rePass
};