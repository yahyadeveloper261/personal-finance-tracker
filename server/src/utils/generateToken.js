import jwt from "jsonwebtoken";

export const generateUserToken = (user) => {
  // Access Token
  const accessToken = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
    expiresIn: "45m",
  });

  // Refresh Token
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
