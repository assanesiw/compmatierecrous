import { instance } from "./Api";

export const getMembres = () => instance.get('/membres').then(res => res.data);
export const createMembres = (data) => instance.post('/membres',data).then(res => res.data);
export const deleteMembres = (id) => instance.delete('/membres/'+ id).then(res => res.data);
export const updateMembres = (id,data) => instance.patch('/membres/'+id,data).then(res => res.data);     