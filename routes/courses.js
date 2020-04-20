const { Router } = require("express");
const Course = require("../models/course");
const router = Router();
//const mongooseLV = require('mongoose-lean-virtuals');
//Course.plugin(mongooseLV);

router.get("/", async (req, res) => {
  const courses = await Course.find().lean().populate('userId', 'email name');
  console.log(courses)
  res.render("courses", {
    title: "List of corses",
    isCourses: true,
    courses,
  });
});

router.post("/edit", async (req, res) => {
  const { id } = req.body; //забираем id (в moongoose id как _id)
  delete req.body.id; //удаляем id из body
  await Course.findByIdAndUpdate(id, req.body).lean();
  console.log("body", req.body);
  res.redirect("/courses");
});

router.post("/remove", async (req, res) => {
  try {
    await Course.deleteOne({_id: req.body.id});
    res.redirect('/courses')
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  const course = await Course.findById(req.params.id).lean();
  console.log("ID", req.params.id)
  res.render("course-edit", {
    title: `Редактировать ${course.title}`,
    course,
  });
});

router.get("/:id", async (req, res) => {
  console.log(req.allow);
  const course = await Course.findById(req.params.id).lean();
  res.render("course", {
    layout: "empty",
    title: `Курс ${course.title}`,
    course,
  });
});

module.exports = router;
