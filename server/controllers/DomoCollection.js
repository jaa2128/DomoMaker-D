const models = require('../models');
const DomoCollection = models.DomoCollection;

// Function to make a collection
const makeCollection = async (req, res) => {
    if(!req.body.name) {
        return res.status(400).json({error: 'You must name the collection'});
    }

    const collectionData = {
        name: req.body.name,
        domos: [], // new collection means empty array
        owner: req.session.account._id,
    }

    try {
        const newCollection = new DomoCollection(collectionData);
        await newCollection.save();
        return res.status(201).json({message: 'Collection created successfully'});
    } catch (err) {

        console.log(err);

        // if there is an identical collection somehow, throw error
        if(err.code === 11000){
            return res.status(400).json({error: 'Collection already exists'});
        }
        return res.status(500).json({error: 'An error occured making collection'});
    }
}

// Function to get all collections that belong to a user
const getCollections = async(req, res) => {
    try{
        const query = {owner: req.session.account._id};

        // finds all Collections and also populates their 'domos' array
        // using objectIds that match domos in Domos collections in MongoDB
        const docs = await DomoCollection.find(query).select('name domos')
        .populate('domos').lean().exec();

        return res.json({collections: docs});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving collections'});
    }
}

// Get a Collection based off its Id, used to re-render Domos upon Creation in React
// because React doesn't check for internal changes to an object
const getCollection = async (req, res) => {
    const {id} = req.query;
    try{

        // finds collection according to Id and owner Id and also populates their 'domos' array
        // using objectIds that match domos in Domos collections in MongoDB
        const doc = await DomoCollection.findOne({
            _id: id,
            owner: req.session.account._id
        })
        .populate('domos').lean().exec();

        return res.json({collection: doc});
    }
    catch (err){
        console.log(err);
        return res.status(500).json({error: 'Could not find Collection'});
    }

}

module.exports = {
    makeCollection,
    getCollections,
    getCollection,
}