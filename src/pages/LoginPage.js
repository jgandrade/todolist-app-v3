import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios'
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput } from '@mantine/core';
import Button from 'react-bootstrap/Button';
import useAuth from '../hooks/useAuth';
import usePlay from '../hooks/usePlay';
import heroImage from '../assets/herobanner.svg';
import { JournalCheck } from 'react-bootstrap-icons';

function LoginPage() {
  const playError = usePlay("error");
  const playSuccess = usePlay("success");
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      input: "",
      password: ""
    },
    validationSchema: Yup.object({
      input: Yup.string()
        .max(25, "Must be 25 characters or less")
        .min(6, "Must be 6 characters or more")
        .trim('Input cannot include leading and trailing spaces')
        .required("Required")
        .strict(true),
      password: Yup.string()
        .required("Required")
        .strict(true)
    }),
    onSubmit: async function (values, { resetForm }) {
      const response = await axios.post("/login", values, { withCredentials: true });
      const { accessToken, auth } = response.data;
      if (response.data.response === true) {
        toast.success('Successfully Logged In!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
        });
        
        resetForm({ values: '' });
        playSuccess();
        return setTimeout(() => {
          setAuth({ auth, accessToken });
          navigate("/home")
        }, 2000);
      } else {
        console.log(response.data);
        playError();
        return toast.error('There was an error see errors below form.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
    }
  });

  return (
    <div className='d-flex container text-center justify-content-center align-items-center' style={{ height: "80vh" }}>
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={true}
        rtl={false}
        theme="light"
      />
      <div id="login-page" className='container col-md-5 text-center p-5 shadow h-80 border rounded d-flex flex-column justify-content-center'>
        <h2 className='fw-bolder'><JournalCheck className='mb-2' style={{ color: "ECC00F" }} /> TodoList</h2>
        <h4 className='fw-bold my-3'>Login</h4>

        <form onSubmit={formik.handleSubmit}>
          <TextInput
            label="Username/Email"
            placeholder="Your username or Email"
            name="input" type="text"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.input}
            required
          />
          {formik.touched.input && formik.errors.input ? <p className='text-danger' style={{ fontSize: "0.8em" }}>{formik.errors.input}</p> : <></>}
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
          <Button type='submit' className='mt-3 fw-bold px-4' variant="outline-dark">Login</Button>
          <div className="mt-5">
            <p className='text-secondary' style={{ fontSize: "0.8em" }}>No Acccount Yet?</p>
            <Link to="/register" style={{ fontSize: "0.8em" }}>Click here to Register</Link>
          </div>
        </form>
      </div>
      <div className='col-md-7 d-none d-md-block flex-column align-content-center text-center'>
        <div>
          <img src={heroImage} className="w-50" alt="TodoTask Banner" />
          <h2 className='text-dark mt-3 fw-bolder'><JournalCheck className='mb-2' style={{ color: "ECC00F" }} /> TodoList</h2>
          <p className="text-secondary">A simple todo list app, to make your day organized</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage