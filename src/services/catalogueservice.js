import { instance } from "./Api";

export const getCatalogue = () => instance.get('/catalogue').then(res => res.data);
export const createCatalogue = (data) => instance.post('/catalogue',data).then(res => res.data);
export const deleteCatalogue = (id) => instance.delete('/catalogue/'+ id).then(res => res.data);
export const updateCatalogue = (id,data) => instance.patch('/catalogue/'+id,data).then(res => res.data);     