/* Packages */
import { use } from 'react';

/* Components */
import { Context } from '../Context';

/* Custom hook for consuming context */
export const useAppContext = () => use(Context);
