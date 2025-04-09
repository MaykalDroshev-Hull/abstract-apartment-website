import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  //If method is a 'POST', then checks data, then calls the addReview method
  if (req.method === 'POST') {
    const data = req.body
    //Must have 'firstName', 'lastName' and 'reviewText' filled out in form or or form will not submit and return an error 
    if (!data.firstName || !data.lastName || !data.reviewText) {
      return res.status(400).json({ message: 'Bad Request' })
    } else {
      return await addReview(req, res)
    }
  //If method is 'GET', then calls the readReview function
  } else if (req.method === 'GET') {
    return await readReview(req, res)
  }

  return res.status(400).json({ message: 'Bad Request' })
}

//API route that adds a new review to a database using Prisma ORM
const addReview = async (req, res) => {
  //Prisma instance to interact with the database
  const prisma = new PrismaClient()
  //Extract data from the HTTP request object which contains the review data sent by the client
  const body = req.body
  try {
    //Try to create a new entry that will be added to the 'Reviews' table in the database
    const newEntry = await prisma.review.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        reviewText: body.reviewText,
      }
    })
    return res.status(200).json(newEntry, { success: true })
  } catch (e) {
    console.log('Request Error', e)
    return res.status(500).json({ error: 'Error Creating Review', success: false })
  }
}

const readReview = async (req, res) => {
  //Prisma instance to interact with the database
  const prisma = new PrismaClient()
  try {
    //Pull all of the data from the 'Reviews' table from the database
    const reviews = await prisma.review.findMany()
    return res.status(200).json(reviews, { success: true })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Error reading from database', success: false })
  }
}

export default handler