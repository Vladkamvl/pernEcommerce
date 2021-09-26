const uuid = require('uuid');
const path = require('path');
const ApiError = require("../error/ApiError");
const {Device} = require("../models/models");

class DeviceController{
    async create(req, res, next){
        try{
            const {name, price, typeId, brandId, info} = req.body;
            const {img} = req.files;
            let filename = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', filename));

            const device = await Device.create({name, price, typeId, brandId, img: filename});

            return res.json(device);
        }catch (e){
            next(ApiError.badRequest(e));
        }
    }
    async getAll(req, res){

    }
    async getOne(req, res){
        
    }
}

module.exports = new DeviceController();