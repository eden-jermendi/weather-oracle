import { Request, Response } from "express"

export async function getOracle(req: Request, res: Response) {
  const city = req.query.city as string

  if (!city) {
    return res.status(400).json({
      error: "city query parameter is required"
    })
  }

  res.json({
    city,
    oracle: "The oracle has not spoken yet."
  })
}