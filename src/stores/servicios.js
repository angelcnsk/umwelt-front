import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useServiciosStore = defineStore('servicios', {
    state: () => {
        return { 
            productos:[],
            nuevoServicio:{productos:{categoria_norma:''}},
            servicesList:[],
            serviceItem:{},
            staff:[],
            signatoryList:[],
            addStaff:true,
            sin_asignar:[],
            asignados:[],
            archivos:[],
            secciones:[],
            containers:[],
        }
    },
    actions:{
        nuevoProducto (payload) {
            const url = 'spa/crearProducto'
            const options = {
            //   params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        getProductos () {
            const url = 'spa/getProductos'
            const options = {
            //   params:payload
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.productos = response.data
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        newService (payload) {
            const url = 'spa/crearServicio'
            const options = {
            //   params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        getServices () {
            const url = 'spa/getServices'
            const options = {
            //   params:payload
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.servicesList = response.data.services
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        getService (id) {
            const url = 'spa/getService'
            const options = {
              params:{servicio_id:id}
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.serviceItem = response.data.dataService
                this.serviceItem.requester_avatar = this.serviceItem.requester_avatar
                this.serviceItem.owner_avatar = this.serviceItem.owner_avatar
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        generarNumDictamen (payload) {
            const url = 'spa/generarFolio'
            const options = {
            //   params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                this.serviceItem.folio = response.data.folio
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        closeServiceStatus (payload) {
            const url = 'spa/editService'
            const options = {
            //   params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        getStaff (payload) {
            const url = 'spa/getStaff'
            const options = {
              params:payload
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                const staff = response.data.staff
                staff.forEach((item) => {
                  item.select = false
                })
                this.staff = staff
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        async selectStaff (payload) {
            payload.type = 'select'
            // commit('SELECT_STATFF', payload)
        
            const userSelect = state.staff[payload.index]
        
            const userData = {
              avatar: userSelect.avatar,
              email: userSelect.email,
              id: userSelect.id,
              name: userSelect.name,
              select: userSelect.select
            }
        
            const data = {user:userData, service_id: payload.service_id, dt: new Date() }
            // const prefix = location.hostname
        
            // if (userSelect.FSId !== undefined && userSelect.FSId !== null) {
            //   const userStaff = await db.collection(`${prefix}_service_staff`).doc(userSelect.FSId).update({
            //     user: userData
            //   })
            //   data.user.FSId = userSelect.FSId
            //   console.log('success update', userStaff)
            // } else {
            //   const resDB = await db.collection(`${prefix}_service_staff`).add(data)
            //   data.user.FSId = resDB.id
            //   payload.FSId = resDB.id
            //   payload.type = 'update'
            //   commit('SELECT_STATFF', payload)
            // }
            const url = 'spa/setStaff'
            const options = {
            //   params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, data, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        
        },
        getFieldSheets (id) {
            const url = 'spa/getFieldSheets'
            
            const options = {
              params:{service_id:id}
            }
        
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        async saveSectionFile (payload) {
            console.log(payload)
            try {
              const url = 'spa/saveFile'
              
              // const formData = new FormData()
              // formData.append('service_id', payload.service_id)
              // formData.append('archivos', payload.files)
              
              const options = {
                // params:{service_id:payload.service_id, section:payload.section}
              }
            
              return new Promise((resolve, reject) => {
                api.post(url, payload, options).then((response) => {
                    resolve(response)
                }).catch((error) => { reject(error) })
              })
            }  
            catch (e) {
              console.log('error guardar archivo', e)
            }
                
            
        },
        getSectionFile (payload) {
            const url = 'spa/findReportFile'
            const options = {
              params:payload
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.archivos = response.data.archivos
                this.secciones = response.data.secciones
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        getReport (id) {
            const url = 'spa/getreport'
            const options = {
              params:{servicio_id: id}
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                // commit('SET_DEPARTMENTS_LIST', response.data)
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        getPdfFieldSheets (id) {
            const url = 'spa/gethojascampo'
            const options = {
              params:{servicio_id:id, responseType:'blob'}
            }
        
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        getSignatoryList (req) {
            const url = 'spa/signatoryList'
            const options = {
            //   params:payload
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.signatoryList = response.data
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        saveSignatory(payload) {
            const url = 'spa/editService'
            const options = {
            //   params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        removeFile(payload) {
            const url = 'spa/removeFile'
            const options = {
            //   params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        async newVisit (payload){
          const url = 'spa/addVisit'
            
          const options = {
            params:{}
          }
          
          return new Promise((resolve, reject) => {
            api.post(url,payload).then((response) => {
              if(response.data.fechas){
                this.serviceItem.fechas =response.data.fechas;
              }

                resolve(response)
            }).catch((error) => { reject(error) })
          })
        },
        async addContainers (payload){
          const url = 'spa/addContainer'
          console.log('payload', payload)  
          const options = {
            params:{}
          }
          
          return new Promise((resolve, reject) => {
            api.post(url,payload).then((response) => {
              resolve(response)
            }).catch((error) => { reject(error) })
          })
        },
        getContainers(req){
          const url = 'spa/getContainers'
            const options = {
              params:req
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.containers = response.data
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        removeContainer(payload) {
          const url = 'spa/removeContainer'
          const options = {
          //   params:payload
          }
      
          return new Promise((resolve, reject) => {
            api.post(url, payload, options).then((response) => {
              resolve(response)
            }).catch((error) => { reject(error) })
          })
      },
    }
})