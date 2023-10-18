import React, { useState } from "react";
import "./RegisterAccount.css";
import axios from 'axios';
import { Link } from "react-router-dom";
interface FormValue {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initFormValue: FormValue = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const isEmptyValue = (value: string): boolean => {
  return !value || value.trim().length < 1;
};

const isEmailValid = (email: string): boolean => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export default function RegisterPage(): JSX.Element {
  const [formValue, setFormValue] = useState<FormValue>(initFormValue);
  const [formError, setFormError] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const error: Record<string, string> = {};

    if (isEmptyValue(formValue.userName)) {
      error["userName"] = "User Name is required";
    }
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
    if (isEmptyValue(formValue.confirmPassword)) {
      error["confirmPassword"] = "Confirm Password is required";
    } else if (formValue.confirmPassword !== formValue.password) {
      error["confirmPassword"] = "Confirm Password does not match";
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/signup', {
        name: formValue.userName,
        email: formValue.email,
        password: formValue.password,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    if (validateForm()) {
      console.log("form value", formValue);
    } else {
      console.log("form invalid");
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <h1 className="title">RegisterAccount</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="user-name" className="form-label">
              User Name
            </label>
            <input
              id="user-name"
              className="form-control"
              type="text"
              name="userName"
              value={formValue.userName}
              onChange={handleChange}
            />
            {formError.userName && <div className="error-feedback">{formError.userName}</div>}
          </div>
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
          <div className="mb-2">
            <label htmlFor="confirm-password" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              className="form-control"
              type="password"
              name="confirmPassword"
              value={formValue.confirmPassword}
              onChange={handleChange}
            />
            {formError.confirmPassword && (
              <div className="error-feedback">{formError.confirmPassword}</div>
            )}
                  </div>
          <div>
            
            <button type="submit" className="submit-btn" >
              Register
            </button>
            
            <Link to="/login"></Link> 
            <Link to="/login">
            <button type="submit" className="submit-dtn">
              LogIn
            </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
