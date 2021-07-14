import http from "src/utils/http-common";
import localStorageService from "./localStorageService";

class JwtAuthService {

  // Dummy user object just for the demo
  user = {
    userId: "1",
    role: 'ADMIN',
    displayName: "Nguyễn Phi Khang",
    email: "jasonalexander@gmail.com",
    photoURL: "/assets/images/face-6.jpeg",
    age: 25,
    token: "faslkhfh423oiu4h4kj432rkj23h432u49ufjaklj423h4jkhkjh"
  }

  // You need to send http request with email and passsword to your server in this method
  // Your server will return user object & a Token
  // User should have role property
  // You can define roles in app/auth/authRoles.js
  loginWithUsernameAndPassword = async (username, password) => {

    const response = await http.post('/account/login', { username: username, password: password });
    const data = await response.data;

    if (typeof (data) !== "string") {
      if (data.permission.id === 1) {
        this.setSession({ username: username, password: password });
        // Set user
        this.setUser(data);

        console.log(("ok"))

        return { success: 1, data: data }
      } else return { success: 0 };
    } else return { success: -1 };
  };

  // You need to send http requst with existing token to your server to check token is valid
  // This method is being used when user logged in & app is reloaded
  loginWithToken = async () => {
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(this.user);
    //   }, 100);
    // }).then(data => {
    //   // Token is valid
    //   this.setSession(data.token);
    //   this.setUser(data);
    //   return data;
    // });

    if (await localStorageService.getItem("jwt_token") !== null){
      const data = await localStorageService.getItem("auth_user");
      return {success: 1, data: data}
    }
    else return await { success: -1 }
  };

  logout = () => {
    this.setSession(null);
    this.removeUser();
  }

  // Set token to all http request header, so you don't need to attach everytime
  setSession = token => {
    if (token) {
      localStorageService.setItem("jwt_token", token);
      // axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      localStorage.removeItem("jwt_token");
      // delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Save user to localstorage
  setUser = (user) => {
    localStorageService.setItem("auth_user", user);
  }
  // Remove user from localstorage
  removeUser = () => {
    localStorageService.removeItem("auth_user");
  }
}

export default new JwtAuthService();
