import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput } from '@mantine/core';
import Button from 'react-bootstrap/Button';
import useAuth from '../hooks/useAuth';
import useSound from 'use-sound';

function LoginPage() {
  const playError = useSound("error");
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      userName: "",
      password: ""
    },
    validationSchema: Yup.object({
      userName: Yup.string()
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
        setTimeout(() => {
          setAuth({ auth, accessToken });
          navigate("/")
        }, 2000);

      } else {
        playError();
        toast.error('There was an error see errors below form.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
    }
  });

  return (
    <div id="login-page" className='container text-center'>
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={true}
        rtl={false}
        theme="light"
      />
      <h2>TodoList Login</h2>
      <form onSubmit={formik.handleSubmit}>
        <TextInput
          label="Username/Email"
          placeholder="Your email/username"
          name="userName" type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.userName}
        />
        {formik.touched.userName && formik.errors.userName ? <li className='text-danger'>{formik.errors.userName}</li> : <></>}
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
        {formik.touched.password && formik.errors.password ? <li className='text-danger'>{formik.errors.password}</li> : <></>}
        <Button type='submit' className='mt-3' variant="outline-primary">Login</Button>{' '}
      </form>
    </div>
  )
}

export default LoginPage