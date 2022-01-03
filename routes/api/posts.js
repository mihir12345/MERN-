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
    res.json({msg:'post removed'});
  } catch {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


router.put('/like/:id',auth,async(req,res)=>{
const post= await Post.findById(req.params.id)
if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
return res.status(401).json({ msg: "Post already liked" });
}

post.likes.unshift({user:req.user.id})
await post.save()
res.json(post.like)
})

module.exports = router;
