const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://Xplore:051407ng@politicalbot.mtvap.mongodb.net/Default?    retryWrites=true&w=majority";
var mongoClient;

function MongoClientConnect(){
  mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  console.log("\x1b[35m%s\x1b[0m","MongoClient Connected");
}

function GetMongoClient(){
  return mongoClient;
}