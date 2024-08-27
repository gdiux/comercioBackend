const Client = require('../models/clients.model');
const Invoice = require('../models/invoice.model');

const validateClients = async() => {

    try {

        const clients = await Client.find({ status: true });

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

        for (let i = 0; i < clients.length; i++) {
            const client = clients[i];

            // OBTENER TODAD LAS FACTURAS DE CADA CLIENTE
            const invoices = await Invoice.find({
                fecha: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                },
                client: client._id,
                status: true
            });

            // CALCULAR COMPRAS
            let total = 0;
            for (let e = 0; e < invoices.length; e++) {
                const invoice = invoices[e];
                total += (invoice.amount)
            }

            // VERIFICAR SI ESTA ACTIVO
            let activo = false;
            if (total > 100000) {
                activo = true;
            }

            // SI EL ESTADO ACTIVO ES DIFERENTE A LA VARIABLE SI ACTUALIZA AL USUARIO
            if (client.activo !== activo) {
                await Client.findByIdAndUpdate(client._id, { activo }, { new: true, useFindAndModify: false });
            }

        }

    } catch (error) {
        console.log(error);
    }

};

module.exports = {
    validateClients
};