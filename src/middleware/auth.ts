import { ErrorCode } from "../util/errorCode";
import { User } from "../model/User";
import { verifyToken } from "../util/jwtToken";

export async function verifyBearerToken(req, res, next) {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    console.log('Found "Authorization" header');
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("no jwt");
    return res.status(401).json({
      errorCode: ErrorCode.TOKEN_NOT_FOUND,
      message: "no jwt",
      statusCode: 401,
    });
  }

  try {
    const { userId } = verifyToken(idToken);
    console.log("correctly userId", userId);
    req.user = await User.findOne({
      attributes: ["id", "userName", "createdAt", "updatedAt", "isDelete"],
      where: { id: userId },
      raw: true,
    });
    if (req.user.isDelete) {
      return res.status(401).json({
        errorCode: ErrorCode.INVALID_TOKEN,
        message: "deleted user",
        statusCode: 401,
      });
    }
    return next();
  } catch (error) {
    console.error("Error while verifying token : ", error);
    return res.status(401).json({
      errorCode: ErrorCode.INVALID_TOKEN,
      message: error.message,
      statusCode: 401,
    });
  }
}
