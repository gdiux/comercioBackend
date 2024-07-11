const { Schema, model } = require('mongoose');

const ClientSchema = Schema({

    name: {
        type: String,
        require: true
    },

    lastname: {
        type: String,
    },

    cedula: {
        type: String,
        unique: true
    },

    phone: {
        type: String
    },

    email: {
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String
    },

    address: {
        type: String
    },

    city: {
        type: String
    },

    department: {
        type: String
    },

    party_type: {
        type: String,
        default: 'PERSONA_NATURAL'
    },

    referralCode: {
        type: String
    },

    referredBy: {
        type: String
    },

    walletBalance: {
        type: Number,
        default: 0
    },

    status: {
        type: Boolean,
        default: true
    },

    fecha: {
        type: Date,
        default: Date.now
    }

});

ClientSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.cid = _id;
    return object;

});

module.exports = model('Clients', ClientSchema);