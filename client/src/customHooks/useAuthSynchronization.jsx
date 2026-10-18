import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserData, setOtherUsers, setLoading } from '../store/userSlice'
import { BASEURL } from '../main';




export const useAuthSynchronization = () => {


    const dispatch = useDispatch();
    const { userData, otherUsers, isAuthenticated } = useSelector(state => state.user);

    // Phase 1: this'll persist me across pages
    useEffect(() => {
        if (userData) return; //as user is null before login

        async function fetchMyProfile() {
            try {
                const response = await axios.get(`${BASEURL}/api/user/get-profile`, { 
                    withCredentials: true 
                });
                if (response.data.success) {
                    dispatch(setUserData(response.data.data));
                } else {
                    dispatch(setLoading(false));
                }
            } catch (err) {
                // console.log("No active user session detected.");
                dispatch(setLoading(false)); // Turning off shimmer to show login view
            }
        }


        fetchMyProfile();
    }, [userData, dispatch]);
//running this effect after the first render of my app, and run it again whenever userData changes. from null to userobj.
    

// Phase 2: this'll show all users inside app 
    useEffect(() => {
        if (!isAuthenticated || otherUsers) return;

        async function fetchContactRegistry() {
            try {
                const response = await axios.get(`${BASEURL}/api/user/get-allusers`, { 
                    withCredentials: true 
                });
                if (response.data.success) {
                    dispatch(setOtherUsers(response.data.data));
                    //bend returns an arr of user obj
                }
            } catch (err) {
                console.error("Failed to compile user registry:", err.message);
            }
        }
        fetchContactRegistry();
    }, [isAuthenticated, otherUsers, dispatch]);
};


        //if(!true  || false) return since if statemetn is true we return here
        //after above effect runs,is auth becomes true in redux dependency is changed, now (!true || null) 
        // if(false) return means the beow api will be called as if statemtn alswsya expects true only
        //  Since the condition is false, the return is not executed, and the API is called.



