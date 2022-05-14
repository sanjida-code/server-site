const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.hn6ma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("courseList");
    const coursesCollection = database.collection("courses");


    app.post('/courses', async (req, res) => {
      const query = req.body;
      const result = await coursesCollection.insertOne(query);
      res.json(result);

    });

    app.put('/courses/:id', async (req, res) => {
      const id = req.params.id
      const query = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...query
        },
      };
      const result = await coursesCollection.updateOne(filter, updateDoc, options);

      res.json(result)
    });

    app.get('/courses', async (req, res) => {
      const cursor = coursesCollection.find({});
      const courses = await cursor.toArray();
      res.json(courses)
    });

    app.get('/courses/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) };
      const result = await coursesCollection.findOne(query);
      res.json(result)
    });

    app.delete('/courses/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await coursesCollection.deleteOne(query);
      res.json(result);
    });


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('server site is ok !')
});

app.listen(port, () => {
  console.log('This port is runnig on', port)
})