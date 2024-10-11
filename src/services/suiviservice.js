import { instance } from "./Api";
export const getSuivis = () => instance.get('/suivi').then(res => res.data);
export const getSuivi = (id) => instance.get('/suivi/'+ id).then(res => res.data);
export const createSuivi = (data) => instance.post('/suivi',data).then(res => res.data);
export const deleteSuivi = (id) => instance.delete('/suivi/'+ id).then(res => res.data);
export const updateSuivi = (id,data) => instance.patch('/suivi/'+id,data).then(res => res.data);     