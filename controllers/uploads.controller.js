//

const path = require('path');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

const sharp = require('sharp');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

// HELPERS
const { updateImage } = require('../helpers/update-image');

// MODELS
const Product = require('../models/products.model');

/** =====================================================================
 *  UPLOADS
=========================================================================*/
const fileUpload = async(req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;
    const desc = req.query.desc || 'img';

    const validType = ['products', 'logo', 'user'];

    // VALID TYPES
    if (!validType.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo es invalido'
        });
    }

    // VALIDATE IMAGE
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No has seleccionado ningún archivo'
        });
    }

    // PROCESS IMAGE
    const file = await sharp(req.files.image.data).metadata();

    // const nameShort = file.format.split('.');
    const extFile = file.format;

    // VALID EXT
    const validExt = ['jpg', 'png', 'jpeg', 'webp', 'bmp', 'svg'];
    if (!validExt.includes(extFile)) {
        return res.status(400).json({
            ok: false,
            msg: 'No se permite este tipo de imagen, solo extenciones JPG - PNG - WEBP - SVG'
        });
    }
    // VALID EXT

    // GENERATE NAME UID
    const nameFile = `${ uuidv4() }.webp`;

    // PATH IMAGE
    const path = `./uploads/${ tipo }/${ nameFile }`;

    // CONVERTIR A WEBP
    if (tipo === 'products') {

        sharp(req.files.image.data)
            .resize(300, 300)
            .webp({ equality: 75, effort: 6 })
            .toFile(path, (err, info) => {
    
                // UPDATE IMAGE
                updateImage(tipo, id, nameFile, desc);
    
                res.json({
                    ok: true,
                    msg: 'Imagen Actualizada',
                    nombreArchivo: nameFile,
                    date: Date.now()
                });
    
            });

    }else{

        // CONVERTIR A WEBP
        sharp(req.files.image.data)
            .resize(100, 100)
            .webp({ equality: 75, effort: 6 })
            .toFile(path, (err, info) => {
    
                // UPDATE IMAGE
                updateImage(tipo, id, nameFile, desc);
    
                res.json({
                    ok: true,
                    msg: 'Imagen Actualizada',
                    nombreArchivo: nameFile,
                    date: Date.now()
                });
    
            });
    }

};
/** =====================================================================
 *  UPLOADS
=========================================================================*/
/** =====================================================================
 *  GET IMAGES
=========================================================================*/
const getImages = (req, res = response) => {

    const tipo = req.params.tipo;
    const image = req.params.image;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${image}`);

    // IMAGE DEFAULT
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {

        // CHECK TYPE
        if (tipo !== 'user') {
            const pathImg = path.join(__dirname, `../uploads/default.png`);
            res.sendFile(pathImg);
        } else {
            const pathImg = path.join(__dirname, `../uploads/user/user-default.png`);
            res.sendFile(pathImg);
        }

    }

};
/** =====================================================================
 *  GET IMAGES
=========================================================================*/

/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/
const deleteImg = async(req, res = response) => {

    try {

        const uid = req.uid;
        const type = req.params.type;
        const id = req.params.id;
        const img = req.params.img;

        switch (type) {
            case 'products':

                // COMPROVAR QUE EL ID ES VALIDO
                if (!ObjectId.isValid(id)) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Error en el ID del producto'
                    });
                }

                const productDB = await Product.findById(id);
                if (!productDB) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'No existe ningun producto con este ID'
                    });
                }

                const deleteImgProduct = await Product.updateOne({ _id: id }, { $pull: { img: { img } } });


                // VERIFICAR SI SE ACTUALIZO
                if (deleteImgProduct.nModified === 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No se pudo eliminar esta imagen, porfavor intente de nuevo'
                    });
                }

                // ELIMINAR IMAGEN DE LA CARPETA
                const path = `./uploads/${ type }/${ img }`;
                if (fs.existsSync(path)) {
                    // DELET IMAGE OLD
                    fs.unlinkSync(path);
                }

                const product = await Product.findById(id)
                    .populate('categoria')
                    .populate('tax')
                    .populate('subcategoria');

                res.json({
                    ok: true,
                    product
                });

                break;


            default:

                return res.status(400).json({
                    ok: false,
                    msg: 'Ha ocurrido un error, porfavor intente de nuevo'
                });
                break;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/


// EXPORTS
module.exports = {
    fileUpload,
    getImages,
    deleteImg
};