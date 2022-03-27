const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Xplore:051407NG@politicalbot.mtvap.mongodb.net/Default?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("companies").collection("stocks");
  
  // perform actions on the collection object
  client.close();
});

function StartMongoClient(){

});
}