/* Packages */
import { use } from 'react';

/* Components */
import { Context } from '@/context/Context';

/* Custom hook for consuming context */
export const useAppContext = () => use(Context);
