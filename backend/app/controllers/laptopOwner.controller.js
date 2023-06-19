const {
    validateLaptopOwner,
    LaptopOwner
} = require("../models/laptopOwner.model");
const { EquipmentLaptopOwner } = require("../models/equipmentOwner.model");
const { validateObjectId } = require("../utils/imports");

/***
 * Get all laptopOwners
 * @param req
 * @param res
 */
exports.getAllLaptopOwners = async (req, res) => {
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

        const data = await LaptopOwner.paginate({}, options)

        res.send({
            data
        });
    } catch (e) {
        return res.status(500).send(e.toString().split('\"').join(''))
    }
}



/***
 *  Create's a new laptopOwner
 * @param req
 * @param res
 */
exports.createLaptopOwner = async (req, res) => {
    try {
        const {
            error
        } = validateLaptopOwner(req.body);
        if (error) return res.status(400).send({
            message: error.details[0].message
        });

        let {
            nationalId,
            phone
        } = req.body

        let laptopOwner = await LaptopOwner.findOne({
            $or: [{
                nationalId
            }, {
                phone
            }],
        })

        if (laptopOwner) {
            const phoneFound = phone == laptopOwner.phone
            return res.status(400).send({
                message: `LaptopOwner with same ${phoneFound ? 'phone ' : 'nationalId '} arleady exist`
            });
        }

        const newLaptopOwner = new LaptopOwner(req.body);

        const result = await newLaptopOwner.save();

        return res.status(201).send({
            message: 'CREATED',
            data: result
        });
    } catch (e) {
        return res.status(500).send(e.toString().split('\"').join(''))
    }
}

/***
 *  updates's a new laptopOwner
 * @param req
 * @param res
 */
exports.updateLaptopOwner = async (req, res) => {
    try {

        if (!validateObjectId(req.params.id))
            return res.status(400).send({
                message: 'Invalid id'
            });

        const {
            error
        } = validateLaptopOwner(req.body);
        if (error) return res.status(400).send({
            message: error.details[0].message
        });

        let {
            nationalId,
            phone
        } = req.body

        let dupplicate_laptopOwner = await LaptopOwner.findOne({
            _id: {
                $ne: req.params.id
            },
            $or: [{
                nationalId: nationalId
            }, {
                phone: phone
            }],
        })

        if (dupplicate_laptopOwner) {
            const phoneFound = phone == dupplicate_laptopOwner.phone
            return res.status(400).send({
                message: `LaptopOwner with same ${phoneFound ? 'phone ' : 'nationalId '} arleady exist`
            });
        }

        const result = await LaptopOwner.findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true
        });

        if (!result)
            return res.status(404).send({
                message: 'LaptopOwner Not found'
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
 *  updates's a new laptopOwner
 * @param req
 * @param res
 */
exports.deleteLaptopOwner = async (req, res) => {
    try {

        if (!validateObjectId(req.params.id))
            return res.status(400).send({
                message: 'Invalid id'
            });

        const result = await LaptopOwner.findOneAndDelete({
            _id: req.params.id
        });
        if (!result)
            return res.status(404).send({
                message: 'LaptopOwner not found'
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