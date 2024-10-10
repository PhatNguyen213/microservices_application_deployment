const express = require("express");
const http = require("http");
const mongodb = require("mongodb");

const VIDEO_STORAGE_HOST = "video-storage";
const VIDEO_STORAGE_PORT = 80;
const DBHOST = "mongodb://mongodb:27017";
const DBNAME = "video-streaming";

const app = express();

if (!process.env.PORT) {
  throw new Error(
    "Please specify the port number for the HTTP server with the environment variable PORT."
  );
}

const port = process.env.PORT;

async function main() {
  const client = await mongodb.MongoClient.connect(DBHOST);
  const db = client.db(DBNAME);
  const videosCollection = db.collection("videos");

  app.get("/video", async (req, res) => {
    const videoRecord = { videoPath: "SampleVideo_1280x720_1mb.mp4" };
    // const videoId = new mongodb.ObjectId(req.query.id);
    // const videoRecord = await videosCollection.findOne({ _id: videoId });
    // if (!videoRecord) {
    //   res.sendStatus(404);
    //   return;
    // }
    const forwardRequest = http.request(
      {
        host: VIDEO_STORAGE_HOST,
        port: VIDEO_STORAGE_PORT,
        path: `/video?path=${videoRecord.videoPath}`,
        method: "GET",
        headers: req.headers,
      },
      (forwardResponse) => {
        res.writeHead(forwardResponse.statusCode, forwardResponse.headers);
        forwardResponse.pipe(res);
      }
    );

    req.pipe(forwardRequest);
  });

  app.listen(port);
}

main().catch((err) => {
  console.error("Microservice failed to start.");
  console.error((err && err.stack) || err);
});
