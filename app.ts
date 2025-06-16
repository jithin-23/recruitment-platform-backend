import express from "express";
import dataSource from "./db/data-source";
import cors from "cors"
import errorMiddleware from "./middlewares/errorMiddleware";
import jobPostingRouter from "./routes/jobposting.routes";
import authRouter from "./routes/auth.routes";
import referralRouter from "./routes/referral.route";

const server = express();

server.use(express.json());
server.use( cors() )
server.use("/auth",authRouter);
server.use("/jobpostings",jobPostingRouter)
server.use("/referral",referralRouter)

server.use(errorMiddleware);

server.get("/", (req, res) => {
    console.log(req.url);
    res.status(200).send("Hello world - Recruitment Platform Backend");
});

(async () => {
    try {
        await dataSource.initialize();
        console.log("connected");

        const port = process.env.PORT || 3000
        server.listen(port, () => {
            console.info("server listening to port:",port);
        });
    } catch (e) {
        console.error(`Failed to connect to DB:  ${e}`);
        process.exit(1);
    }
})();


