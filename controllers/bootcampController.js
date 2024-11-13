const getAllBootcamps = (req, res) => {
  res.status(200).json({ success: true, message: "Display all bootcamps" });
};
const getBootcampById = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Display bootcamp ${req.params.id}` });
};
const createBootcamp = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Bootcamp created successfully" });
};
const updateBootcampById = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Bootcamp updated for ${req.params.id}` });
};
const deleteBootcampById = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Bootcamp deleted for ${req.params.id}` });
};

export {
  getAllBootcamps,
  getBootcampById,
  updateBootcampById,
  deleteBootcampById,
  createBootcamp,
};
