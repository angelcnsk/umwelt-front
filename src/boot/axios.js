import { boot } from 'quasar/wrappers'
import axios from 'axios'
import * as Sentry from "@sentry/vue";

let domain = import.meta.env.VITE_api_host
// console.log('domain',domain, import.meta.env.VITE_api_host)

// if(window.location.hostname == 'localhost'){
//     domain = 'https://admin.test/api'
// }
// else if(window.location.hostname == 'dev.masnominamx.com') {
//     domain = 'https://test.masnominamx.com/api'
// }


const token = JSON.parse(localStorage.getItem('backendToken'))
const bearer = token != null ? token.accessToken : null

const api = axios.create({
    baseURL: domain,
    headers:{'Authorization': `Bearer ${bearer}`}
});


export default boot(({ app }) => {
    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axios = axios
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = api
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API
})
api.interceptors.response.use(
    res => res,
    error => {
        const requestData = error.config?.data;
        const responseData = error.response?.data;
        const requestUrl = error.config?.url; // <-- Aquí obtienes la URL del request
        const requestMethod = error.config?.method?.toUpperCase();
        const responseStatus = error.response?.status;

        //Serializar el payload antes de enviarlo
        requestData
            ? JSON.stringify(requestData, null, 2)
            : "No request data";
        responseData
            ? JSON.stringify(responseData, null, 2)
            : "No response data";

        Sentry.captureException(error, {
            extra: {
                url: requestUrl,
                method: requestMethod,
                requestBody: requestData, // Aquí ves el payload enviado
                responseStatus,
                responseData, // Respuesta del servidor si está disponible
            },
        });
        if (error && error.response.status === 401) {
        //si el token venció cierra sesión y dirige al login
            window.location.replace('/logout')
        }
        return error
    }
)

// api.interceptors.response.use(function(response) {
//   return response
// }, function (error) {
//     return Promise.reject(error);
//     console.log('axios boot error', error)
//     if (error && error.status === 401) {
//         //si el token venció cierra sesión y dirige al login
//         window.location.replace('/logout')
//     }
// })

export { axios, api };
