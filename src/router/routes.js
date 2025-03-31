import { auth } from "boot/firebase";
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
  // {
  //   path: '/_/auth/action',
  //   name: 'recovery',
  //   component: () => import('src/pages/RecoveryPage.vue')
  // },
  {
    // path:'/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '/admin/dashboard', component: () => import('src/pages/admin/MainDashboard.vue'), 
        name:'index-admin',
        meta: { rule: ['user', 'admin', 'inspeccion'], authRequired: true}
      },
      {path: '/admin/usuarios', component: () => import('pages/admin/usuarios/ListaUsuarios.vue'), 
        name:'usuarios',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/usuarios/:id', component: () => import('pages/admin/usuarios/EditarUsuario.vue'), 
        name:'editar-usuario',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/roles', component: () => import('src/pages/admin/roles/RolesPage.vue'), 
        name:'roles',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/permisos', component: () => import('src/pages/admin/roles/PermisosPage.vue'), 
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
      {path: '/admin/clientes/', component: () => import('src/pages/admin/clientes/ClientesPage.vue'), 
        name:'clientes',
        meta: { rule: ['admin','root','inspeccion'], authRequired: true}
      },
      {path: '/admin/clientes/cliente/:id?', component: () => import('src/pages/admin/clientes/ClientePage.vue'), 
        name:'cliente',
        meta: { rule: ['admin','root','inspeccion'], authRequired: true}
      },
      {path: '/admin/productos/', component: () => import('src/pages/admin/productos/ProductosPage.vue'), 
        name:'productos',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/servicios/', component: () => import('src/pages/admin/servicios/ServiciosPage.vue'), 
        name:'servicios',
        meta: { rule: ['admin','root','inspeccion'], authRequired: true}
      },
      {path: '/admin/servicios/servicio/:id?', component: () => import('src/pages/admin/servicios/ServicioPage.vue'), 
        name:'servicio',
        meta: { rule: ['admin','root'], authRequired: true}
      },
      {path: '/admin/captura/', component: () => import('src/pages/admin/capturas/CapturasPage.vue'), 
        name:'capturas',
        meta: { rule: ['admin','root','user','inspeccion','captura'], authRequired: true}
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
