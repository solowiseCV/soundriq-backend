import UserModel from "../models/userModel";

class UserService {
  static async registerUser(userData: { name: string; email: string }) {
    const user = await UserModel.createUser(userData);
    return user;
  }

  static async getUser(email: string) {
    const user = await UserModel.getUserByEmail(email);
    return user;
  }

  static async getAllUsers() {
    const users = await UserModel.getAllUsers();
    return users;
  }
}

export default UserService;
