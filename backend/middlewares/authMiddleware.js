import JWT from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Auth Failed" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    console.log('Payload:', payload);
    req.user = { userId: payload.userId, userType: payload.usertype }; // Use 'usertype'
    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth Failed" });
  }
};

export default userAuth;