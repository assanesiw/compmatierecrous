import { instance } from "./Api";

export const getInventaires = () => instance.get('/inventaire').then(res => res.data);
export const getInventaire = (id) => instance.get('/inventaire/'+ id).then(res => res.data);
export const createInventaire = (data) => instance.post('/inventaire',data).then(res => res.data);
export const deleteInventaire = (id) => instance.delete('/inventaire/'+ id).then(res => res.data);
export const updateInventaire = (id,data) => instance.patch('/inventaire/'+id,data).then(res => res.data);