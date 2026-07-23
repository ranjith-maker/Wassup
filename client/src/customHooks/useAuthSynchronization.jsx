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
        if (userData) return;

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


    // Phase 2: this'll show all users if I'm loggedin 
    useEffect(() => {
        if (!isAuthenticated || otherUsers) return;

        async function fetchContactRegistry() {
            try {
                const response = await axios.get(`${BASEURL}/api/user/get-allusers`, { 
                    withCredentials: true 
                });
                if (response.data.success) {
                    dispatch(setOtherUsers(response.data.data));
                }
            } catch (err) {
                console.error("Failed to compile user registry:", err.message);
            }
        }
        fetchContactRegistry();
    }, [isAuthenticated, otherUsers, dispatch]);
};





