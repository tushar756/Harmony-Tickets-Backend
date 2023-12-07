const user = require("../const/user");

const { MANAGER, STAFF } = user;

const roleRoutes = {
  "POST::/manager/create-ticket": [MANAGER, STAFF],
  "POST::/manager/create-user": [MANAGER],
  "GET::/manager/getAllStaff": [MANAGER, STAFF],
  "GET::/staff/staffTickets:": [MANAGER, STAFF],
  "GET::/ticket/all:": [MANAGER, STAFF],
};

module.exports = roleRoutes;
