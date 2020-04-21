const {Schema, model} = require('mongoose')

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}) 

courseSchema.method('toClient', function() {
    const course = this.toObject()// получаем обьект курса

    course.id = course._id //переопределяем -трансформация
    delete course._id //удаляем лишнее поле

    return course
})

module.exports = model("Course", courseSchema)