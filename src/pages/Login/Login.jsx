import React, { useState } from "react";
import './Login.css'
import assets from '../../assets/assets.js'
import { signup, login, resetPass } from "../../config/firebase.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [currState, setCurrState] = useState("Sign Up");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (currState === "Sign Up") {
                await signup(userName, email, password); // Assuming signup returns a promise
            } else {
                await login(email, password); // Assuming login returns a promise
            }
            // Navigate to profile page upon successful signup/login
            navigate('/profile');
        } catch (error) {
            console.error(error);
            // Handle any errors (e.g., show a toast or alert)
        }
    };

    return (
        <div className='login'>
            <img src={assets.logo_big} alt="" className="logo" />
            <form onSubmit={onSubmitHandler} className="login-form">
                <h2>{currState}</h2>
                {currState === "Sign Up" && (
                    <input 
                        onChange={(e) => setUserName(e.target.value)} 
                        value={userName} 
                        type="text" 
                        placeholder="Username" 
                        className="form-input" 
                        required 
                    />
                )}
                <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    type="email" 
                    placeholder="Email address" 
                    className="form-input" 
                    required 
                />
                <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    type="password" 
                    placeholder="Password" 
                    className="form-input" 
                    required 
                />
                <button type="submit">
                    {currState === "Sign Up" ? "Create account" : "Login now"}
                </button>
                <div className="login-term">
                    <input type="checkbox" />
                    <p>Agree to the terms of use & privacy policy</p>
                </div>
                <div className="login-forgot">
                    {currState === "Sign Up" ? (
                        <p className="login-toggle">
                            Already have an account? 
                            <span onClick={() => setCurrState("Login")}> Login here</span>
                        </p>
                    ) : (
                        <p className="login-toggle">
                            Create an account?
                            <span onClick={() => setCurrState("Sign Up")}> click here</span>
                        </p>
                    )}
                    {currState === "Login" ? <p className="login-toggle">
                            Forgot Password ?
                            <span onClick={() => resetPass(email)}> reset here</span>
                        </p>: null}
                </div>
            </form>
        </div>
    );
}

export default Login;
