const Client = require('../models/clients.model');

/** =====================================================================
 *  GET REFERIDOS
=========================================================================*/
const getReferidos = async(referredBy) => {

    try {

        let referidos = [];
        referidos = await Client.find({ referredBy });

        if (referidos.length === 0) {
            referidos = [];
        }

        return referidos;

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente de nuevo'
        });
    }

};

// EXPORT
module.exports = {
    getReferidos
};