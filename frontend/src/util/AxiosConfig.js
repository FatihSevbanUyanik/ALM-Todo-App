import axios from "axios"
import Keys from "@/util/keys"

// constants
const CONTEXT_PATH = "api/v1"
const ACCEPTS = 'application/json'
const CONTENT_TYPE = 'application/json'

console.log(Keys)

const axiosInstance = axios.create({
    baseURL: `http://localhost:8080/${CONTEXT_PATH}/`,
    responseType: 'json'
})

axiosInstance.defaults.headers.post['Content-Type'] = CONTENT_TYPE;
axiosInstance.defaults.headers.post['Accepts'] = ACCEPTS;

export default axiosInstance;

export const URL = {
    TODO_CREATE: 'todo',
    TODO_UPDATE: 'todo',
    TODO_DELETE: 'todo',
    TODO_RETRIEVE: 'todo',
    SIGN_IN: 'auth/signIn',
    SIGN_UP: 'auth/signUp',
    FORGOT_PASSWORD: 'auth/forgot-password',
}
