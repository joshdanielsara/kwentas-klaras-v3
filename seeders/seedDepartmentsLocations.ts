import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const services = ['General', 'Social', 'Economic', 'Environmental']

  for (const serviceName of services) {
    await prisma.service.upsert({
      where: { name: serviceName },
      update: {},
      create: {
        name: serviceName,
      },
    })
  }

  const departments = [
    "Mayor's Office",
    'Tourism Office',
    'BAC Office',
    'Accountant Office',
    'Engineering Office',
    'PESO Office',
    'MDRRMO',
    'Sanguniang Baranggay Office',
    'MPDC Office',
    'MCR Office',
    'MBO Office',
    "Assessor's Office",
    'MHO Office',
    'Parks & Plaza',
    'MSWD Office',
    'MENRO Office',
    'MO',
    'Streets & Bridges',
    'LDF',
    'Waterworks',
    'Markets',
    'Zero Waste',
  ]

  for (const departmentName of departments) {
    await prisma.department.upsert({
      where: { name: departmentName },
      update: {},
      create: {
        name: departmentName,
      },
    })
  }

  const locations = [
    'Baranggay Baclayan',
    'Baranggay El Pardo',
    'Baranggay Granada',
    'Baranggay Lower Becerril',
    'Baranggay Poblacion',
    'Baranggay San Antonio',
    'Baranggay Upper Becerril',
    'Baranggay Arbor',
    'Baranggay Lunop',
    'Baranggay Nangka',
    'Baranggay South Granada',
  ]

  for (const locationName of locations) {
    await prisma.location.upsert({
      where: { name: locationName },
      update: {},
      create: {
        name: locationName,
      },
    })
  }

  const remarks = [
    'No PPMP/APP/POW',
    'Awarded Already',
    'Finished Already',
  ]

  for (const remarkName of remarks) {
    await prisma.remark.upsert({
      where: { name: remarkName },
      update: {},
      create: {
        name: remarkName,
      },
    })
  }

  console.log('Services, Departments, Locations, and Remarks seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
