const { Schema, model, connection } = require('mongoose');

const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(connection);

const ItemsSchema = Schema({
    sku: {
        type: String
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    cost: {
        type: Number
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    description: {
        type: String
    }
});

const PedidosSchema = Schema({


    pedido: {
        type: Number
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Clients'
    },
    invoice: {
        type: Schema.Types.ObjectId,
        ref: 'Invoices'
    },
    amount: {
        type: Number
    },
    items: [ItemsSchema],
    estado: {
        type: String,
        default: 'Pendiente'
    },
    status: {
        type: Boolean,
        default: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    nota: {
        type: String
    },


});

PedidosSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.peid = _id;
    return object;

});

PedidosSchema.plugin(autoIncrement.plugin, {
    model: 'Pedidos',
    field: 'pedido',
    startAt: process.env.INVOICE_INIT
});

module.exports = model('Pedidos', PedidosSchema);