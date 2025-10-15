 
 const API_URL = 'http://localhost:3000/reclamos';

 export const getreclamos = async () => {
     try {
         const response = await fetch(API_URL);
         if (!response.ok) {
             throw new Error('Error al obtener las reclamos.');
         }
         return await response.json();
     } catch (error) {
         console.error('Error en getreclamos:', error);
     }
 };
 
 export const getreclamoById = async (id) => {
     try {
         const response = await fetch(`${API_URL}/${id}`);
         if (!response.ok) {
             throw new Error(`Error al obtener la reclamo con id ${id}.`);
         }
         return await response.json();
     } catch (error) {
         console.error('Error en getreclamoById:', error);
     }
 };
 
 export const createreclamo = async (nuevareclamo) => {
     try {
         const response = await fetch(API_URL, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify(nuevareclamo),
         });
         if (!response.ok) {
             throw new Error('Error al crear el reclamo.');
         }
         return await response.json();
     } catch (error) {
         console.error('Error en createreclamo:', error);
     }
 };
 
 export const updatereclamo = async (id, datosActualizados) => {
     try {
         const response = await fetch(`${API_URL}/${id}`, {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify(datosActualizados),
         });
         if (!response.ok) {
             throw new Error(`Error al actualizar el reclamo con id ${id}.`);
         }
         return await response.json();
     } catch (error) {
         console.error('Error en updatereclamo:', error);
     }
 };
 
 export const deletereclamo = async (id) => {
     try {
         const response = await fetch(`${API_URL}/${id}`, {
             method: 'DELETE',
         });
         if (!response.ok) {
             throw new Error(`Error al eliminar el reclamo con id ${id}.`);
         }
         console.log(`reclamo con id ${id} eliminada.`);
     } catch (error) {
         console.error('Error en deletereclamo:', error);
     }
 };