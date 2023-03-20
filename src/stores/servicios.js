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
            recognitions:[],
            recognitionItem: {},
            departmentsList:[],
            tableA1:[],
            signatoryList:[],
            areas:[],
            editArea:true,
            addStaff:true,
            sin_asignar:[],
            asignados:[],
            archivos:[],
            secciones:[],
            dispositivos:[],
            usuariosDevice:[]
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
        getTableA1 (payload) {
            const url = 'spa/getTableA1'
            const options = {
              params:{id:payload}
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                if (typeof payload === 'undefined') {
                  this.tableA1 = response.data
                }
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
                this.serviceItem.requester_avatar = response.data.dataService.requester_avatar == null ? "/assets/avatar-s-11.png" : this.serviceItem.requester_avatar
                this.serviceItem.owner_avatar = response.data.dataService.owner_avatar === null ? "/assets/avatar-s-11.png" : this.serviceItem.owner_avatar
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        generarOT (payload) {
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
        async saveDptoDB (payload) {
            // const resDB = await db.collection('departamentos').add(payload)
            // console.log(resDB)
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
                  item.avatar === null ? '/assets/avatar-s-11.png' : item.avatar
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
            
            try {
              const url = 'spa/saveReportFile'
              
              const formData = new FormData()
              formData.append('service_id', payload.service_id)
              formData.append('report_part_id', payload.seccion_id)
              formData.append('archivos', payload.files)
              
              const options = {
                // params:{service_id:payload.service_id, section:payload.section}
              }
            
              return new Promise((resolve, reject) => {
                api.post(url, formData, options).then((response) => {
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
        getRecognitions (id) {
            const url = 'spa/getReconocimientos'
            const options = {
              params:{recognition_id:id}
            }
        
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                if (id !== undefined) {
                  commit('SET_RECOGNITION_DATA', response.data)
                } else {
                  commit('SET_RECOGNITIONS', response.data)
                }
        
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        saveRecognition (payload) {
            const url = 'spa/saveReconocimiento'
            const options = {
            //   params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        saveCaratulaPayload (payload) {
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
        getDepartments (payload) {
            const url = 'spa/getDepartments'
            const options = {
              params:payload
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.asignados = []
                this.departmentsList = response.data.dptos
                this.usuariosDevice = response.data.dispositivo_usuarios
                if(response.data.areas){
                  response.data.areas.map((area) => {
                    
                    if(area.payload != null){
                      area.payload = JSON.parse(area.payload)
                      area.payload.areas_iluminadas.map((iluminada) => {
                        iluminada.cambiarNombre = false
                      })
                    }
                    if(area.puntos.length > 0){
                      area.puntos.forEach(punto => {
                        if(punto.user_id != null)
                          this.asignados.push(punto)
                      })
                    }
                    
                  })
                  this.areas = response.data.areas
                }
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        async saveAreaPayload (payload) {
            const url = 'spa/createArea'
            
            const options = {
            //   params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
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
                resolve(response.data)
              }).catch((error) => { reject(error) })
            })
        },
        managePoints(payload){
            const url = 'spa/managePoints'
            const options = {
              params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                if(response.data.action == 'get'){
                  this.sin_asignar = response.data.puntos.filter((item) => {
                    if(item.user_id == null) return item
                  })
                  // this.asignados = response.data.puntos.filter((item) => {
                  //   if(item.user_id !== null) return item
                  // })
                }
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        getDevices(payload){
          const url = 'spa/getDevices'
          const options = {
            params:payload
          }  
          return new Promise((resolve, reject) => {
            api.get(url, options).then((response) => {
              this.dispositivos = response.data
              resolve()
            }).catch((error) => { reject(error) })
          })
        }
    }
})