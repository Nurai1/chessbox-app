import { Request, Response } from 'express';

import { CompetitionData } from '../models/competitionData.model';

export const uploadBanner = async (
  req: Request<{ competitionId: string }>,
  res: Response
) => {
  const { competitionId } = req.params;

  try {
    if (!competitionId) {
      return res.status(400).send('No Competition Id');
    }
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const competitionData = await new CompetitionData({
      banner: { name: req.file.originalname, image: req.file.buffer },
      competitionId,
    });

    await competitionData.save();

    console.log('Image saved to MongoDB successfully');
    res.send({
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Internal server error');
  }
};

export const getCompetitionBanner = async (
  req: Request<{ competitionId: string }>,
  res: Response
) => {
  try {
    const { competitionId } = req.params;
    const competitionData = await CompetitionData.findOne({ competitionId });

    if (!competitionData || !competitionData.banner?.image) {
      return res.status(404).send('Image not found');
    }

    // Set response content type
    res.set('Content-Type', 'image/jpeg');
    // Send the image binary data to the client
    res.send(competitionData.banner?.image?.buffer);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Internal server error');
  }
};
