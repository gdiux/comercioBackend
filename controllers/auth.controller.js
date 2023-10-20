const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/users.model');
const Client = require('../models/clients.model');

const { generarJWT } = require('../helpers/jwt');

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
 *  LOGIN
=========================================================================*/
const loginClient = async(req, res = response) => {

    const { email, password } = req.body;

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
                const token = await generarJWT(clientDB.id);

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
    const token = await generarJWT(uid);

    // SEARCH CLIENT
    const usuario = await Client.findById(uid, 'email name role img address uid valid fecha status');
    // SEARCH CLIENT

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
    renewJWT
};