const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  console.log(req.query, "Request Query");

  // console.log(reqQuery);

  // fields not to be included in reqQuery
  const excludeFields = ["select", "sort", "page", "limit"];

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  // reqQuery = reqQuery.forEach((param) => delete reqQuery[param]);
  excludeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // query = model.find(JSON.parse(queryStr)).populate("courses");
  query = model.find(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // if (page < total / limit) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit,
  //   };
  // }

  // if (page > 1) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //   };
  // }

  //   If populate is used for the API
  if (populate) {
    query = query.populate(populate);
  }

  // to implement if select is used in query string, to select specific fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // to implement sort, if sort is used in query string, to sort the elements
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const results = await query;

  if (!results) {
    return res
      .status(400)
      .json({ success: false, message: "No result found for the request" });
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  // const query = req.query;

  // console.log(query);

  // const bootcamps = await Bootcamp.find(query);
  //the above is mainly used to get the Bootcamps defined with specific query

  next();
};

export default advancedResults;
