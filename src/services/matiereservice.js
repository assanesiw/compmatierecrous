import { instance } from "./Api";

export const getMatieres = () => instance.get('/matiere').then(res => res.data);
export const createMatiere = (data) => instance.post('/matiere',data).then(res => res.data);
export const deleteMatiere = (id) => instance.delete('/matiere/'+ id).then(res => res.data);
export const updateMatiere = (id,data) => instance.patch('/matiere/'+id,data).then(res => res.data);