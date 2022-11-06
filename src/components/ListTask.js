import { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import useRefreshToken from '../hooks/useRefreshToken';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import usePlay from '../hooks/usePlay';
import { Check2Square, XLg, ThreeDotsVertical } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import SettingsContext from '../context/SettingsProvider';

function ListTask(props) {
  const [clickedDelete, setClickedDelete] = useState(false);
  const [clickedComplete, setClickedComplete] = useState(false);
  const { setLoading } = useContext(SettingsContext);
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();
  const playCheck = usePlay("check");
  const playDelete = usePlay("delete");
  const [open, setOpen] = useState(false);

  async function deleteTask() {
    setClickedDelete(true);
    setLoading(true);
    const response = await axios.delete('/deleteTaskFromList', { headers: { Authorization: `Bearer ${auth.accessToken}` }, data: { listIndex: props.listIndex, taskIndex: props.index } });
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
      await axios.delete('/deleteTaskFromList', { headers: { Authorization: `Bearer ${accessToken}` }, data: { listIndex: props.listIndex, taskIndex: props.index } });
      setLoading(false);
      props.setList(prev => {
        prev[props.listIndex].tasks.splice(props.index, 1);
        return prev;
      });
      setClickedDelete(false);
    } else {
      props.setList(prev => {
        prev[props.listIndex].tasks.splice(props.index, 1);
        return prev;
      });
      setClickedDelete(false);
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
    setClickedComplete(true);
    setLoading(true);
    const response = await axios.patch('/setTaskComplete', { listIndex: props.listIndex, taskIndex: props.index }, { headers: { Authorization: `Bearer ${auth.accessToken}` } });
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
      await axios.patch('/setTaskComplete', { listIndex: props.listIndex, taskIndex: props.index }, { headers: { Authorization: `Bearer ${accessToken}` } });
      setLoading(false);
      props.setList(prev => {
        prev[props.listIndex].tasks[props.index].isCompleted = !prev[props.listIndex].tasks[props.index].isCompleted;
        return prev;
      });
      setClickedComplete(false);
    } else {
      props.setList(prev => {
        prev[props.listIndex].tasks[props.index].isCompleted = !prev[props.listIndex].tasks[props.index].isCompleted;
        return prev;
      });
      setClickedComplete(false);
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
        <AnimatePresence>
          <motion.div className="bg-light rounded mb-2 mt-3 container pt-2 pb-2"
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
                scale: 2,
                transition: {
                  duration: 0.7
                }
              }
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <p style={props.isCompleted ? { textDecoration: "line-through" } : {}}>{props.content}</p>
            <div className='d-flex justify-content-end gap-1'>
              {
                open
                  ?
                  <>
                    <Button variant="outline-danger" onClick={deleteTask} className='mt-2 rounded-circle py-0 px-1' disabled={clickedDelete}><XLg className="mb-1" /></Button>
                    <Button variant={props.isCompleted ? "outline-success" : "outline-secondary"} onClick={setComplete} className='mt-2 rounded-circle py-0 px-1' disabled={clickedComplete}><Check2Square className="mb-1 h5" /></Button>
                  </>
                  :
                  <></>
              }
              <button style={{ border: "none", backgroundColor: "transparent" }} onClick={showOptions}><ThreeDotsVertical /></button>
            </div>
          </motion.div>
        </AnimatePresence>
      </LayoutGroup>
    </>
  )
}

export default ListTask