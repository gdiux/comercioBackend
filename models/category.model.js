const { Schema, model } = require('mongoose');

const CategorySchema = Schema({

    name: {
        type: String,
        require: true,
    },

    img: {
        type: String
    },

    status: {
        type: Boolean,
        default: true
    },

    fecha: {
        type: Date,
        default: Date.now
    },

});

CategorySchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.catid = _id;
    return object;

});

module.exports = model('Categorias', CategorySchema);