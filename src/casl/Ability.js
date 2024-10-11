import { defineAbility } from '@casl/ability';

export const USER_ROLE = {
    'ADMIN' : 'admin',
    'Directeur' : 'directeur',
    'CM' : 'CM',
    'CSA' : 'CSA',
    'CSAP' : 'CSAP',
    'GES_STOCK' : 'GES_STOCK',
    'CONTROLE' : 'CONTROLE'
  }

 

export default defineAbility((can,cannot) => {
 can(USER_ROLE.Directeur,'view');
 cannot(USER_ROLE.CSA,'view');
 cannot(USER_ROLE.CM,'view');
 cannot(USER_ROLE.CSAP,'view',);
 cannot(USER_ROLE.GES_STOCK,'view',);
 cannot(USER_ROLE.CONTROLE,'view',);
});
