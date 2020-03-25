const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbuser);
const PASSWORD = encodeURIComponent(config.dbpassword);
const DB_NAME = config.dbname;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbhost}:${config.dbPort}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
    constructor() {
        this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true })
        this.dbName = DB_NAME;
    }
    connnect() {
        if (!MongoLib.connnection) {
            MongoLib.connnection = new Promise((resolve, reject) => {
                this.client.connect(err => {
                    if (err) {
                        reject(err);
                    }
                    console.log('Connected succesfully to mongo');
                    resolve(this.client.db(this.dbName));
                });
            });
        }
        return MongoLib.connnection;
    }

    getAll(collection, query) {
        return this.connnect().then(db => {
            return db.collection(collection).find(query).toArray()
        })
    }

    get(collection, id) {
        return this.connnect().then(db => {
            return db.collection(collection).findOne({ _id: ObjectId(id) })
        })
    }

    create(collection, data) {
        return this.connnect().then(db => {
            return db.collection(collection).insertOne(data)
        }).then(result => result.insertedId);
    }

    update(collection, id, data) {
        return this.connnect().then(db => {
            return db.collection(collection).updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true })
        }).then(result => result.upserteddId || id);
    }

    delete(collection, id) {
        return this.connnect().then(db => {
            return db.collection(collection).deleteOne({ _id: ObjectId(id) })
        }).then(() => id)
    }

}

module.exports = MongoLib;

