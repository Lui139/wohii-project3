const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();


const seedQuizzes = [
  {
    id: 1,
    question: "What is the capital of Venezuela?",
    answer: "Caracas",
    keywords: ["country", "capital", "Venezuela"]
  },
  {
    id: 2,
    question: "What is the capital of Sweden?",
    answer: "Stockholm",
    keywords: ["country", "capital", "Sweden"]
  },
  {
    id: 3,
    question: "What is the capital of Norway?",
    answer: "Oslo",
    keywords: ["country", "capital", "Norway"]
  },
  {
    id: 4,
    question: "What is the capital of Finland?",
    answer: "Helsinki",
    keywords: ["country", "capital", "Finland"]
  }
];





async function main() {
    await prisma.quiz.deleteMany();
    await prisma.keyword.deleteMany();
    await prisma.user.deleteMany();

//Create a default user
const hashedPassword = await bcrypt.hash("1234", 10);
const user = await prisma.user.create({
    data: {
        email: "example@example.org",
        password: hashedPassword,
        name: "Example user"
    }
});
    console.log("Created user:", user.email);

    for (const quiz of seedQuizzes) {
        await prisma.quiz.create({
            data: {
                question: quiz.question,
                answer: quiz.answer,
                userId: user.id,
                keywords: {
                    connectOrCreate: quiz.keywords.map((kw) => ({
                      where: { name: kw },
                      create: { name: kw },
                    })),
                },
            },
        });
    }

    console.log("Seed data inserted successfully");
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());