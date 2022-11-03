import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput } from '@mantine/core';
import Button from 'react-bootstrap/Button';
import useAuth from '../hooks/useAuth';

function LoginPage() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      userName: "",
      password: ""
    },
    validationSchema: Yup.object({
      userName: Yup.string().max(15, "Must be 15 characters or less").required("Required")
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
        setAuth({ auth, accessToken });
        resetForm({ values: '' });
        setTimeout(() => navigate("/home"), 2000);

      } else {
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
        {formik.touched.userName && formik.errors.userName ? <p>{formik.errors.userName}</p> : <></>}
        <PasswordInput
          name="password"
          label="Password"
          required
          placeholder="Your password"
          mt="md"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <Button type='submit' className='mt-3' variant="outline-primary">Login</Button>{' '}
      </form>
    </div>
  )
}

export default LoginPage