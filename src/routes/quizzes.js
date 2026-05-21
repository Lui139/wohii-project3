const express = require("express");
const router = express.Router();

const quizzes = require("../data/quizzes");

// GET /api/quizzes/,/api/quizzes?keyword=Finland
// List all quizzes
router.get("/", (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.json(quizzes);
    }
    const filteredQuizzes = quizzes.filter(p=>p.keywords.includes(keyword));
    res.json(filteredQuizzes);
});
// GET /api/quizzes/:quizId
// Show a specific quiz
router.get("/:quizId", (req, res) => {
    const quizId = Number(req.params.quizId);
    const quiz = quizzes.find(p=> p.id === quizId);
    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
});

// POST /api/quizzes
// Create a new quiz
router.post("/", (req, res) => {
    const {question, answer, keywords} = req.body;
    if (!question || !answer) {
        return res.status(400).json({msg: "question and answer are required"})
    }
    const existingIds = quizzes.map(p=>p.id) // [1,2,3,4]
    const maxId = Math.max(...existingIds)
    const newQuiz = {
        id: quizzes.length ? maxId + 1 : 1,
        question, answer,
        keywords: Array.isArray(keywords) ? keywords : []
    }
    quizzes.push(newQuiz);
    res.status(201).json(newQuiz);
});

// PUT /api/quizzes/:quizId
// Edit a quiz
router.put("/:quizId", (req, res) => {
    const quizId = Number(req.params.quizId);
    const quiz = quizzes.find(p=> p.id === quizId);
    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
    }

    const {question, answer, keywords} = req.body;
    if (!question || !answer) {
        return res.status(400).json({msg: "question and answer are required"})
    }
    quiz.question = question;
    quiz.answer = answer;
    quiz.keywords = Array.isArray(keywords) ? keywords : [];

    res.json(quiz); 
});

// DELETE /api/quizzes/:quizId
// Delete a quiz
router.delete("/:quizId", (req, res) => {
    const quizId = Number(req.params.quizId);
    const quizIndex = quizzes.findIndex(p=> p.id === quizId);

    if (quizIndex === -1) {
        return res.status(404).json({ msg: "Quiz not found" });
    }
    const deletedQuiz = quizzes.splice(quizIndex, 1);
    res.json({
        mesg: "Quizt deleted successfully",
        quiz: deletedQuiz
    });
});



module.exports = router;