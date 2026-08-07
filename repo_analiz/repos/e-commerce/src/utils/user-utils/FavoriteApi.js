import { apiStore } from "../../service/api"


export const sendFavorite = async (id) => {
    const {api} = apiStore()
    const req = await api.post(`/favorite/create/${id}`)
    return req.data.favorite
}
