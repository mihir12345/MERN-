const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/authMiddleware");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route    POST api/post
// @desc     Create post
// @access   Private
router.post(
  "/",
  [auth, [check("text", "text is required").not().notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/post
// @desc     get all posts
// @access   Private

router.get("/", auth, async (req, res) => {
  try {
    const post = await Post.find().sort({ date: -1 });
    res.json(post);
  } catch {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/post/:post
// @desc     get a posts
// @access   Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // const post=await Post.findOne({user:req.params.id})

    if (!post) {
      return res.status(400).json({ msg: "post not found" });
    }
    res.json(post);
  } catch {
    console.error(error);
    if (error.kind == "ObjectId")
      return res.status(400).json({ msg: "post not found" });
    res.status(500).send("Server Error");
  }
});

// @route    GET api/post/:post
// @desc     get a posts
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(401).json({ msg: "User is not authorized" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User is not authorized" });
    }
    await post.remove();
    res.json({ msg: "post removed" });
  } catch {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


// @route    put api/post/like/:id
// @desc     like a posts
// @access   Private
router.put("/like/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (
    post.likes.filter((like) => like.user.toString() === req.user.id).length > 0
  ) {
    return res.status(401).json({ msg: "Post already liked" });
  }

  post.likes.unshift({ user: req.user.id });
  await post.save();
  res.json(post.like);
});


// @route    GET api/post/unlike/:id
// @desc     unlike a posts
// @access   Private

router.put("/unlike/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (
    post.likes.filter((like) => like.user.toString() === req.user.id).length ===
    0
  ) {
    return res.status(401).json({ msg: "Post is not liked" });
  }

  // post.likes.unshift({user:req.user.id})
  const removeIndex = likes
    .map((like) => like.user.toString())
    .indexOf(req.user.id);
  post.likes.splice(removeIndex, 1);
  await post.save();
  res.json(post.like);
});


// @route    GET api/post/comment/:id
// @desc     unlike a posts
// @access   Private

router.post(
  "/comment/:id",
  [auth, [check("text", "text is required").not().notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findById(req.user.id).select("-password");
      let post = await Post.findById(req.params.id)
      const newComment = new Post({
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
        user: req.user.id,
      });

       post.comment.unshift(newComment)
        await post.save();
      res.json(post.comment);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

router.delete('/comment/:id/:comment',auth,async(req,res)=>{
  try {
    let post = await Post.findById(req.params.id)
    let comment = await comment.find(comment.id===req.params.comment_id);

    if(!comment){
      return res.status(400).json({ msg: 'Comment does not exist' });
    }

    if(comment.user.toString()!==req.user.id){
      return res.status(400).json({ msg: 'Comment does not exist' });

    }

    const removeIndex=post.comment.map(comment=>comment.id).indexOf(req.params.comment_id)

    post.comment.slice(removeIndex,1)
  
    res.json(post.comment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }


  
})

module.exports = router;
