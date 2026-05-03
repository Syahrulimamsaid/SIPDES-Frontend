import AuthController from "../controller/AuthController";

const LogKed = async (token: string) => {
  const authController = new AuthController();
  let authorized;

  if (!token) {
    authorized = false;
    return;
  }

  try {
    const user = await authController.logked(token);
    if (!user || user == false) {
      authorized = false;
      return;
    }
    
    localStorage.setItem("phone_number", user.phone_number);
    localStorage.setItem("fullname", user.fullname);
    localStorage.setItem("role", user.role);
    authorized = true;
  } catch (e) {
    console.log(e);
    authorized = false;
  }

  if (authorized === null) return false;
  return authorized;
};

export default LogKed;
