import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import seed from "./seeders/seed.js";
import requestlogger from "./middleware/requestlogger.js";
import Database from "./db.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";

// Read environment variables
const dotenvResult = dotenv.config({ path: '.env' });
if (dotenvResult.error) {
  console.log("ERROR when loading .env",dotenvResult.error);
  process.exit(1);
}

// Setup / Configure Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(requestlogger);

// Connect to MongoDB - it should be OK to just create a single connection and keep using that: https://stackoverflow.com/questions/38693792
const db = new Database();
await db.connect();

// If we are running in the dev environment, seed data
if (process.env.ENVIRONMENT === "dev") {
  await seed();
}

// Setup routes
app.get("/posts", async (req, res) => {
  const post = await Post.find();
  res.json(post);
});

app.get("/post/:postId/comments", async (req, res) => {
  // DONE: Somehow all comments for the given post from the database
  console.log(req.params.postId)
  // This query is correct, but postId will reset every time the server resets
  const comments = await Comment.find({ postId: req.params.postId });
  res.json(comments);
});

// DONE: Add endpoint for adding posts
app.post("/posts", async (req, res) => {
  // Save data to DB
    const post = new Post({
      author: req.body.author,
      content: req.body.content,
      image: req.body.image,
    })
    post.save()
        .then(() => {
          console.log(`Post from: ${req.body.author} saved!!!`)
        })
        .catch(e => console.log("Unable to save!", e));

  res.status(201);
  res.json({ success: true });
});

// TODO: Add endpoint for adding comments 
app.post("/post/:postId/comments", async (req, res) => {
  console.log("Saving:", req.body);
  //find post
  const post = await Post.find({_id: req.params.postId});// returns an array
  // Save data to DB
  const comment = new Comment({
    author: req.body.author,
    content: req.body.content,
    postId: req.body.postId
  })
  await post[0].addComment(comment) // Post.addComment doesn't work either.
    //console.log(`Comment from: ${req.body.author} for ${req.body.postId}, saved!!!`)
  res.status(201);
  res.json({ success: true });
});


app.use((req, res) => {
  res.status(404);
  res.send("I don't have what you seek");
});

app.listen(process.env.PORT, () => {
  console.info(`App listening on http://localhost:${process.env.PORT}`);
});
