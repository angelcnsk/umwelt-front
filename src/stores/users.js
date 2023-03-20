import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useUsersStore = defineStore('users', {
  state: () => {
    return { 
      users: [],
      user_edit:{uid:null},
      permissions:[],
      AppActiveUser:{
        uid:null,
        avatar: '' // From Auth
      },
      user_firebase:{},
      menus:[]
    }
  },
  actions: {
    updateUsername (payload) {
      console.log('update user name', payload)
      payload.user.updateProfile({
        displayName: payload.displayName
      }).then(() => {
  
        // If username update is success
        // update in localstorage
        const newUserData = Object.assign({}, payload.user.providerData[0])
        newUserData.displayName = payload.displayName
        // commit('UPDATE_USER_INFO', newUserData, {root: true}) // así indica que la mutación está en el archivo global
        dispatch('usersManagement/actionEditUserInfo', newUserData, {root:true})
  
        // If reload is required to get fresh data after update
        // Reload current page
        if (payload.isReloadRequired) {
          router.push(router.currentRoute.query.to || '/')
        }
      }).catch((err) => {
        return err
      })
    },
    async login (req) {
      return new Promise((resolve, reject) => {
        try {
          api.post('/login', req).then((response) => {
            console.log(response)
            if (response.data.error) {
              resolve('Error')
            } else {
              const token = JSON.stringify(response.data)
              localStorage.setItem('backendToken', token)
              
              this.fetchUser().then((user) => {
                resolve(response)
              })
            }
          }).catch((e) => { console.log(e); reject(e) })
        } catch (error) {
          return error
        }
      })
    },
    async recovery (email) {
      const options = {
        params:email
      }
      return new Promise((resolve) => {
        api.get('/recovery', options).then((response) => {
          resolve(response.data)
        })
      })
    },
    actionEditUserInfo (payload) {
      commit('UPDATE_USER_INFO', payload.data)
    },
    resetPassword (params) {
      // const options = {
      //   params
      // }
      return new Promise((resolve) => {
        api.post('/resetPassword', params).then((response) => {
          resolve(response)
        }).catch((e) => { resolve(e) })
      })
    },
    createUser (payload) {
      const url = 'spa/createUser'
      
      const options = {
        // headers:{'Authorization': `Bearer ${token.accessToken}`}
      }
      return new Promise((resolve, reject) => {
        api.post(url, payload, options)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => { reject(error) })
      })
    },
    fetchUsers (req) {
      const url = 'spa/usersList'
      
      const options = {
        // headers:{'Authorization': `Bearer ${token.accessToken}`}
      }
      return new Promise((resolve, reject) => {
        api.get(url, options)
          .then((response) => {
            this.users =  response.data
            resolve('success')
          })
          .catch((error) => { reject(error) })
      })
    },
    fetchUser (userId) {  
      
      return new Promise((resolve, reject) => {
        //dejamos recuperación de token desde local storage porque no alcanza a setear en axios
        const token = JSON.parse(localStorage.getItem('backendToken'))
        const options = {
          headers:{'Authorization': `Bearer ${token.accessToken}`},
          params:{id: userId},
        }
        api.get('spa/getUsuario', options).then((response) => {
          const infoUser = response.data.userData
          
          if (userId === undefined || userId === null) {
            this.AppActiveUser = response.data.userData
            this.menus = response.data.userData.menus
            // this.AppActiveUser.avatar = infoUser.avatar != null ? infoUser.avatar : '/src/assets/avatars/avatar-s-11.png'
            
            infoUser.rules = []
            
            infoUser.roles.forEach(element => {
              infoUser.rules.push(element.slug)
            });
            
            localStorage.setItem('userInfo', JSON.stringify(infoUser))

          } else {
            this.user_edit = infoUser
            
            if (this.user_edit.id === this.AppActiveUser.id) {
              
              this.AppActiveUser.name = infoUser.name
              this.AppActiveUser.email = infoUser.email
              this.AppActiveUser.role = infoUser.role === null ? 'user' : infoUser.role.toLowerCase()
              this.AppActiveUser.owner = infoUser.owner
              this.AppActiveUser.signature = infoUser.signature
              // this.AppActiveUser.avatar = infoUser.avatar != null ? infoUser.avatar : '/src/assets/avatars/avatar-s-11.png'
              
              // console.log('antes de guardar en localstorage', infoUser)
              localStorage.setItem('userInfo', JSON.stringify(infoUser))
            }
          }
          
          resolve('responde')    
        })
          .catch((error) => {
            reject(error)
          })
      })
    },
    async updateInfoUser (payload) {
      const url = 'spa/updateUser'
      const token = JSON.parse(localStorage.getItem('backendToken'))
      const options = {
        headers:{'Authorization': `Bearer ${token.accessToken}`}
      }
      // return new Promise((resolve, reject) => {
      const setUserLaravel = await api.post(url, payload, options)
      console.log(setUserLaravel)
    },
    //activa/inactiva el usuario
    setStatusUser (payload) {
      const url = 'spa/updateUser'
      
      const options = {
      //   params:payload
      }
  
      return new Promise((resolve, reject) => {
        api.post(url, payload, options).then(() => {
          resolve()
        }).catch((error) => { reject(error) })
      })
    },
    removeRecord (userId) {
      const url = `spa/users/${userId}`
      const token = JSON.parse(localStorage.getItem('backendToken'))
      const options = {
        headers:{'Authorization': `Bearer ${token.accessToken}`}
      //   params:payload
      }
      return new Promise((resolve, reject) => {
        api.delete(url, options)
          .then((response) => {
            commit('REMOVE_RECORD', userId)
            resolve(response)
          })
          .catch((error) => { reject(error) })
      })
    },
    updateImgProfile (formData) {
      const url = 'spa/updateImgProfile'
      const options = {
      //   params:payload
      }
      return new Promise((resolve, reject) => {
        api.post(url, formData, options).then((response) => {
          const avatar_url = response.data.url
          //modifico la avatar_url en el localstorage
          const getUserInfo = JSON.parse(localStorage.getItem('userInfo'))
          getUserInfo.avatar = avatar_url
          localStorage.setItem('userInfo', JSON.stringify(getUserInfo))
    
          this.AppActiveUser.avatar = avatar_url
          this.user_edit.avatar = avatar_url
          resolve(response)
        })
          .catch((error) => { reject(error) })
      })
    },
    async cloneSession (user) {
      const url = 'cloneSession'
      const cloneMainToken = localStorage.getItem('backendToken')
      const cloneMainUser = localStorage.getItem('userInfo')
      localStorage.setItem('mainToken', cloneMainToken)
      localStorage.setItem('mainUserInfo', cloneMainUser)
  
      const token = JSON.parse(localStorage.getItem('backendToken'))
      const options = {
        headers:{'Authorization': `Bearer ${token.accessToken}`},
        params:{
          id: user.id,
          clone: true
        }
      }
  
      await commit('CLEAN_ACTIVE_USER')
  
      const response = await api.get(url, options)
      localStorage.setItem('backendToken', JSON.stringify(response.data))
      window.location.replace(`${location.href}`)
      return false
    },
    saveSignature (formData) {
      const url = 'spa/saveSignature'
      
      const options = {
      //   params:payload
      }
      return new Promise((resolve, reject) => {
        api.post(url, formData, options).then((response) => {
          resolve(response)
        })
          .catch((error) => { reject(error) })
      })
    },
    reset(payload){
      const url = 'spa/resetPass'
      const options = {
        // params:payload
      }
      return new Promise((resolve, reject) => {
        api.post(url, payload,options).then((response) => {
          resolve(true)
        })
          .catch((error) => { reject(error) })
      })
    }
  },
})