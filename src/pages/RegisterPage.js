import { useContext } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios'
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput } from '@mantine/core';
import Button from 'react-bootstrap/Button';
import usePlay from '../hooks/usePlay';
import heroImage from '../assets/herobanner.svg';
import { JournalCheck } from 'react-bootstrap-icons';
import YupPassword from 'yup-password';
import SettingsContext from '../context/SettingsProvider';

function RegisterPage() {
    const { setLoading } = useContext(SettingsContext);
    YupPassword(Yup);
    const playError = usePlay("error");
    const playSuccess = usePlay("success");
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            fullName: "",
            userName: "",
            emailAddress: "",
            password: ""
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .max(25, "Must be 50 characters or less")
                .min(6, "Must be 6 characters or more")
                .trim('Input cannot include leading and trailing spaces')
                .trim('Input cannot include leading and trailing spaces')
                .required("Required")
                .strict(true),
            userName: Yup.string()
                .max(25, "Must be 25 characters or less")
                .min(6, "Must be 6 characters or more")
                .trim('Input cannot include leading and trailing spaces')
                .required("Required")
                .strict(true),
            emailAddress: Yup.string()
                .email('Invalid email')
                .trim('Input cannot include leading and trailing spaces')
                .required('Required')
                .strict(true),
            password: Yup.string()
                .required("Required")
                .min(
                    8,
                    'Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special'
                )
                .minLowercase(1, 'Password must contain at least 1 lower case letter')
                .minUppercase(1, 'Password must contain at least 1 upper case letter')
                .minNumbers(1, 'Password must contain at least 1 number')
                .minSymbols(1, 'Password must contain at least 1 special character')
                .strict(true)
        }),
        onSubmit: async function (values, { resetForm }) {
            values.fullName = values.fullName.split(" ").map(e => e[0].toUpperCase().concat(e.slice(1, e.length))).join(" ");
            setLoading(true);
            const response = await axios.post("/register", values);
            setLoading(false);
            if (response.data.response === true) {
                toast.success('Successfully Registered!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                });

                resetForm({ values: '' });
                playSuccess();
                return setTimeout(() => {
                    navigate("/")
                }, 2000);
            } else {
                playError();
                return toast.error('Email/Username already exist.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                });
            }
        }
    });

    return (
        <div className='d-flex container text-center justify-content-center align-items-center' style={{ height: "100vh" }}>
            <div className='col-md-7 d-none d-md-block flex-column align-content-center text-center'>
                <div>
                    <img src={heroImage} className="w-50" alt="TodoTask Banner" />
                    <h2 className='text-dark mt-3 fw-bolder'><JournalCheck className='mb-2' style={{ color: "ECC00F" }} /> TodoList</h2>
                    <p className="text-secondary">A simple todo list app, to make your day organized</p>
                </div>
            </div>
            <div id="register-page" className='container col-md-5 text-center p-5 shadow h-100 border rounded d-flex flex-column justify-content-center'>
                <h2 className='fw-bolder'><JournalCheck className='mb-2' style={{ color: "ECC00F" }} /> TodoList</h2>
                <h4 className='fw-bold my-3'>Register</h4>
                <form onSubmit={formik.handleSubmit}>
                    <TextInput
                        label="Full Name"
                        placeholder="Your Full Name"
                        name="fullName" type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.fullName}
                        mt="md"
                        required
                    />
                    {formik.touched.fullName && formik.errors.fullName ? <p className='text-danger' style={{ fontSize: "0.8em" }}>{formik.errors.fullName}</p> : <></>}
                    <TextInput
                        label="Username"
                        placeholder="Your username"
                        name="userName" type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.userName}
                        mt="md"
                        required
                    />
                    {formik.touched.userName && formik.errors.userName ? <p className='text-danger' style={{ fontSize: "0.8em" }}>{formik.errors.userName}</p> : <></>}
                    <TextInput
                        label="Email"
                        placeholder="Your email"
                        name="emailAddress" type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.emailAddress}
                        mt="md"
                        required
                    />
                    {formik.touched.emailAddress && formik.errors.emailAddress ? <p className='text-danger' style={{ fontSize: "0.8em" }}>{formik.errors.emailAddress}</p> : <></>}
                    <PasswordInput
                        name="password"
                        label="Password"
                        required
                        placeholder="Your password"
                        mt="md"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password ? <p className='text-danger' style={{ fontSize: "0.8em" }}>{formik.errors.password}</p> : <></>}
                    <Button type='submit' className='mt-3 fw-bold px-4' variant="outline-dark"
                        disabled={
                            formik.values.emailAddress.length === 0 ||
                                formik.values.fullName.length === 0 ||
                                formik.values.password.length === 0 ||
                                formik.values.userName.length === 0
                                ?
                                true
                                :
                                false
                        }
                    >Register</Button>
                    <div className="mt-5">
                        <p className='text-secondary' style={{ fontSize: "0.8em" }}>Have an account?</p>
                        <Link to="/" style={{ fontSize: "0.8em" }}>Click here to Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage;