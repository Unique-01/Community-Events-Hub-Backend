const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/community-events-hub"
        );
        console.log("MongoDB server connected successfully");
    } catch (error) {
        console.log("Unable to connect to the mongoDB server", error);
    }
};

dbConnection();

