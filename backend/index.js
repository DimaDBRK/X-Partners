import  { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      email: 'hello1@prisma.com',
      name: 'Rich',
      password: "1232",
      gender: "male",
      birthDate: new Date("2020-03-21"),
      photoUrl: ""
    },
  })

  const allUsers = await prisma.user.findMany()
  console.dir(allUsers, { depth: null })
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })