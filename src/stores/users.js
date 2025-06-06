import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { auth } from "boot/firebase";
import {signInWithCredential, GoogleAuthProvider } from "firebase/auth"
import { getStorage, ref, uploadBytes } from "firebase/storage";

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
    profileUpdate (payload) {
      return new Promise(async (resolve, reject) => { 
        const url = 'spa/updateUser'
        const token = JSON.parse(localStorage.getItem('backendToken'))
        const options = {
          headers:{'Authorization': `Bearer ${token.accessToken}`}
        }
        
        api.post(url, payload, options)
          .then(response => resolve(response))
          .catch(error => reject(error));
      })
    },
    login (payload) {
      return new Promise(async (resolve) => {
        const response = await api.post('/login', payload)
          if(response.data.error){
            resolve(response)
          } else {
              const token = JSON.stringify(response.data)
              localStorage.setItem('backendToken', token)
              new GoogleAuthProvider();
              
              try {
                const credential = GoogleAuthProvider.credential(null, response.data.googleToken);

                const userCredential = await signInWithCredential(auth, credential);
    
                // Acceso al usuario autenticado
                const user = userCredential.user;
    
                // Aquí puedes manejar la respuesta del inicio de sesión exitoso
                console.log("Inicio de sesión exitoso:", user);
                await this.fetchUser()
              } catch (error) {
                console.log(error)
              }

              resolve(response)
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
      //crea el usuario en mysql
      payload.password = '12345678'
      return new Promise(async(resolve) => {
        const url = 'spa/createUser'
        const options = {
          // headers:{'Authorization': `Bearer ${token.accessToken}`}
        }
        const responseBack = await api.post(url, payload, options)
        resolve(responseBack.data)
      })
    },
    fetchUsers () {
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
          params:{
            id: userId
          },
        }
        api.get('spa/getUser', options).then((response) => {
          const infoUser = response.data.userData
          
          if (userId === undefined || userId === null) {
            this.AppActiveUser = response.data.userData
            this.menus = response.data.userData.menus
            
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
            resolve(response)
          })
          .catch((error) => { reject(error) })
      })
    },
    async updateImgProfile (formData) {
      const file = formData.get('file')
      // Get a reference to the storage service, which is used to create references in your storage bucket
      const storage = getStorage();

      //se sustituye @ y se crea el path de la imagen
      
      let avatar_path = `user_profile/user_${formData.get('user_id')}/${formData.get('user_id')}_${formData.get('email')}.${file.type.substr(6)}`
      
      // Create a storage reference from our storage service
      const storageRef = ref(storage,`${avatar_path}`);

      let error = false
      uploadBytes(storageRef, file).catch((e) => {
        if(e.error || e.code) error = true
      })
      
      if (error) return {data:{error:true}}

      const url = 'spa/updateImgProfile'
      const options = {
        //   params:payload
      }

      avatar_path = avatar_path.replace(/@/g, '%40')
      
      const avatar = `${import.meta.env.VITE_bucket}${avatar_path}`
      const objProfile = {
        user_id:formData.get('user_id'),
        url:avatar
      }

      const response = await api.post(url, objProfile, options)
      if(response.status == 200){
        //modifico la avatar_url en el localstorage
        const getUserInfo = JSON.parse(localStorage.getItem('userInfo'))
        getUserInfo.avatar = avatar
        localStorage.setItem('userInfo', JSON.stringify(getUserInfo))
        this.AppActiveUser.avatar = avatar
        this.user_edit.avatar = avatar
        return response
      } else {
        return {data:{error:true}}
      }
      
      
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
        api.post(url, payload,options).then(() => {
          resolve(true)
        })
          .catch((error) => { reject(error) })
      })
    }
  },
})