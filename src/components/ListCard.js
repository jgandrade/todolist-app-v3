import { useState } from 'react'
import Card from 'react-bootstrap/Card';
import { TextInput } from '@mantine/core';
import Button from 'react-bootstrap/Button';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import useRefreshToken from '../hooks/useRefreshToken';
import ListTask from './ListTask';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { toast } from 'react-toastify';
import usePlay from '../hooks/usePlay';
import { Trash3, PlusLg } from 'react-bootstrap-icons';

function ListCard(props) {
    const { auth } = useAuth();
    const [taskList, setTaskList] = useState(props.tasks);
    const refresh = useRefreshToken();
    const [task, setTask] = useState({
        task: ""
    });
    const playSucess = usePlay("success");
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
        const response = await axios.post("/addTaskToList", { listIndex: props.index, taskContent: task.task }, { headers: { Authorization: `Bearer ${auth.accessToken}` } });
        if (response.data.auth === "Invalid token") {
            const accessToken = await refresh();
            const res = await axios.post("/addTaskToList",
                { listName: props.listName, taskContent: task.task },
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );
            setTaskList(prev => [...prev, res.data.task])
        } else {
            setTaskList(prev => [...prev, response.data.task])
        }

        toast.success('Task Added!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
        });

        playSucess();
        setTask({
            task: ""
        });
    }

    async function deleteList() {
        const response = await axios.delete('/deleteList', { headers: { Authorization: `Bearer ${auth.accessToken}` }, data: { listIndex: props.index } });
        if (response.data.auth === "Invalid token") {
            const accessToken = await refresh();
            const res = await axios.delete('/deleteList', { headers: { Authorization: `Bearer ${accessToken}` }, data: { listIndex: props.index } });
            props.setList(prev => res.data.list);
        } else {
            props.setList(prev => response.data.list);
        }

        toast.success('List Deleted!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
        });

        playDelete();
    }

    const [hover, setHover] = useState(false);

    function handleMouseOver() {
        setHover(true);
    }

    function handleMouseLeave() {
        setHover(false);
    }

    console.log(hover);

    return (
        <>
            <LayoutGroup>
                <motion.div layout>
                    <AnimatePresence>
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
                                    scale: 0,
                                    transition: {
                                        duration: 0.2
                                    }
                                }
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                        >

                            <Card style={{ width: '18rem' }} className="mt-1 mb-1">
                                <Card.Body>
                                    <Card.Title className="d-flex align-items-center justify-content-between">
                                        <h5>{props.listName}</h5>
                                        <Button variant="outline-danger" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onClick={deleteList}>
                                            {
                                                hover
                                                    ?
                                                    <>
                                                        <div className='d-flex justify-content-center align-content-center'>
                                                            <Trash3 className='mt-1'/>
                                                            <p className='mb-0'>Delete List</p>
                                                        </div>
                                                    </>
                                                    :
                                                    <Trash3 />
                                            }
                                        </Button>
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{props.createdOn}</Card.Subtitle>
                                    <form onSubmit={handleSubmit} className="d-flex align-items-center justify-content-between">
                                        <TextInput
                                            placeholder="Enter task to add here!"
                                            name="task"
                                            type="text"
                                            onChange={handleChange}
                                            value={task.task}
                                        />
                                        <Button variant="outline-primary" type="submit">
                                            <PlusLg className='mb-1'/>
                                        </Button>
                                    </form>
                                    {taskList.map((e, i) => <ListTask key={i} {...e} index={i} listIndex={props.index} listName={props.listName} setTaskList={setTaskList} />)}
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </LayoutGroup>
        </>
    )
}

export default ListCard