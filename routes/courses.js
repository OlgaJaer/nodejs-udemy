const { Router } = require("express");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const router = Router();

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().lean().populate("userId", "email name");
    console.log(courses);
    res.render("courses", {
      title: "List of corses",
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit", auth, async (req, res) => {
  try {
    const { id } = req.body; //забираем id (в moongoose id как _id)
    delete req.body.id; //удаляем id из body

    const course = await Course.findById(id);
    if (!isOwner(course)) {
      return res.redirect("/courses");
    }
    Object.assign(course, req.body); // заменить поля
    await course.save();
    //await Course.findByIdAndUpdate(id, req.body).lean();
    //console.log("body", req.body);
    res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    console.log("req", req.body);
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });

    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  try {
    const course = await Course.findById(req.params.id).lean();
    //console.log("ID", req.params.id);
    if (!isOwner(course, req)) {
      return res.redirect("/courses");
    }

    res.render("course-edit", {
      title: `Редактировать ${course.title}`,
      course,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  //console.log(req.allow);
  try {
    const course = await Course.findById(req.params.id).lean();
    res.render("course", {
      layout: "empty",
      title: `Курс ${course.title}`,
      course,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
