import { useState, useEffect, useContext } from 'react'
import { useFormik } from 'formik';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ListCard from '../components/ListCard';
import { TextInput } from '@mantine/core';
import Button from 'react-bootstrap/Button';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import usePlay from '../hooks/usePlay';
import { BoxArrowRight, JournalCheck, PersonCircle } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import SettingsContext from '../context/SettingsProvider';

function HomePage() {
    const { setLoading } = useContext(SettingsContext);
    const [list, setLists] = useState([]);
    const navigate = useNavigate();
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();
    const playSuccess = usePlay("success");
    const playError = usePlay("error");

    const formik = useFormik({
        initialValues: {
            listName: "",
        },
        onSubmit: async function (values, { resetForm }) {
            if (values.listName !== null && values.listName.trim() !== "") {
                setLoading(true);
                const response = await axios.post("/addList",
                    values,
                    {
                        headers: { Authorization: `Bearer ${auth.accessToken}` }
                    }
                )
                setLoading(false);
                if (response.data.auth === "Invalid token") {
                    setLoading(true);
                    const accessToken = await refresh();
                    setLoading(false);
                    if (accessToken === "expired") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Your session has expired!',
                            footer: 'You will be redirected to login page within 5 seconds'
                        });
                        setTimeout(() => {
                            setAuth({})
                        }, 3000)
                        return false;
                    }

                    const res = await axios.post("/addList",
                        values,
                        {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        }
                    )
                    setLists(prev => [...prev, res.data.list]);
                } else {
                    setLists(prev => [...prev, response.data.list]);
                }

                toast.success('List Added!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                });

                playSuccess();
                return resetForm({ values: "" });
            }

            resetForm({ values: "" });
            playError();
            return toast.error('Your input should not be an empty string or only whitespaces.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
            });
        }
    }
    );

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await axios.get("/getLists", { headers: { Authorization: `Bearer ${auth.accessToken}` } });
            setLoading(false);
            setLists(response.data.lists);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function logout() {
        setLoading(true);
        await axios.get("/logout", { withCredentials: true });
        setLoading(false);

        toast.success('Successfully Logged Out!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
        });

        playSuccess();

        setTimeout(() => {
            setAuth({});
            navigate("/");
        }, 2000)
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                hideProgressBar={false}
                newestOnTop={true}
                rtl={false}
                theme="light"
            />
            <div className="d-flex flex-column flex-md-row">
                <div className='col-md-3 container'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h3 className='mt-3 fw-bolder'><JournalCheck className='mb-2' style={{ color: "ECC00F" }} /> TodoList</h3>
                        <Button variant="danger" className='fw-bold mt-2 px-1 text-light' onClick={logout}><BoxArrowRight /> Logout</Button>
                    </div>
                    <div className="mt-5">
                        <h6><PersonCircle /> Welcome {auth.auth.fullName}!</h6>
                        <form onSubmit={formik.handleSubmit} className="mt-3" >
                            <p className='fw-bold'>Add List:</p>
                            <TextInput
                                placeholder="Enter List name here"
                                type="text"
                                name="listName"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.listName}
                            />
                            <Button variant="warning" className='mt-2' type="submit">Add To List</Button>
                        </form>
                    </div>
                </div>

                <div className="container col-md-9 d-flex flex-wrap gap-3 justify-content-center align-items-start mb-5 mt-md-5 mt-4">
                    {
                        list.length > 0
                            ?
                            list.map((e, i) => <ListCard key={i} {...e} index={i} setList={setLists} />)
                            :
                            <p>You have nothing on your list as of this moment.</p>
                    }
                </div>
            </div>
        </>
    )
}

export default HomePage