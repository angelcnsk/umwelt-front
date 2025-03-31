import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const usePermisosStore = defineStore('rolesPermisos', {
    state: () => {
        return { 
          roles:[],
          permisos:[],
          modulos:[],
          role:''
        }
    },
    actions:{
        getRoles () {
            const url = 'spa/getRoles'
            
            const options = {
            //   params:{
            //     id:userId
            //   }
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.roles = response.data
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        getRole (roleId) {
            const url = 'spa/getRole'
            
            const options = {
              params:{id:roleId}
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.role = response.data.role
                resolve(response)
              })
                .catch((error) => {
                  reject(error)
                })
            })
        },
        getModules () {
            const url = 'spa/getModules'
            
            const options = {
            //   params:{id:roleId}
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.modulos = response.data
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        getPermissions () {
            const url = 'spa/getPermissions'
            
            const options = {
            //   params:{id:roleId}
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.permisos = response.data
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        savePermission (payload) {
            const url = 'spa/savePermission'
            const options = {
            //   params: payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        saveRole (payload) {
            const url = 'spa/saveRole'
            
            const options = {
            //   params: payload
            }
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        addPermissionsToRole (payload) {
            const url = 'spa/addPermissionsToRole'
            
            const options = {
            //   params: payload
            }
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        addRolesToUser (payload) {
            const url = 'spa/addRolesToUser'
            
            const options = {
              params: payload
            }
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        }
    }
})