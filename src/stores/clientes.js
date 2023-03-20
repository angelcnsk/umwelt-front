import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useClientesStore = defineStore('clientes', {
    state: () => {
        return { 
            clients:[],
            cities:[],
            states:[],
            editClient:[],
            clientesPrincipales:[],
            selectActivity:null,
            clienteSelected:null
        }
    },
    actions:{
        getClients (req) {
            const options = {
              params:{
              }
            }
            
            return new Promise((resolve, reject) => {
              api.get('spa/getClientes', options).then((response) => {
                this.clients = response.data
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        getMainClient (req) {
            const options = {
              params:{
                cliente:req.cliente
              }
            }
            
            return new Promise((resolve, reject) => {
              api.get('spa/getMainClient', options).then((response) => {
                this.clientesPrincipales = response.data
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        getActivity (payload) {
            const url = 'spa/getActivity'
            const options = {
              // headers:{'Authorization': `Bearer ${token.accessToken}`},
              params: {search:payload}
            }
        
            return new Promise((resolve, reject) => {
              if (payload !== '') {
                api.get(url, options).then((response) => {
                  commit('SET_ACTIVITY_LIST', response.data)
                  resolve(response.data)
                }).catch((error) => { reject(error) })
              } else {
                reject()
              }
            })
        },
        fetchClient (clientId) {
            const url = 'spa/getClientes'
            const options = {
              params: {id:clientId}
            }
        
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.editClient = response.data
                resolve()
              }).catch((error) => { reject(error) })
            })
          },
        getStates (req) {
            const url = 'spa/getEstados'
            const options = {
            //   params: {id:companyId}
            }
        
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.states =response.data
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        getCities (payload) {
            const url = 'spa/getCiudades'
            const options = {
              params: {stateid:payload}
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.cities = response.data
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        createClient (payload) {
            const url = 'spa/createClient'
            const options = {              
            //   params: payload
            }
            return new Promise((resolve, reject) => {
              api.post(url, payload, options)
                .then((response) => {
                  resolve(response)
                })
            })  
        },
        addFactory (payload) {
          const url = 'spa/addFactory'
          const options = {              
          //   params: payload
          }
          return new Promise((resolve, reject) => {
            api.post(url, payload, options)
              .then((response) => {
                resolve(response)
              })
          })  
        },
        newAddress (payload) {
          const url = 'spa/newAddress'
          const options = {              
          //   params: payload
          }
          return new Promise((resolve, reject) => {
            api.post(url, payload, options)
              .then((response) => {
                resolve(response)
              })
          })  
        },
        updateClient (payload) {
            const url = 'spa/updateClient'
            const options = {
            //   params: payload
            }
            console.log('payload', payload)
            return new Promise((resolve, reject) => {
              api.post(url, payload, options)
                .then((response) => {
                  resolve(response)
                })
            })
        },
        createContact  (payload) {
          const url = 'spa/contact'
          const options = {
          //   params: payload
          }
          return new Promise((resolve, reject) => {
            api.post(url, payload, options)
              .then((response) => {
                resolve(response)
              })
          })
        },
    }
})