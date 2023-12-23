import { Router } from 'express'
import {getAll, getById,add, update, remove,updateFavorite}  from "../../conrolers/contacts-controler.js"

 import isEmptyBody from '../../middlewares/isEmptyBody.js';
import isValidId from '../../middlewares/isValidID.js';


const router = Router();

router.get('/', getAll);

 router.get('/:contactId', isValidId, getById);

 router.post('/',isEmptyBody,add);
 router.put('/:contactId', isValidId, isEmptyBody, update );

 router.delete('/:contactId', isValidId, remove);
 router.patch('/:contactId/favorite', isValidId,  updateFavorite);


export default router
