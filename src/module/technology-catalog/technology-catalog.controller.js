import {
  getTechnologiesService,
  addTechnologyService,
  updateTechnologyService,
  deleteTechnologyService,
} from "./technology-catalog.service.js";

export const getTechnologies = async (req, res, next) => {
  try {
    const technologies = await getTechnologiesService();

    return res.status(200).json({
      message: "Technologies found successfully",
      technologies,
    });
  } catch (error) {
    next(error);
  }
};

export const addTechnology = async (req, res, next) => {
  try {
    const { technologyName, category, preferredUsecase, notes } = req.body;

    const technology = await addTechnologyService(
      technologyName,
      category,
      preferredUsecase,
      notes,
    );

    return res.status(201).json({
      message: "Technology added successfully",
      technology,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTechnology = async (req, res, next) => {
  try {
    const { technologyId } = req.params;

    const technology = await updateTechnologyService(technologyId, req.body);

    if (!technology) {
      return res.status(404).json("Technology not found");
    }

    return res
      .status(200)
      .json({ message: "Technology updated successfully", technology });
  } catch (error) {
    next(error);
  }
};

export const deleteTechnology = async (req, res, next) => {
  try {
    const { technologyId } = req.params;

    const technology = await deleteTechnologyService(technologyId);

    if (!technology) {
      return res.status(404).json("Technology not found");
    }

    return res.status(200).json({
      message: "Technology deleted successfully",
      technology,
    });
  } catch (error) {
    next(error);
  }
};
