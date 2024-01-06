import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    next("User authentication failed");
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log(error);
    next("User authentication failed");
  }
};

export default userAuth;
