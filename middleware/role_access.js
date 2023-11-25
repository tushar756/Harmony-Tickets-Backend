const hasRouteAccess =  require("../utils/role_route_mapper");

const roleRouteAccess = async (req, res, next) => {
  // req.originalUrl = /api/manager/create-ticket
  try {
    const path = sanitizeRequestRoute(req.originalUrl); // /manager/create-ticket
    const response = hasRouteAccess(req.method, path, req.user.role); //  POST, /manager/create-ticket, manager
    if (!response.routeAccess) {
      return res.status(response.status).json({
        code: response.code,
        message: response.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      code: "INTERNAL SERVER ERROR",
      message: `An internal server error occured. \n ${error.message}`,
    });
  }
  next();
};

const sanitizeRequestRoute = (route) => {

  // /api/manager/create-ticket [/api/manager/create-ticket]

  let path = route.split("?")[0]; // /api/manager/create-ticket
  path = path.replace("/api", "");// /manager/create-ticket
  path = path.split("/"); // [manager,create-ticket]
  const finalPath = []; // [manager,create-ticket]

  path.forEach((p) => {
    if (p === "") return;
    if (p.charAt(0) === ":") {
      finalPath.push("*");
    } else {
      finalPath.push(p);
    }
  });
//  [manager,get-manger,*]
// 
  const apiPath = `/${finalPath.join("/")}`; // /manager/create-ticket
  return apiPath;
};

module.exports = roleRouteAccess;
