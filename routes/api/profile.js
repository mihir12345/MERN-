const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const auth = require("../../middleware/authMiddleware");
const { check, validationResult } = require("express-validator");
const {
  validate,
  findOneAndUpdate,
  findOneAndDelete,
} = require("../../models/Profile");
const { application } = require("express");
//

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avarar"]
    );

    if (!profile) {
      res.status(400).send("user profile dont exist");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("error");
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private

router.post(
  "/",
  auth,
  check("status", "Status is required").notEmpty(),
  check("skills", "Skills is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((e) => e.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social = youtube;
    if (twitter) profileFields.social = twitter;
    if (instagram) profileFields.social = instagram;
    if (linkedin) profileFields.social = linkedin;
    if (facebook) profileFields.social = facebook;

    //update
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

// @route    get api/profile
// @desc     get all profile
// @access   Public
router.get("/", async (req, res) => {
  try {
    const profile = Profile.find().populate("user", ["avatar", "name"]);
    res.json(profile);
    // if(!profile){
    //     res.status(400).send('profile not found')
    // }
  } catch (error) {
    console.log("error.message");
    res.status(500).send("Server Error");
  }
});

// @route    get api/profile/user/:user_id
// @desc     get a profile/
// @access   Public
router.get("/", async (req, res) => {
  try {
    const profile = Profile.findOne({ user: req.params.user_id }).populate(
      "user",
      ["avatar", "name"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "profile not found" });
    }
    res.json(profile);
  } catch (error) {
    if (error.kind == "ObjectId")
      return res.status(400).json({ msg: "profile not found" });
    console.log("error.message");
    res.status(500).send("Server Error");
  }
});

// @route    get api/profile/user
// @desc     delete a profile/
// @access   Private
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });

    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (error) {
    // if(error.kind=='ObjectId')return res.status(400).json({msg:'profile not found'})
    console.log("error.message");
    res.status(500).send("Server Error");
  }
});

// @route    put api/profile/experience
// @desc     update a profile/experience
// @access   Private
router.put(
  "/experience",
  [
    auth,
    [
      check("Title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "starting from is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
      }
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((el) => el.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json({ msg: "User deleted" });
  } catch (error) {
    console.log("error.message");
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").notEmpty(),
      check("degree", "Degree is required").notEmpty(),
      check("fieldofstudy", "Field of study is required").notEmpty(),
      check(
        "from",
        "From date is required and needs to be from the past"
      ).notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile.experience.unshift(newEdu);
        await profile.save();
        res.json(profile);
      }
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete("/experience/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((el) => el.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();
    return res.json({ msg: "User deleted" });
  } catch (error) {
    console.error("error.message");
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
