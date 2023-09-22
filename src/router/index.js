import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

import { signOut } from "firebase/auth";
import { auth } from "boot/firebase";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */


//se tienen que agregar las rutas que se definieron en el archivo routes
const rutas = routes.routes

//usuario con sesión activa
const token = localStorage.backendToken != undefined ? JSON.parse(localStorage.getItem('backendToken')) : null
// console.log(token, JSON.parse(localStorage.getItem('sessionToken')))

export default route(function (/* { store, ssrContext } */ ssrContext) {
  const createHistory = process.env.MODE === 'ssr'
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  function clearSession () {
    return new Promise((resolve) => {
      localStorage.removeItem('backendToken')
      localStorage.removeItem('userInfo')
      sessionStorage.clear()
      resolve(true)
    })
  }
  
  function getMenus () {
    return new Promise((resolve, reject) => {
      const items = JSON.parse(localStorage.getItem('userInfo'))
      if (items.menus !== null && items.menus !== undefined) {
        resolve(true)
      } else {
        return reject(false)
      }
    })
  }
  
  function checkRole (roles, rule) {
    if(!roles.includes('user')){
      roles.push('user')
    }
    var count = 0
    roles.filter(role => {
      if(rule.includes(role)) count++
    })
    return count
  }
  
  function getActiveUser () {
    return new Promise((resolve) => {
      resolve(JSON.parse(localStorage.getItem('userInfo')))
    })
  }
  
  const beforeUnloadListener = (event) => {
    event.preventDefault();
    return event.returnValue = 'Are you sure you want to exit?';
  };

  const routesName = ['completar-reconocimiento', 'servicio','cliente']

  Router.beforeEach(async (to, from, next) => {
    getActiveUser().then(async (user) => {
      
      if ((to.path === '/login' && from.path == '/login' || from.path == '/' && to.path === '/') && user === null) {
        // console.log('hace redirect en login', from, to)
        return next()
      } 

      if (routesName.includes(to.name)) {
        window.addEventListener('beforeunload', beforeUnloadListener, {capture: true});
      }

      if (routesName.includes(from.name)){
        window.removeEventListener('beforeunload', beforeUnloadListener, {capture: true});
      }
      
      if (to.path === '/logout') {
        const logout = await signOut(auth)
        const close = await clearSession()
        if (close) window.location.replace(`/`)
      }
      
      if (user !== null && user.id) {
        // console.log(to.query)
        if (to.query.reload) {
          return next({name:'index-admin'})  
        }
      
        if (to.meta.authRequired) {
          // console.log('qué hace?', user)
          if (checkRole(user.perfiles, to.meta.rule) >= 1) {
            return next()
          } else {
            // console.log('no autorizado', user)
            return next('/pages/not-authorized')
          }
        } else if (from.path === '/' || from.path === '/login') {
          // console.log('pasa por redirect')
          // return next()
          return next('/admin/dashboard')
        } 
      } else if (to.name === 'recovery-pass') {
        return next()
      } else {
        // console.log('no hay usuario', user)
        clearSession()
        window.location.replace(`/`)
      }
      return next()
    })
    
  })

  return Router
})
