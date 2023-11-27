const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

function findAll() {
    return new Promise(async (resolve, reject) => {
        const client = await MongoClient.connect(url, { useNewUrlParser: true }).catch(err => {
            console.log("Error connecting to MongoDB:", err);
            reject(err);
        });

        if (!client) {
            reject("MongoDB connection failed.");
            return;
        }

        try {
            console.log('1');
            const db = client.db("mydb");
            console.log('2');
            let collection = db.collection('customers');
            console.log('3');
            let cursor = collection.find({}).limit(10);
            console.log('4');

            cursor.toArray((err, docs) => {
               
                    console.log(docs);
                    console.log('5');
                    resolve();
                
            });
        } catch (err) {
            console.log("Error in try block:", err);
            reject(err);
        } finally {
            client.close();
        }
    });
}

setTimeout(() => {
    findAll()
        .then(() => console.log('iter'))
        .catch(err => console.log("Error:", err));
}, 5000);
