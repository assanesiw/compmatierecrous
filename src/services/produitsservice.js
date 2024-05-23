import { instance } from "./Api";

export const getProdits = () => instance.get('/produits').then(res => res.data);
export const getProduit = (id) => instance.get('/produits/'+ id).then(res => res.data);
export const createProduits = (data) => instance.post('/produits',data).then(res => res.data);
export const deleteProduits = (id) => instance.delete('/produits/'+ id).then(res => res.data);
export const updateProduits = (id,data) => instance.patch('/produits/'+id,data).then(res => res.data);
export const updatePhotoProduit = (id,data) => instance.patch('/produits/photo/'+id,data).then(res => res.data);     