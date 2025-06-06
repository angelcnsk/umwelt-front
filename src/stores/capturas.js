import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useCapturasStore = defineStore('capturas', {
    state: () => {
        return { 
            servicesList:[],
            currentService:{},
            categorias:[],
            fechas_visita:[],
            visitSelected:null,
            showActa:false,
            textoActa:'',
            serviceSelected:null,
            visitas:[],
            observaciones:[],
            result:[],
            pendingResult:[],
            pendingObs:[],
            tab:'inspeccion',
            recipientes:[],
            recipienteSelected:null,
        }
    },
    actions:{
        getServiceList (payload) {
            const url = 'spa/getServiceStaff'
            
            const options = {
              params:{id:payload}
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                if (typeof payload === 'undefined') {
                  this.servicesList = response.data.service_list
                  localStorage.setItem('serviceList', JSON.stringify(response.data.service_list))
                }
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        saveCaptures (payload) {
            const url = 'spa/saveCaptures'
            
            const options = {
            //   params:payload
            }
            // const dataCapture = JSON.parse(localStorage.getItem(capturas))
            return new Promise((resolve) => {
              api.post(url, payload, options).then((response) => {
                if(response.data == undefined){
                  resolve(response)
                }
                resolve(response)
              })
            })
        },
        setDateCapture(payload){
            const url = 'spa/setDateCapture'
            
            const options = {
            //   params:payload
            }
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        async saveSectionFile (payload) {
          
          try {
            const url = 'spa/saveFile'
            
            const formData = new FormData()
            formData.append('service_id', payload.service_id)
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
        async getCategoriesBackend (payload){
          const url = 'spa/getCategories'
            
          const options = {
            params:payload
          }
          return new Promise((resolve, reject) => {
            api.get(url, options).then((response) => {
              resolve(response)
            }).catch((error) => { reject(error) })
          })
        },
        async serviceAddVisit (payload){
          const url = 'spa/addVisit'          
          return new Promise((resolve, reject) => {
            api.post(url,payload).then((response) => {
              if(response.data.fechas){
                this.currentService.fechas =response.data.fechas;
              }
                resolve(response)
            }).catch((error) => { reject(error) })
          })
        },
        async getContainers(req){
          const url = 'spa/getContainers'
            const options = {
              params:req
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                this.recipientes = [];
                const filter = response.data.filter((item) => item.visita_id === req.visit_id );

                this.recipientes = filter.map((item) => ({
                    value: item.id,
                    texto: item.name
                }));
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
    }
})