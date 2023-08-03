const { Schema, model } = require('mongoose');

const TaxSchema = Schema({

    'tax-rate': {
        type: Number
    },

    'tax-category': {
        type: String
    },

    'tax-amount': {
        type: Number
    },

    'tax-description': {
        type: String
    },

    'tax-base': {
        type: Number
    },

    'base-amount': {
        type: Number
    },

    fecha: {
        type: Date,
        default: Date.now
    },

});

TaxSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.taxid = _id;
    return object;
});

module.exports = model('Taxes', TaxSchema);