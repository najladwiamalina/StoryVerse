import HomePage from "../pages/home/home-page";
import AddStoryPage from "../pages/add-story/add-story-page";
import LikedPage from "../pages/liked/liked-page";
import RegisterPage from "../auth/register/register-page";
import LoginPage from "../auth/login/login-page";

const routes = {
  "/": new HomePage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/stories/add": new AddStoryPage(),
  "/liked": LikedPage,
};

export default routes;
