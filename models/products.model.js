const { Schema, model } = require('mongoose');

const ImgSchema = Schema({
    img: {
        type: String
    },

    fecha: {
        type: Date,
        default: Date.now()
    }
});

const ProductSchema = Schema({

    sku: {
        type: String,
        require: true,
        unique: true
    },

    name: {
        type: String,
        require: true,
    },

    type: {
        type: String,
        require: true,
    },

    description: {
        type: String,
        require: true,
    },

    price: {
        type: Number,
        require: true,
    },

    cost: {
        type: Number,
        require: true,
    },

    wholesale: {
        type: Number,
        default: 0
    },

    inventory: {
        type: Number,
    },

    stock: {
        type: Number,
    },

    bought: {
        type: Number,
        default: 0
    },

    sold: {
        type: Number,
        default: 0
    },

    returned: {
        type: Number,
        default: 0
    },

    damaged: {
        type: Number,
        default: 0
    },

    min: {
        type: Number,
    },

    taxes: {
        type: Boolean,
        default: false
    },

    tax: {
        type: Schema.Types.ObjectId,
        ref: 'Taxes'
    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categorias'
    },

    subcategoria: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategorias'
    },

    visibility: {
        type: Boolean,
        default: true
    },

    status: {
        type: Boolean,
        default: true
    },

    img: [ImgSchema],

    date: {
        type: Date,
        default: Date.now
    }

});

ProductSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.pid = _id;
    return object;

});

module.exports = model('Product', ProductSchema);