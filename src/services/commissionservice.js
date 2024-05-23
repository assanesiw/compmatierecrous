import { instance } from "./Api";

export const getCommissions = () => instance.get('/commission').then(res => res.data);
export const getCommission = (id) => instance.get('/commission/'+ id).then(res => res.data);
export const createCommission = (data) => instance.post('/commission',data).then(res => res.data);
export const deleteCommission = (id) => instance.delete('/commission/'+ id).then(res => res.data);
export const updateCommission = (id,data) => instance.patch('/commission/'+id,data).then(res => res.data);