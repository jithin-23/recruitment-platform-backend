import express from "express";
import dataSource from "./db/data-source";
import cors from "cors"
import errorMiddleware from "./middlewares/errorMiddleware";
import jobPostingRouter from "./routes/jobposting.route";

const server = express();

server.use(express.json());
server.use( cors() )
server.use("/jobpostings",jobPostingRouter)

server.use(errorMiddleware);

server.get("/", (req, res) => {
    console.log(req.url);
    res.status(200).send("Hello world - Recruitment Platform Backend");
});

(async () => {
    try {
        await dataSource.initialize();
        console.log("connected");

        server.listen(process.env.PORT || 3000, () => {
            console.info("server listening to 3000");
        });
    } catch (e) {
        console.error(`Failed to connect to DB:  ${e}`);
        process.exit(1);
    }
})();


