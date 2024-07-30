const Client = require('../models/clients.model');
const Invoice = require('../models/invoice.model');

/** =====================================================================
 *  UPDATE WALLET
=========================================================================*/
const updateWalletReffer = async(cid, amount) => {

    try {

        const client = await Client.findById(cid);
        if (!client.referredBy) {
            return true;
        };

        // 1er Nivel
        const refferOne = await Client.findOne({ referralCode: client.referredBy });

        //VALIDAR SI ESTA ACTO PARA RECIBIR LA COMISION
        let calM = (1000 * 60 * 60 * 24 * 30);
        let initial = `${new Date().getMonth()}/1/${new Date().getFullYear()}`;
        let end = `${new Date().getMonth()}/31/${new Date().getFullYear()}`;

        if (((new Date().getTime() - new Date(refferOne.fecha).getTime()) / calM) > 1) {

            let invoices = await Invoice.find({
                $and: [{ fecha: { $gte: new Date(initial), $lt: new Date(end) } }],
                status: true,
                client: refferOne._id
            })

            let amountTemp = 0;

            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i];
                amountTemp += invoice.amount
            }

            if (amountTemp < 100000) {
                return;
            }

        } else {

            let invoices = await Invoice.find({
                status: true,
                client: refferOne._id
            })

            let amountTemp = 0;

            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i];
                amountTemp += invoice.amount
            }

            if (amountTemp < 100000) {
                return;
            }

        }

        refferOne.walletBalance += parseFloat((amount * 0.02).toFixed(2));
        refferOne.save();

        if (!refferOne.referredBy) {
            return true;
        }

        // 2do Nivel
        const refferTwo = await Client.findOne({ referralCode: refferOne.referredBy });

        // VALIDAR SI RECIBE COMISION
        if (((new Date().getTime() - new Date(refferTwo.fecha).getTime()) / calM) > 1) {
            let invoices = await Invoice.find({
                $and: [{ fecha: { $gte: new Date(initial), $lt: new Date(end) } }],
                status: true,
                client: refferTwo._id
            })

            let amount = 0;

            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i];
                amount += invoice.amount
            }

            if (amount < 100000) {
                return;
            }

        } else {

            let invoices = await Invoice.find({
                status: true,
                client: refferOne._id
            })

            let amountTemp = 0;

            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i];
                amountTemp += invoice.amount
            }

            if (amountTemp < 100000) {
                return;
            }

        }

        refferTwo.walletBalance += parseFloat((amount * 0.02).toFixed(2));
        refferTwo.save();

        if (!refferTwo.referredBy) {
            return true;
        }

        // 3er Nivel
        const refferThree = await Client.findOne({ referralCode: refferTwo.referredBy });
        // VALIDAR SI RECIBE COMISION
        if (((new Date().getTime() - new Date(refferThree.fecha).getTime()) / calM) > 1) {
            let invoices = await Invoice.find({
                $and: [{ fecha: { $gte: new Date(initial), $lt: new Date(end) } }],
                status: true,
                client: refferThree._id
            })

            let amount = 0;

            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i];
                amount += invoice.amount
            }

            if (amount < 100000) {
                return;
            }

        } else {

            let invoices = await Invoice.find({
                status: true,
                client: refferOne._id
            })

            let amountTemp = 0;

            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i];
                amountTemp += invoice.amount
            }

            if (amountTemp < 100000) {
                return;
            }

        }

        refferThree.walletBalance += parseFloat((amount * 0.02).toFixed(2));
        refferThree.save();

        if (!refferThree.referredBy) {
            return true;
        }

        // 4to Nivel
        const refferfour = await Client.findOne({ referralCode: refferThree.referredBy });

        // VALIDAR SI RECIBE COMISION
        if (((new Date().getTime() - new Date(refferfour.fecha).getTime()) / calM) > 1) {
            let invoices = await Invoice.find({
                $and: [{ fecha: { $gte: new Date(initial), $lt: new Date(end) } }],
                status: true,
                client: refferfour._id
            })

            let amount = 0;

            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i];
                amount += invoice.amount
            }

            if (amount < 100000) {
                return;
            }

        } else {

            let invoices = await Invoice.find({
                status: true,
                client: refferOne._id
            })

            let amountTemp = 0;

            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i];
                amountTemp += invoice.amount
            }

            if (amountTemp < 100000) {
                return;
            }

        }

        refferfour.walletBalance += parseFloat((amount * 0.03).toFixed(2));
        refferfour.save();

        if (!refferfour.referredBy) {
            return true;
        }

        return true;


    } catch (error) {
        console.log(error);
        return false;
    }

};

const updateWalletClient = async(cid, amount) => {

    try {

        const client = await Client.findById(cid);
        if (!client) {
            return true;
        };

        client.walletBalance -= amount;
        client.save();

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }

}

/** =====================================================================
 *  UPDATE WALLET CLIENT
=========================================================================*/

// EXPORT
module.exports = {
    updateWalletReffer,
    updateWalletClient
};