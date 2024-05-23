import { instance } from "./Api";

export const getAttributions = () => instance.get('/attribution').then(res => res.data);
export const getAttribution = (id) => instance.get('/attribution/'+ id).then(res => res.data);
export const createAttribution = (data) => instance.post('/attribution',data).then(res => res.data);
export const deleteAttribution = (id) => instance.delete('/attribution/'+ id).then(res => res.data);
export const updateAttribution = (id,data) => instance.patch('/attribution/'+id,data).then(res => res.data);