import { storeToRefs } from 'pinia'
import { useUsersStore } from '../stores/users.js'

export const useUsers = () => {
    const usersStore = useUsersStore()
    const { 
        updateUsername, login, recovery, actionEditUserInfo, resetPassword, createUser, fetchUsers, fetchUser, updateInfoUser, setStatusUser, removeRecord, updateImgProfile, cloneSession, saveSignature, reset
    } = usersStore
    const { AppActiveUser, users, menus, user_edit } = storeToRefs(usersStore)
    

    return {
        AppActiveUser,
        users,
        menus,
        user_edit,
        updateUsername, login, recovery, actionEditUserInfo, resetPassword, createUser, fetchUsers, fetchUser, updateInfoUser, setStatusUser, removeRecord, updateImgProfile, cloneSession, saveSignature, reset
    }
}