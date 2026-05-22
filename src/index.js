const express = require('express');
const app = express();
const quizzesRouter = require("./routes/quizzes");
const authRouter = require("./routes/auth");

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies (will be useful in later steps)
app.use(express.json());
// Routes / everything under /api/posts
app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizzesRouter);

app.use((req, res) => {
    res.status(404).json({msg: "Not found"});
});
// Start the server
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});

async function shutdown() { 
    await prisma.$disconnect ();
    server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Graceful shutdown
/*process.on("SIGINT", async () => {
await prisma.$disconnect();
process.exit(0);
});
process.on("SIGTERM", async () => {
await prisma.$disconnect();
process.exit(0);
});*/