import Cookies from "universal-cookie";
import decode from "jwt-decode";

const cookies = new Cookies();

class AuthProvider {
    getUser() {
        const token = cookies.get("token");
        if (!token) {
            return null;
        }
        return decode(token);
    }

    login(token) {
        cookies.set("token", token);
        location.replace("/")
    }

    isAuthenticated() {
        const token = cookies.get("token");
        if (token) {
            return true;
        }
        return false;
    }

    logout() {
        cookies.remove("token");
        location.replace("/login")
    }
}



const AP = new AuthProvider();

export default AP;