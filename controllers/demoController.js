const demos = [
  {
    name: "HoduPBX ST",
    salesRep: "Vasant Gohil",
    time: "1:30PM",
  },
  {
    name: "HoduCC CX Suite ST",
    salesRep: "Kartik Khambhati",
    time: "4PM",
  },
];

const getAllDemos = async (req, res) => {
  res.status(200).json(demos);
};

export default getAllDemos;
