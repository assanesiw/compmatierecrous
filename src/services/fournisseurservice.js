import { instance } from "./Api";

export const getFournisseur = () => instance.get('/fournisseur').then(res => res.data);
export const createFournisseur = (data) => instance.post('/fournisseur',data).then(res => res.data);
export const deleteFournisseur = (id) => instance.delete('/fournisseur/'+ id).then(res => res.data);
export const updateFournisseur = (id,data) => instance.patch('/fournisseur/'+id,data).then(res => res.data);