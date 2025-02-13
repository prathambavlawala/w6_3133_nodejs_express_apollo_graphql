const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
//import ApolloServer
const { ApolloServer } = require('apollo-server-express');

//Store sensitive information to env variables
const dotenv = require('dotenv');
dotenv.config();

//mongoDB Atlas Connection String
const mongodb_atlas_url = process.env.MONGODB_URL;

//TODO - Replace your Connection String here
const connectDB = async () => {
    try {
        await mongoose.connect(mongodb_atlas_url, {
            serverSelectionTimeoutMS: 5000, // Ensures quick failover if connection fails
            connectTimeoutMS: 10000
        });

        console.log('✅ Success: MongoDB connected using the correct URL format.');
    } catch (error) {
        console.error(`❌ Error: Unable to connect to MongoDB - ${error.message}`);
        process.exit(1); // Exit process if DB connection fails
    }
};

//Define Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start(); // ✅ Start Apollo Server

    //Define Express Server
    const app = express();
    app.use(express.json());
    app.use('*', cors());

    //Add Express app as middleware to Apollo Server
    server.applyMiddleware({ app });

    //Start listen 
    app.listen({ port: process.env.PORT || 4000 }, async () => {
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}${server.graphqlPath}`);
        await connectDB(); // Ensures DB connection is attempted when the server starts
    });
}

startServer();
