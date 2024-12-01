import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css'

function Login() {
    const [userName, setUserName] = useState('')

    useEffect(()=>{
        const token = localStorage.getItem('google_access_token')
        if(token){
            const decoded = jwtDecode(token)
            setUserName(decoded.name)
        }   
    },[])

    const onSuccess = async (res) => {
        try{
            const decoded = jwtDecode(res.credential);
            const response = await axios.post('http://localhost:8000/auth',{
                user_name: decoded.name,
                google_id: decoded.sub
            });
            if(response.data.success){
                localStorage.setItem('google_access_token', res.credential);
                localStorage.setItem('user_id', response.data.user_id);
                setUserName(response.data.user_name);
                window.location.reload();  //force a page refresh
            }
        }catch(error){
            console.log('auth error frontend:', error)
        }
    };

    const onFailure = (res) => {
        console.log("LOGIN FAILED! res: ", res);
    };

    return (
        <div>
            {userName ? (
                <div>
                    <span>Welcome, {userName}!</span>
                    <button onClick={()=>{
                        localStorage.clear();
                        setUserName('');
                    }}>log out</button>
                </div>

                
            ) : (
                <div id="signInButton">
                    <GoogleLogin
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        useOneTap={true}
                        //isSignedIn={true}
                        cookiePolicy={'single_host_origin'}
                        />
                </div>)}
        </div>
    )
}

export default Login;
