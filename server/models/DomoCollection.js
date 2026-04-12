const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

// Schema to describe a Domo Collection
const DomoCollectionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    domos: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'Domo',
    }],
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date, 
        default: Date.now,
    },
})

DomoCollectionSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    domos: doc.domos,
});

const DomoCollectionModel = mongoose.model('DomoCollection', DomoCollectionSchema);
module.exports = DomoCollectionModel;