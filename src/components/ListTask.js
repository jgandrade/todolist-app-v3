import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import useRefreshToken from '../hooks/useRefreshToken';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import usePlay from '../hooks/usePlay';
import { Check2Square, XLg, ThreeDotsVertical } from 'react-bootstrap-icons';

function ListTask(props) {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const playCheck = usePlay("check");
  const playDelete = usePlay("delete");
  const [open, setOpen] = useState(false);

  async function deleteTask() {
    const response = await axios.delete('/deleteTaskFromList', { headers: { Authorization: `Bearer ${auth.accessToken}` }, data: { listIndex: props.listIndex, taskIndex: props.index } });
    if (response.data.auth === "Invalid token") {
      const accessToken = await refresh();
      const res = await axios.delete('/deleteTaskFromList', { headers: { Authorization: `Bearer ${accessToken}` }, data: { listIndex: props.listIndex, taskIndex: props.index } });
      props.setTaskList(prev => res.data.task);
    } else {
      props.setTaskList(prev => response.data.task);
    }
    toast.success('Task Removed!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
    });
    setOpen(false);
    playDelete();
  }

  async function setComplete() {
    const response = await axios.patch('/setTaskComplete', { listIndex: props.listIndex, taskIndex: props.index }, { headers: { Authorization: `Bearer ${auth.accessToken}` } });
    if (response.data.auth === "Invalid token") {
      const accessToken = await refresh();
      const res = await axios.patch('/setTaskComplete', { listIndex: props.listIndex, taskIndex: props.index }, { headers: { Authorization: `Bearer ${accessToken}` } });
      props.setTaskList(prev => res.data.task);
    } else {
      props.setTaskList(prev => response.data.task);
    }

    toast.success('Task Toggled Complete State!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
    });

    setOpen(false);
    playCheck();
  }



  function showOptions() {
    setOpen(!open);
  }

  return (
    <>
      <LayoutGroup>
        <motion.div className="bg-light rounded mb-2 mt-3 container pt-2 pb-2" layout>
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
                    duration: 0.7
                  }
                },
                exit: {
                  opacity: 0,
                  scale: 1,
                  transition: {
                    duration: 0.7
                  }
                }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p style={props.isCompleted ? { textDecoration: "line-through" } : {}}>{props.content}</p>
              <div className='d-flex justify-content-end gap-1'>
                {
                  open
                    ?
                    <>
                      <Button variant="outline-danger" onClick={deleteTask} className='mt-2 rounded-circle py-0 px-1'><XLg className="mb-1"/></Button>
                      <Button variant={props.isCompleted ? "outline-success" : "outline-secondary"} onClick={setComplete} className='mt-2 rounded-circle py-0 px-1'><Check2Square className="mb-1 h5"/></Button>
                    </>
                    :
                    <></>
                }
                <button style={{ border: "none", backgroundColor: "transparent" }} onClick={showOptions}><ThreeDotsVertical /></button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </>
  )
}

export default ListTask