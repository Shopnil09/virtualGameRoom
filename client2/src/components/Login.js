import axios from 'axios';
import React, {useState} from 'react'; 

export default function Login({setIsLogin}) { 
    const [user, setUser] = useState({ name: '', email: '', password: ''})
    const [err, setErr] = useState(''); 

    const onChangeInput = e => { 
        const {name, value} = e.target; 
        setUser({...user, [name]: value});
        setErr(''); 
    }

    const registerSubmit = async e => { 
        e.preventDefault(); 
        try {
            const res = await axios.post('/users/register', { 
                username: user.name, email: user.email, password: user.password
            })
            setUser({name: '', email: '', password: ''}); 
            setErr(res.data.msg); 
        } catch (error) {
            error.response.data.msg && setErr(error.response.data.msg); 
        }
    }

    const loginSubmit = async e => { 
        e.preventDefault(); 
        try {
            const res = await axios.post('/users/login', { 
                email: user.email, password: user.password
            })
            setUser({name: '', email: '', password: ''}); 
            localStorage.setItem('tokenStore', res.data.token);
            setIsLogin(true); 
            //to log out 
        } catch (error) {
            error.response.data.msg && setErr(error.response.data.msg); 
        }
    }

    return(
        <section>
            <div className="login">
                <h2 style={{backgroundColor: "black",  color: "white",fontSize: "200%"}}>Login</h2>
                <form onSubmit = {loginSubmit}>
                    <input type="email" name="email" id="login-email" placeholder="Email" required value={user.email} onChange={onChangeInput}/>
                    <input type="password" name="password" id="login-password" placeholder="Password" required value={user.password} autoComplete="true" onChange={onChangeInput}/>
                    <button type="submit">Login</button>
                    <p>Don't have an account? Register now</p>
                </form> 
            </div> 
            <div className="register"> 
            <h2 style={{backgroundColor: "black",  color: "white",fontSize: "200%"}}>Register</h2>
                <form onSubmit={registerSubmit}>
                    <input type="name" name="name" id="register-name" placeholder="Name" required value={user.name} onChange={onChangeInput}/>
                    <input type="email" name="email" id="register-email" placeholder="Email" required value={user.email} onChange={onChangeInput} />
                    <input type="password" name="password" id="register-password" placeholder="Password" required value={user.password} autoComplete="true" onChange={onChangeInput} />
                    <button type="submit">Register</button>
                    <p>Have an account? Login</p>
                    <h3>{err}</h3>
                </form> 
            </div> 
        </section> 
    )
}
