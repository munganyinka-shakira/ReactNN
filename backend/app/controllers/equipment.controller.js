const {
    validateEquipment,
    Equipment
} = require("../models/equipment.model");
const {
    EquipmentLaptopOwner
} = require("../models/equipmentOwner.model");
const {
    validateObjectId
} = require("../utils/imports");

/***
 * Get all equipments
 * @param req
 * @param res
 */
exports.getAllEquipments = async (req, res) => {
    try {
        let {
            limit,
            page
        } = req.query;

        if (!page || page < 1) page = 1;

        if (!limit) limit = 10;

        const options = {
            page: page,
            limit: limit
        };

        const data = await Equipment.paginate({}, options)

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
exports.createEquipment = async (req, res) => {
    try {
        const {
            error
        } = validateEquipment(req.body);
        if (error) return res.status(400).send({
            message: error.details[0].message
        });

        const dupplicate = await Equipment.findOne(req.body);
        if (dupplicate) return res.status(400).send({
            message: 'Equipment already exists'
        });

        const newEquipment = new Equipment(req.body);

        const result = await newEquipment.save();

        return res.status(201).send({
            message: 'CREATED',
            data: result
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
exports.updateEquipment = async (req, res) => {
    try {

        if (!validateObjectId(req.params.id))
            return res.status(400).send({
                message: 'Invalid id'
            });

        const {
            error
        } = validateEquipment(req.body);
        if (error) return res.status(400).send({
            message: error.details[0].message
        });

        const result = await Equipment.findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true
        });

        if (!result)
            return res.status(404).send({
                message: 'Equipment Not found'
            });

        return res.status(200).send({
            message: 'UPDATED',
            data: result
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
exports.deleteEquipment = async (req, res) => {
    try {

        if (!validateObjectId(req.params.id))
            return res.status(400).send({
                message: 'Invalid id'
            });

        const result = await Equipment.findOneAndDelete({
            _id: req.params.id
        });
        if (!result)
            return res.status(404).send({
                message: 'Equipment not found'
            });

        await EquipmentLaptopOwner.deleteMany({
            equipment: req.params.id
        });

        return res.send({
            message: 'DELETED',
            data: result
        });
    } catch (e) {
        return res.status(500).send(e.toString().split('\"').join(''))
    }
}