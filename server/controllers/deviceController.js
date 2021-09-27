const uuid = require('uuid');
const path = require('path');
const ApiError = require("../error/ApiError");
const {Device, DeviceInfo} = require("../models/models");

class DeviceController{
    async create(req, res, next){
        try{
            let {name, price, typeId, brandId, info} = req.body;
            const {img} = req.files;
            let filename = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', filename));

            const device = await Device.create({name, price, typeId, brandId, img: filename});

            if(info){
                info = JSON.parse(info);
                info.forEach(e =>
                    DeviceInfo.create({
                        title: e.title,
                        description: e.descripion,
                        deviceId: device.id,
                    })
                );
            }

            return res.json(device);
        }catch (e){
            next(ApiError.badRequest(e));
        }
    }
    async getAll(req, res){
        let {brandId, typeId, limit, page} = req.query;
        limit = limit || 9;
        page = page || 1;
        let offset = page * limit - limit;

        let devices;

        if(!brandId && !typeId){
            devices = await  Device.findAndCountAll({
                limit,
                offset,
            });
        }else if(typeId && !brandId){
            devices = await Device.findAndCountAll({
                where: {
                    typeId,
                },
                limit,
                offset,
            });
        }else if(brandId && !typeId){
            devices = await Device.findAndCountAll({
                where: {
                    brandId,
                },
                limit,
                offset,
            });
        }else if(brandId && typeId){
            devices = await Device.findAndCountAll({
                where: {
                    typeId,
                    brandId,
                },
                limit,
                offset,
            });
        }

        return res.json(devices);
    }
    async getOne(req, res){
        const {id} = req.params;

        const device = await Device.findOne({
            where: {
                id,
            },
            include:[
                {
                    model: DeviceInfo,
                    as: 'info',
                },
            ],
        });

        return res.json(device);
    }
}

module.exports = new DeviceController();