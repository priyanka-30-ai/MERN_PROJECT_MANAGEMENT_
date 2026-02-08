require("../models/userModel");
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

/* GET COMMENTS */
router.get("/:projectId", async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId })
      .populate("user", "firstName lastName")
      .sort({ createdAt: 1 });

    res.send({ success: true, data: comments });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

/* ADD COMMENT */
router.post("/", async (req, res) => {
  try {
    const { projectId, userId, message } = req.body;

    const comment = new Comment({
      projectId,
      user: userId,   // 🔥 IMPORTANT
      message,
    });

    await comment.save();

    const savedComment = await comment.populate(
      "user",
      "firstName lastName"
    );

    res.send({ success: true, data: savedComment });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

module.exports = router;
