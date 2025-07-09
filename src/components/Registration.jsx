import { Link } from "react-router-dom";
import { reduxForm, Field } from "redux-form";
import "./register.css";

const roles = ["User", "Master", "Admin"];

// Password strength checker
const checkPasswordStrength = (password) => {
    if (!password) return { strength: 0, level: "weak", suggestions: [] };
    
    let score = 0;
    const suggestions = [];
    
    // Length check
    if (password.length >= 8) score += 1;
    else suggestions.push("At least 8 characters");
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push("At least one uppercase letter");
    
    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push("At least one lowercase letter");
    
    // Number check
    if (/\d/.test(password)) score += 1;
    else suggestions.push("At least one number");
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else suggestions.push("At least one special character (!@#$%^&*)");
    
    // Determine strength level
    let level = "weak";
    if (score >= 4) level = "strong";
    else if (score >= 2) level = "medium";
    
    return { strength: score, level, suggestions };
};

const validate = (values) => {
    const errors = {};
    if (!values.name) {
        errors.name = "Name is required";
    }
    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = "Email is invalid";
    }
    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 9) {
        errors.password = "Password must be at least 9 characters";
    }
    if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
    }
    if (!values.role) {
        errors.role = "Role is required";
    }
    if (!values.terms) {
        errors.terms = "You must accept the terms";
    }
    return errors;
};

const renderInput = ({ input, label, type, meta: { touched, error } }) => (
    <div className="form-group">
        <label>{label}</label>
        <input {...input} type={type} />
        {touched && error && <span className="error">{error}</span>}
    </div>
);

const renderPasswordInput = ({ input, label, type, meta: { touched, error } }) => {
    const passwordStrength = checkPasswordStrength(input.value);
    
    return (
        <div className="form-group">
            <label>{label}</label>
            <input {...input} type={type} />
            {touched && error && <span className="error">{error}</span>}
            
            {/* Password Strength Bar */}
            {input.value && (
                <div className="password-strength-container">
                    <div className="password-strength-bar">
                        <div 
                            className={`password-strength-fill ${passwordStrength.level}`}
                            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        ></div>
                    </div>
                    <span className={`password-strength-text ${passwordStrength.level}`}>
                        {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
                    </span>
                </div>
            )}
            
            {/* Password Suggestions */}
            {input.value && passwordStrength.suggestions.length > 0 && (
                <div className="password-suggestions">
                    <p className="suggestions-title">Password must contain:</p>
                    <ul className="suggestions-list">
                        {passwordStrength.suggestions.map((suggestion, index) => (
                            <li key={index} className="suggestion-item">
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const renderSelect = ({ input, label, meta: { touched, error } }) => (
    <div className="form-group">
        <label>{label}</label>
        <select {...input}>
            <option value="">Select role</option>
            {roles.map((role) => (
                <option key={role} value={role}>
                    {role}
                </option>
            ))}
        </select>
        {touched && error && <span className="error">{error}</span>}
    </div>
);

const renderCheckbox = ({ input, label, meta: { touched, error } }) => (
    <div className="form-group terms">
        <input {...input} type="checkbox" />
        <label>{label}</label>
        {touched && error && <span className="error">{error}</span>}
    </div>
);

function RegistrationForm({ handleSubmit, submitting, invalid }) {
    return (
        <form className="registration-form" onSubmit={handleSubmit} autoComplete="off">
            <h2>Create an Account</h2>
            <Field name="name" label="Name" component={renderInput} type="text" />
            <Field name="email" label="Email" component={renderInput} type="email" />
            <Field name="password" label="Password" component={renderPasswordInput} type="password" />
            <Field name="confirmPassword" label="Confirm Password" component={renderInput} type="password" />
            <Field name="role" label="Role" component={renderSelect}>
                {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </Field>
            <Field
                name="terms"
                component={renderCheckbox}
                label={<span>I accept the <Link to="/terms">terms &amp; conditions</Link></span>}
                type="checkbox"
            />
            <button type="submit" disabled={invalid || submitting} className="submit-btn">
                Register
            </button>
            <div className="login-link">
                Already have an account? <Link to="/login">Login Here</Link>
            </div>
        </form>
    );
}

export default reduxForm({
    form: "registrationForm",
    validate,
    initialValues: {
        role: "User"
    }
})(RegistrationForm);

// export default function RegistrationForm({ onSubmit }) {
//     const [form, setForm] = useState(initialState);
//     const [showPassword, setShowPassword] = useState(false);
//     const [errors, setErrors] = useState({});

//     // Helper for validating a single field
//     const validateField = (field, value, formState = form) => {
//         let err = "";
//         if (field === "name") {
//             if (!value) err = "Name is required";
//         }
//         if (field === "email") {
//             if (!value) err = "Email is required";
//             else if (!/^\S+@\S+\.\S+$/.test(value)) err = "Email is invalid";
//         }
//         if (field === "password") {
//             if (!value) err = "Password is required";
//             else if (value.length < 9)
//                 err = "Password must be at least 9 characters";
//         }
//         if (field === "confirmPassword") {
//             if (!value) err = "Please confirm your password";
//             else if (value !== formState.password)
//                 err = "Passwords do not match";
//         }
//         if (field === "role") {
//             if (!value) err = "Role is required";
//         }
//         if (field === "terms") {
//             if (!value) err = "You must accept the terms";
//         }
//         return err;
//     };

//     // Handle input changes and validation
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         const fieldValue = type === "checkbox" ? checked : value;
//         const updatedForm = { ...form, [name]: fieldValue };
//         setForm(updatedForm);

//         // Validate the field and update errors accordingly
//         const errorMsg = validateField(name, fieldValue, updatedForm);
//         setErrors((prev) => {
//             // Remove error if fixed, otherwise update error
//             const newErrors = { ...prev };
//             if (!errorMsg) {
//                 delete newErrors[name];
//             } else {
//                 newErrors[name] = errorMsg;
//             }
//             // Special case: clear confirm password error if password changes and now matches
//             if (name === "password" && updatedForm.confirmPassword) {
//                 const confirmError = validateField(
//                     "confirmPassword",
//                     updatedForm.confirmPassword,
//                     updatedForm
//                 );
//                 if (!confirmError) {
//                     delete newErrors.confirmPassword;
//                 } else {
//                     newErrors.confirmPassword = confirmError;
//                 }
//             }
//             return newErrors;
//         });
//     };

//     // Validate all fields before submit
//     const validateAll = () => {
//         let currErrors = {};
//         Object.keys(form).forEach((key) => {
//             const errorMsg = validateField(key, form[key], form);
//             if (errorMsg) currErrors[key] = errorMsg;
//         });
//         setErrors(currErrors);
//         return Object.keys(currErrors).length === 0;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validateAll()) {
//             onSubmit && onSubmit(form);
//             //alert("Registration successful! (You can connect this to your backend)");
//             setForm(initialState);
//             setErrors({});
//         }
//     };

//     const isFormValid = () => {
//         return (
//             form.name &&
//             form.email &&
//             /^\S+@\S+\.\S+$/.test(form.email) &&
//             form.password.length > 8 &&
//             form.password === form.confirmPassword &&
//             form.role &&
//             form.terms
//         );
//     };

//     return (
//         <form
//             className="registration-form"
//             onSubmit={handleSubmit}
//             autoComplete="off"
//         >
//             <h2>Create an Account</h2>
//             <div className="form-group">
//                 <label>Name</label>
//                 <input name="name" value={form.name} onChange={handleChange} />
//                 {errors.name && <span className="error">{errors.name}</span>}
//             </div>
//             <div className="form-group">
//                 <label>Email</label>
//                 <input
//                     name="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     type="email"
//                 />
//                 {errors.email && <span className="error">{errors.email}</span>}
//             </div>
//             <div className="form-group password-group">
//                 <label>Password</label>
//                 <input
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="new-password"
//                 />
//                 <button
//                     type="button"
//                     className="show-hide-btn"
//                     onClick={() => setShowPassword((v) => !v)}
//                     tabIndex={-1}
//                 >
//                     {showPassword ? "Hide" : "Show"}
//                 </button>
//                 {errors.password && (
//                     <span className="error">{errors.password}</span>
//                 )}
//             </div>
//             <div className="form-group">
//                 <label>Confirm Password</label>
//                 <input
//                     name="confirmPassword"
//                     value={form.confirmPassword}
//                     onChange={handleChange}
//                     type={showPassword ? "text" : "password"}
//                 />
//                 {errors.confirmPassword && (
//                     <span className="error">{errors.confirmPassword}</span>
//                 )}
//             </div>
//             {/* <div className="form-group">
//         <label>Role</label>
//         <select name="role" value={form.role} onChange={handleChange}>
//           <option value="">Select role</option>
//           {roles.map((role) => (
//             <option key={role}>{role}</option>
//           ))}
//         </select>
//         {errors.role && <span className="error">{errors.role}</span>}
//       </div> */}
//             <div className="form-group terms">
//                 <input
//                     type="checkbox"
//                     id="terms"
//                     name="terms"
//                     checked={form.terms}
//                     onChange={handleChange}
//                 />
//                 <label htmlFor="terms">
//                     I accept the <Link to="/terms">terms &amp; conditions</Link>
//                 </label>
//                 {errors.terms && <span className="error">{errors.terms}</span>}
//             </div>
//             <button
//                 type="submit"
//                 disabled={!isFormValid()}
//                 className="submit-btn"
//             >
//                 Register
//             </button>
//             <div className="login-link">
//                 Already have an account? <Link to="/login">Login Here</Link>
//             </div>
//         </form>
//     );
// }
