import axios from "axios";
import React, { useEffect, useState } from "react";
import "./LoginAccount.css";
import { Link, useNavigate,  } from 'react-router-dom';
interface FormValue {
    email: string;
    password: string;
}

const initFormValue: FormValue = {
    email : "",
    password : "",
};

const isEmptyValue = (value: string): boolean => {
  return !value || value.trim().length < 1;
};

const isEmailValid = (email: string): boolean => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};


export default function LoginPage(): JSX.Element {
  const [formValue, setFormValue] = useState<FormValue>(initFormValue);
  const [formError, setFormError] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const error: Record<string, string> = {};
      
    if (isEmptyValue(formValue.email)) {
      error["email"] = "Email is required";
    } else {
      if (!isEmailValid(formValue.email)) {
        error["email"] = "Email is invalid";
      }
    }
    if (isEmptyValue(formValue.password)) {
      error["password"] = "Password is required";
    }
    setFormError(error);
    return Object.keys(error).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (validateForm()) {
      console.log("form value", formValue);
      try {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email: formValue.email,
          password: formValue.password,
        });
        console.log(response.data);
        setIsSuccess(true);
      } catch (E) {
        console.log(E);
      }
    } else {
      console.log("form invalid");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/dashboard")
      }, 5000);
    }
  }, [isSuccess]);
    
      
  

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h1 className="title">LoginAccount</h1>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-2">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              className="form-control"
              type="text"
              name="email"
              value={formValue.email}
              onChange={handleChange}
            />
            {formError.email && <div className="error-feedback">{formError.email}</div>}
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              className="form-control"
              type="password"
              name="password"
              value={formValue.password}
              onChange={handleChange}
            />
            {formError.password && <div className="error-feedback">{formError.password}</div>}
          </div>
          <div>
            <button type="submit" className="submit-btn" >
              Login
            </button>
            <Link to="/register">
              <button type="submit" className="submit-dtn">
              Register
            </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
