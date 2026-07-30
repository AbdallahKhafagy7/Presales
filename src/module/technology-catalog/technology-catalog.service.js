import TechnologyCatalog from "../../model/technology-catalog/technology-catalog.model.js";

export const getTechnologiesService = async () => {
  const technologies = await TechnologyCatalog.find();

  return technologies;
};

export const addTechnologyService = async (
  technologyName,
  category,
  preferredUsecase,
  notes,
) => {
  const technology = await TechnologyCatalog.create({
    technologyName,
    category,
    preferredUsecase,
    notes,
  });

  return technology;
};

export const updateTechnologyService = async (technologyId, body) => {
  const technology = await TechnologyCatalog.findByIdAndUpdate(
    technologyId,
    body,
    {
      new: true,
      runValidators: true,
    },
  );

  return technology;
};

export const deleteTechnologyService = async (technologyId) => {
  const technology = await TechnologyCatalog.findByIdAndDelete(technologyId);

  return technology;
};
