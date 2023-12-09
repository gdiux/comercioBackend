const Client = require('../models/clients.model');

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
        refferOne.walletBalance += parseFloat((amount * 0.04).toFixed(2));
        refferOne.save();

        if (!refferOne.referredBy) {
            return true;
        }

        // 2do Nivel
        const refferTwo = await Client.findOne({ referralCode: refferOne.referredBy });
        refferTwo.walletBalance += parseFloat((amount * 0.03).toFixed(2));
        refferTwo.save();

        if (!refferTwo.referredBy) {
            return true;
        }

        // 3er Nivel
        const refferThree = await Client.findOne({ referralCode: refferTwo.referredBy });
        refferThree.walletBalance += parseFloat((amount * 0.02).toFixed(2));
        refferThree.save();

        if (!refferThree.referredBy) {
            return true;
        }

        // 4to Nivel
        const refferfour = await Client.findOne({ referralCode: refferThree.referredBy });
        refferfour.walletBalance += parseFloat((amount * 0.01).toFixed(2));
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