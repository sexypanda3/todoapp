const Todo = require('../models/Todo');

const router = require('express').Router();

router.get('/mytodos', async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user._id })
        res.status(200).json({ todos })

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server Error" })
    }

})


router.post('/add', async (req, res) => {
    try {
        const { title } = req.body;

        const todo = await Todo.create({ title, userId: req.user._id })

        res.status(200).json({ todo })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server Error" })
    }

})

router.put('/complete/:_id', async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params._id })
        todo.completed = true
        await todo.save()

        res.status(200).json({ todo })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server Error" })
    }
})

router.put('/edit/:_id', async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params._id })
        todo.title = req.body.title
        await todo.save()

        res.status(200).json({ todo })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server Error" })
    }
})

router.delete('/:_id', async (req, res) => {
    try {
        await Todo.deleteOne({ _id: req.params._id })

        res.status(200).json({ message: "Todo deleted" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server Error" })
    }
})


module.exports = router;