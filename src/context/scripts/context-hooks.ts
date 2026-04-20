/* React */
import { useContext } from 'react';

/* Local components */
import { Context } from '../Context';

/* Custom hook for consuming context */
export const useAppContext = () => useContext(Context);
