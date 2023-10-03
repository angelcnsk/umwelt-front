import { auth } from "boot/firebase";
import { signOut } from "firebase/auth";

const routes = [
  {
    path: '',
    name:'login',
    component: () => import('pages/Login-1.vue')
  },
  {
    path: '/logout',
    name: 'salir',
    component: () => {
      return new Promise((resolve) => {
        localStorage.removeItem('firebase_id')
        localStorage.removeItem('backendToken')
        localStorage.removeItem('userInfo')
        
        auth.signOut().then((response) => console.log(response)).catch((e) =>   console.log(e))
        // sessionStorage.clear()
        window.location.replace('/')
        resolve(true)
      })
    }
  },
  {
    path: '/_/auth/action',
    name: 'recovery',
    component: () => import('pages/Recovery.vue')
  },
  {
    // path:'/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '/admin/dashboard', component: () => import('pages/admin/Dashboard.vue'), 
        name:'index-admin',
        meta: { rule: ['user', 'admin', 'root', 'captura'], authRequired: true}
      },
      {path: '/admin/usuarios', component: () => import('pages/admin/usuarios/ListaUsuarios.vue'), 
        name:'usuarios',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/usuarios/:id', component: () => import('pages/admin/usuarios/EditarUsuario.vue'), 
        name:'editar-usuario',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/roles', component: () => import('pages/admin/roles/Roles.vue'), 
        name:'roles',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/permisos', component: () => import('pages/admin/roles/Permisos.vue'), 
        name:'permisos',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/asignar-permisos/:id', component: () => import('pages/admin/roles/AsignarPermisos.vue'), 
        name:'assign',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/profile', component: () => import('pages/admin/usuarios/EditProfile.vue'), 
        name:'profile',
        meta: {authRequired: true, rule:['user','admin']}
      },
      {path: '/admin/clientes/', component: () => import('pages/admin/clientes/Clientes.vue'), 
        name:'clientes',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/clientes/cliente/:id?', component: () => import('pages/admin/clientes/Cliente.vue'), 
        name:'cliente',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/productos/', component: () => import('pages/admin/productos/Productos.vue'), 
        name:'productos',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/servicios/', component: () => import('pages/admin/servicios/Servicios.vue'), 
        name:'servicios',
        meta: { rule: ['admin','root','user','captura'], authRequired: true}
      },
      {path: '/admin/servicios/servicio/:id?', component: () => import('pages/admin/servicios/Servicio.vue'), 
        name:'servicio',
        meta: { rule: ['admin','root','user','captura'], authRequired: true}
      },
      {path: '/admin/captura/', component: () => import('pages/admin/capturas/Capturas.vue'), 
        name:'capturas',
        meta: { rule: ['admin','root','user','captura'], authRequired: true}
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  },
]

export default routes
