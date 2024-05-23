import { instance } from "./Api";

export const getReceptions = () => instance.get('/reception').then(res => res.data);
export const getReception = (id) => instance.get('/reception/'+ id).then(res => res.data);
export const createReception = (data) => instance.post('/reception',data).then(res => res.data);
export const deleteReception = (id) => instance.delete('/reception/'+ id).then(res => res.data);
export const updateReception = (id,data) => instance.patch('/reception/'+id,data).then(res => res.data);     