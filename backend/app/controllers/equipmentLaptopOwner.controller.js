const {
    LaptopOwner
} = require("../models/laptopOwner.model");
const {
    Equipment
} = require("../models/equipment.model");
const {
    validateEquipmentLaptopOwner,
    EquipmentLaptopOwner
} = require("../models/equipmentOwner.model");
const {
    validateObjectId
} = require("../utils/imports");

const { isValid } = require("rwandan-serial-number");

/***
 * Get all equipmentLaptopOwners
 * @param req
 * @param res
 */
exports.getAllEquipmentLaptopOwners = async (req, res) => {
    try {
        let {
            limit,
            page
        } = req.query;

        if (!page || page < 1) page = 1;

        if (!limit) limit = 10;

        const options = {
            page: page,
            limit: limit,
            populate: ['equipment', 'laptopOwner']
        };

        const data = await EquipmentLaptopOwner.paginate({}, options)

        res.send({
            data
        });
    } catch (e) {
        return res.status(500).send(e.toString().split('\"').join(''))
    }
}



/***
 *  Create's a new equipment
 * @param req
 * @param res
 */
exports.createEquipmentLaptopOwner = async (req, res) => {
    try {
        const {
            error
        } = validateEquipmentLaptopOwner(req.body);
        if (error) return res.status(400).send({
            message: error.details[0].message
        });

        if (!isValid(req.body.serialNumber))
            return res.status(400).send({
                message: 'Invalid Serial Number'
            });

        if (!validateObjectId(req.body.equipment))
            return res.status(400).send({
                message: 'Invalid equipment id'
            });

        if (!validateObjectId(req.body.laptopOwner))
            return res.status(400).send({
                message: 'Invalid laptopOwner id'
            });

        const equipment = await Equipment.findById(req.body.equipment);

        if (!equipment)
            return res.status(404).send({
                message: 'Equipment Not found'
            });

        const laptopOwner = await LaptopOwner.findById(req.body.laptopOwner);

        if (!laptopOwner)
            return res.status(404).send({
                message: 'LaptopOwner Not found'
            });

        const isDupplicate = await EquipmentLaptopOwner.findOne({
            equipmentSerialNumber: req.body.equipmentSerialNumber
        });

        if (isDupplicate)
            return res.status(404).send({
                message: 'equipmentSerialNumber is already used'
            });

        const newEquipmentLaptopOwner = new EquipmentLaptopOwner(req.body);

        const result = await EquipmentLaptopOwner.save();

        return res.status(201).send({
            message: 'CREATED',
            data: {...result._doc,laptopOwner,equipment}
        });
    } catch (e) {
        return res.status(500).send(e.toString().split('\"').join(''))
    }
}

/***
 *  updates's a new equipment
 * @param req
 * @param res
 */
exports.updateEquipmentLaptopOwner = async (req, res) => {
    try {

        if (!validateObjectId(req.params.id))
            return res.status(400).send({
                message: 'Invalid id'
            });

        const {
            error
        } = validateEquipmentLaptopOwner(req.body);
        if (error) return res.status(400).send({
            message: error.details[0].message
        });

        if (!isValid(req.body.equipmentSerialNumber))
            return res.status(400).send({
                message: 'Invalid Serial Number'
            });

        if (!validateObjectId(req.body.equipment))
            return res.status(400).send({
                message: 'Invalid equipment id'
            });

        if (!validateObjectId(req.body.laptopOwner))
            return res.status(400).send({
                message: 'Invalid laptopOwner id'
            });

        const equipment = await Equipment.findById(req.body.equipment);

        if (!equipment)
            return res.status(404).send({
                message: 'Equipment Not found'
            });

        const laptopOwner = await LaptopOwner.findById(req.body.laptopOwner);

        if (!laptopOwner)
            return res.status(404).send({
                message: 'LaptopOwner Not found'
            });

        const isDupplicate = await EquipmentLaptopOwner.findOne({
            _id: {
                $ne: req.params.id
            },
            equipmentSerialNumber: req.body.equipmentSerialNumber
        });

        if (isDupplicate)
            return res.status(404).send({
                message: 'EquipmentSerialNumber is already used'
            });

        const result = await EquipmentLaptopOwner.findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true
        });
        if (!result)
            return res.status(404).send({
                message: 'EquipmentLaptopOwner Not found'
            });

        return res.status(200).send({
            message: 'UPDATED',
            data: {...result,laptopOwner,equipment}
        });
    } catch (e) {
        return res.status(500).send(e.toString().split('\"').join(''))
    }
}

/***
 *  updates's a new equipment
 * @param req
 * @param res
 */
exports.deleteEquipmentLaptopOwner = async (req, res) => {
    try {

        if (!validateObjectId(req.params.id))
            return res.status(400).send({
                message: 'Invalid id'
            });

        const result = await EquipmentLaptopOwner.findOneAndDelete({
            _id: req.params.id
        });
        if (!result)
            return res.status(404).send({
                message: 'equipmentLaptopOwner not found'
            });

        return res.send({
            message: 'DELETED',
            data: result
        });
    } catch (e) {
        return res.status(500).send(e.toString().split('\"').join(''))
    }
}