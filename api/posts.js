const express = require("express");
const postsRouter = express.Router();
const { getAllPosts, createPost, getPostById, updatePost } = require("../db");
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

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;

    const updateFields = {};

    if (tags && tags.length > 0) {
        updateFields.tags = tags.trim().split(/\s+/);
    }
    if (title) {
        updateFields.title = title;
    }
    if (content) {
        updateFields.content = content;
    }

    try {
        const originalPost = await getPostById(postId);

        if (originalPost.author.id === req.user.id) {
            const updatedPost = await updatePost(postId, updateFields);
            res.send({ post: updatedPost });
        } else {
            next({
                name: 'UnauthorizedUserError',
                message: 'You cannot update a post that is not yours'
            });
        }
    }
    catch ({ name, message }) {
        next({ name, message });
    }
})

module.exports = postsRouter;