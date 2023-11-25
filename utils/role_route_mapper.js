const roleRoutes = require("../routes/role_routes");

const hasRouteAccess = (routeMethod, route, role) => {
  if (!route || route === "") {
    return {
      status: 500,
      code: "INTERNAL SERVER ERROR",
      routeAccess: false,
      message: "Invalid route.",
    };
  }

  if (!role || role === "") {
    return {
      status: 500,
      code: "INTERNAL SERVER ERROR",
      routeAccess: false,
      message: "Invalid role.",
    };
  }

  const requiredRoute = `${routeMethod}::${route}`; //  POST::/manager/create-ticket
  console.log(requiredRoute,"hello world",role);
  if (!roleRoutes[requiredRoute]) {
    return {
      status: 400,
      code: "BAD REQUEST",
      routeAccess: false,
      message: "Route doesn't exist",
    };
  }

  const allowedRoles = roleRoutes[requiredRoute]; // [MANAGER, STAFF]
  const foundRole = allowedRoles.find((currRole) => role === currRole);
  if (!foundRole) {
    return {
      status: 403,
      code: "FORBIDDEN REQUEST",
      routeAccess: false,
      message: "You don't have permission to access the route.",
    };
  }

  return {
    status: 200,
    code: "OK",
    routeAccess: true,
    message: "OK",
  };
};

module.exports = hasRouteAccess;
