import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

type Course = {
  name: string
  code: string
}

async function main() {
  console.log("Starting seed operation...")

  const courses: Course[] = [
    {
      name: "Engenharia de Controle e Automação",
      code: "ECA",
    },
    {
      name: "Engenharia de Computação",
      code: "ECO",
    },
  ]

  console.log(`Preparing to seed ${courses.length} courses...`)

  const result = await prisma.$transaction(
    courses.map((course) =>
      prisma.course.upsert({
        where: { code: course.code },
        update: {
          name: course.name,
        },
        create: {
          name: course.name,
          code: course.code,
        },
      }),
    ),
  )

  console.log(`Successfully seeded ${result.length} courses!`)
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
