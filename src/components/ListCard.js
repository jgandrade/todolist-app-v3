import { useState, useContext } from 'react'
import Card from 'react-bootstrap/Card';
import { TextInput } from '@mantine/core';
import Button from 'react-bootstrap/Button';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import useRefreshToken from '../hooks/useRefreshToken';
import ListTask from './ListTask';
import { motion, LayoutGroup } from "framer-motion";
import { toast } from 'react-toastify';
import usePlay from '../hooks/usePlay';
import { Trash3, PlusLg } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import SettingsContext from '../context/SettingsProvider';

function ListCard(props) {
    const [clickedDelete, setClickedDelete] = useState(false);
    const [clickedAdd, setClickedAdd] = useState(false);
    const { setLoading } = useContext(SettingsContext);
    const { auth, setAuth } = useAuth();
    const refresh = useRefreshToken();
    const [task, setTask] = useState({
        task: ""
    });
    const playSucess = usePlay("success");
    const playError = usePlay("error");
    const playDelete = usePlay("delete");

    function handleChange(event) {
        const { name, value } = event.target;
        setTask(prev => {
            return {
                ...prev,
                [name]: value
            }
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (task.task !== null && task.task.trim() !== "") {
            setClickedAdd(true);
            setLoading(true);
            const response = await axios.post("/addTaskToList", { listIndex: props.index, taskContent: task.task }, { headers: { Authorization: `Bearer ${auth.accessToken}` } });
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
                setLoading(true);
                const res = await axios.post("/addTaskToList",
                    { listName: props.listName, taskContent: task.task },
                    {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }
                );
                setLoading(false);
                props.setList(prev => {
                    prev[props.index].tasks.push(res.data.task);
                    return prev;
                })
                setClickedAdd(false);
            } else {
                props.setList(prev => {
                    prev[props.index].tasks.push(response.data.task);
                    return prev;
                });
                setClickedAdd(false);
            }

            toast.success('Task Added!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
            });

            playSucess();
            return setTask({
                task: ""
            });
        }

        setTask({
            task: ""
        });
        playError();
        return toast.error('Input a task that has a value.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
        });
    }

    async function deleteList() {
        setClickedDelete(true);
        setLoading(true);
        const response = await axios.delete('/deleteList', { headers: { Authorization: `Bearer ${auth.accessToken}` }, data: { listIndex: props.index } });
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
            setLoading(true);
            const res = await axios.delete('/deleteList', { headers: { Authorization: `Bearer ${accessToken}` }, data: { listIndex: props.index } });
            setLoading(false);
            props.setList(prev => res.data.list);
            setClickedDelete(false);
        } else {
            props.setList(prev => response.data.list);
            setClickedDelete(false);
        }
        toast.success('List Deleted!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
        });
        playDelete();
    }

    const [hover, setHover] = useState(false);
    const [active, setActive] = useState({
        all: true,
        pending: false,
        completed: false
    });

    function handleMouseOver() {
        setHover(true);
    }

    function handleMouseLeave() {
        setHover(false);
    }

    function handleActive(prop) {
        if (prop === "all") setActive({
            all: true,
            pending: false,
            completed: false
        });

        if (prop === "pending") setActive({
            all: false,
            pending: true,
            completed: false
        });

        if (prop === "completed") setActive({
            all: false,
            pending: false,
            completed: true
        })
    }

    function displayTask() {
        if (props.tasks.length > 0) {
            if (active.all) {
                return props.tasks.map((e, i) => <ListTask key={i} {...e} index={i} listIndex={props.index} listName={props.listName} setList={props.setList} tasks={props.tasks} />)
            } else if (active.pending) {
                let pendingTask = props.tasks.some(e => !e.isCompleted);
                if (pendingTask) {
                    return props.tasks.map((e, i) => {
                        if (!e.isCompleted) {
                            return <ListTask key={i} {...e} index={i} listIndex={props.index} listName={props.listName} setList={props.setList} tasks={props.tasks} />
                        }
                        return false
                    })
                }
                return <p className="text-secondary text-center mt-3">No pending task yet</p>
            } else if (active.completed) {
                let completed = props.tasks.some(e => e.isCompleted === true);
                if (completed) {
                    return props.tasks.map((e, i) => {
                        if (e.isCompleted) {
                            return <ListTask key={i} {...e} index={i} listIndex={props.index} listName={props.listName} setList={props.setList} tasks={props.tasks} />
                        }
                        return false
                    })
                }
                return <p className="text-secondary text-center mt-3">No completed task yet</p>
            }
        } else {
            return <p className="text-secondary text-center mt-3">No added task yet</p>
        }
    }

    return (
        <>
            <LayoutGroup>
                <motion.div layout>
                    <motion.div
                        variants={{
                            hidden: {
                                opacity: 0,
                                scale: 1
                            },
                            visible: {
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    duration: 0.2
                                }
                            },
                            exit: {
                                opacity: 0,
                                scale: 1,
                                transition: {
                                    duration: 0.2
                                }
                            }
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <Card style={{ width: '18rem' }} className="mb-1 bg-warning bg-gradient shadow border">
                            <Card.Body>
                                <Card.Title className="d-flex align-items-center justify-content-between">
                                    <h4>{props.listName}</h4>
                                    <Button variant="outline-danger" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onClick={deleteList} disabled={clickedDelete}>
                                        {
                                            hover
                                                ?
                                                <>
                                                    <div className='d-flex justify-content-center align-content-center'>
                                                        <Trash3 className='mt-1' />
                                                        <p className='mb-0'>Delete List</p>
                                                    </div>
                                                </>
                                                :
                                                <Trash3 />
                                        }
                                    </Button>
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{props.createdOn}</Card.Subtitle>
                                <form onSubmit={handleSubmit} className="d-flex align-items-center justify-content-around">
                                    <TextInput
                                        placeholder="Enter task to add here!"
                                        name="task"
                                        type="text"
                                        onChange={handleChange}
                                        value={task.task}
                                    />
                                    <Button variant="success" className="rounded-circle py-2" type="submit" disabled={clickedAdd}>
                                        <PlusLg className='mb-1' />
                                    </Button>
                                </form>
                                <div>
                                    <ul className='d-flex list-unstyled gap-2 justify-content-center mb-1 mt-3'>
                                        <button className={`border-0 bg-transparent ${active.all ? "fw-bold" : "fw-normal"}`} onClick={() => handleActive("all")}><li>All</li></button>
                                        <button className={`border-0 bg-transparent ${active.pending ? "fw-bold" : "fw-normal"}`} onClick={() => handleActive("pending")}><li>Todo</li></button>
                                        <button className={`border-0 bg-transparent ${active.completed ? "fw-bold" : "fw-normal"}`} onClick={() => handleActive("completed")}><li>Completed</li></button>
                                    </ul>
                                </div>
                                {displayTask()}
                            </Card.Body>
                        </Card>
                    </motion.div>
                </motion.div>
            </LayoutGroup>
        </>
    )
}

export default ListCard