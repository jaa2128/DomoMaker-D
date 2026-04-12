const models= require('../models');
const Domo = models.Domo;
const DomoCollection = models.DomoCollection;

const makerPage = async (req, res) => {
    return res.render('app');
};

const makeDomo = async (req, res) => {
    if(!req.body.name || !req.body.age || !req.body.level || !req.body.collectionID) {
        return res.status(400).json({error: 'All fields are required!'});
    }

    const domoData = {
        name: req.body.name, 
        age: req.body.age, 
        level: req.body.level, 
        owner: req.session.account._id,
    };

    try{
        const newDomo = new Domo(domoData);
        const savedDomo = await newDomo.save();

        // Push domo's ID into it's respective collection array
        // find the one to update via it's ID and ensure the owner
        // is logged in user
        await DomoCollection.updateOne(
            {_id: req.body.collectionID, owner: req.session.account._id},
            { $push: {domos: savedDomo._id}}
        );

        return res.status(201).json({name: newDomo.name, age: newDomo.age, level: newDomo.level});
    } catch (err) {
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({error: 'Domo already exists!'});
        }
        return res.status(500).json({error: 'An error occured making domo!'});
    }
}

const getDomos = async(req, res) => {
    try{
        const query = {owner: req.session.account._id};
        const docs = await Domo.find(query).select('name age level').lean().exec();

        return res.json({domos: docs});
    }
    catch (err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving domos!'});
    }
};

module.exports = {
    makerPage,
    makeDomo,
    getDomos
};