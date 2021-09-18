const express = require("express");
const postsRouter = express.Router();
const { getAllPosts, createPost } = require("../db");
const { requireUser } = require("./utils");


postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");

    next();
});

postsRouter.get("/", async (req, res) => {
    const posts = await getAllPosts();

    res.send({
        posts
    })
});

postsRouter.post("/", requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;

    const tagArr = tags.trim().split(/\s+/);
    const authorId = req.user.id;
    const postData = { authorId, title, content, tags };

    // only send the tags if there are some to send
    if (tagArr.length) {
        postData.tags = tagArr;
    }

    try {
        const post = await createPost(postData);

        if (post) {
            res.send({ post });
        } else {
            next({
                name: "postErrorMessage",
                message: "This is an error message for posts"
            })
        }
    }
    catch ({ name, message }) {
        next({ name, message })
    }
});

module.exports = postsRouter;