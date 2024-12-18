import { getData, readData, saveData } from '../../firebaseService';

export async function getCategories(params) {
    try {
        let path = params.path;
        if(params.visita && params.visita>1) path = `servicios/${path}`;

        const categorias = await getData(path);
        if(categorias){
            categorias.forEach((cat) => {
                if(cat.conceptos){
                    cat.conceptos.forEach((concept) => {
                        concept.value = concept.value == 1 ? [] : concept.value;
                    })
                }
            })
        }
        
        return categorias
    } catch (error) {
        console.log('error al obtener categorías', error)
    }
}

export async function getResult(params) {
    try {
        return await readData(`servicios/${params.path}`);
    } catch (error) {
        console.log('error al obtener resultados', error)
    }
}

export async function getObservations(params) {
    try {
        return await readData(params.path);
    } catch (error) {
        console.log('error al obtener observaciones', error)
    }
}

export async function getActa(params) {
    try {
        return await readData(`servicios/${params.service_id}/visita_${params.visita}/acta`);
    } catch (error) {
        console.log('error al obtener acta', error)
    }
}

export async function setConceptsValues(params) {
    try {
        return await saveData(params.path, params.data)
    } catch (error) {
        console.log('error al guardar lista de conceptos', error)
    }
}

