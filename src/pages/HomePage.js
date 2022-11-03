import { useState, useEffect } from 'react'
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

function HomePage() {
    const [list, setLists] = useState([]);
    const navigate = useNavigate();
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();
    const playSuccess = usePlay("success");

    const getList = async () => {
        const response = await axios.get("/getLists", { headers: { Authorization: `Bearer ${auth.accessToken}` } });

        if (response.data.response === false) {
            const accessToken = await refresh();
            const res = await axios.get("/getLists", { headers: { Authorization: `Bearer ${accessToken}` } });
            setLists(res.data.lists);
            return res.data.lists;
        }

        setLists(response.data.lists);
        return response.data.lists;
    }

    const formik = useFormik({
        initialValues: {
            listName: "",
        },
        onSubmit: async function (values, { resetForm }) {
            const response = await axios.post("/addList",
                values,
                {
                    headers: { Authorization: `Bearer ${auth.accessToken}` }
                }
            )

            if (response.data.auth === "Invalid token") {
                const accessToken = await refresh();
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
            resetForm({ values: "" })
        }
    }
    );

    useEffect(() => {
        (async () => {
            await refresh();
            await getList();
        })();

    }, []);

    function logout() {
        axios.get("/logout", { withCredentials: true });
        setAuth({});
        navigate("/");
    }

    return (
        <div className="container">
            <ToastContainer
                position="top-right"
                hideProgressBar={false}
                newestOnTop={true}
                rtl={false}
                theme="light"
            />
            <Button variant="outline-danger" className='mt-2' onClick={logout}>Logout</Button>
            <form onSubmit={formik.handleSubmit}>
                <TextInput
                    label="Add List:"
                    placeholder="Enter task for this list here"
                    type="text"
                    name="listName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.listName}
                />
                <Button variant="primary" className='mt-2' type="submit">Add To List</Button>
            </form>
            <div className="container d-flex flex-wrap gap-3 justify-content-center align-items-center">
                {
                    list.length > 0
                        ?
                        list.map((e, i) => <ListCard key={i} {...e} index={i} setList={setLists} />)
                        :
                        <p>You have nothing on your list as of this moment.</p>
                }
            </div>

        </div>
    )
}

export default HomePage