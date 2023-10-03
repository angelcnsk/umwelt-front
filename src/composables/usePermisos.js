import { storeToRefs } from 'pinia'
import { usePermisosStore } from '../stores/rolesPermisos.js'

export const usePermisos = () => {
    const permisosStore = usePermisosStore()
    const { 
        getRoles, getRole, getModules, getPermissions, savePermission, saveRole, addPermissionsToRole, addRolesToUser, 
    } = permisosStore
    const { roles, permisos, modulos, role } = storeToRefs(permisosStore)
    

    return {
        getRoles, getRole, getModules, getPermissions, savePermission, saveRole, addPermissionsToRole, addRolesToUser, 
        roles, permisos, modulos, role
    }
}