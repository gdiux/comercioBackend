const { Schema, model } = require('mongoose');

const SubcategorySchema = Schema({

    name: {
        type: String,
        require: true,
    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categorias'
    },

    icon: {
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

SubcategorySchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.subcaid = _id;
    return object;
});

module.exports = model('Subcategorias', SubcategorySchema);