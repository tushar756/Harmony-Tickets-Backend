const user = require("../const/user");

const { MANAGER, STAFF } = user;

const roleRoutes = {
  "POST::/manager/create-ticket": [MANAGER, STAFF],
  "POST::/manager/create-user": [MANAGER],
  "GET::/manager/getAllStaff": [MANAGER, STAFF],
  "GET::/staff/:id:": [MANAGER, STAFF],
};

module.exports = roleRoutes;
