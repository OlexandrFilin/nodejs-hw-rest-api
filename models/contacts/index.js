import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import path from 'path';

const pathContacts = path.resolve('models','contacts','contacts.json');
const updateFileContacts=(contacts)=>
    fs.writeFile(pathContacts,JSON.stringify(contacts,null,"\t"));

export const  listContacts = async  ()=> {
 const data =  await fs.readFile(pathContacts);
 return JSON.parse(data);
}

export const  getContactById = async (id)=>{
    const contacts = await listContacts();
    const contact = contacts.find((item)=>item.id === id);
    return contact||null;
}
export const addContact = async (data)=>{
    const contacts = await listContacts();
    const contact = {id:nanoid(),...data} 
    contacts.push(contact) ;     
await updateFileContacts(contacts);
    
    return contact;
}

export const removeContact = async (id)=>{
   const contacts = await listContacts();
    const delContIndex = contacts.findIndex((item)=>item.id === id);
     if (delContIndex === -1){
        return null;
     }
     const [delContact] =  contacts.splice(delContIndex,1);
     await updateFileContacts(contacts);
    return delContact||null;
}

export const updateById = async (id,data)=>{
   const contacts = await listContacts();
    const updateContIndex = contacts.findIndex((item)=>item.id === id);
     if (updateContIndex === -1){
        return null;
     }
    
     contacts[updateContIndex] = {...contacts[updateContIndex],...data };
 
     await updateFileContacts(contacts);
    return  contacts[updateContIndex]||null;
}