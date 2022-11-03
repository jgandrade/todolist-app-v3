import Button from 'react-bootstrap/Button';
import useRefreshToken from '../hooks/useRefreshToken';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import usePlay from '../hooks/usePlay';


function ListTask(props) {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const playCheck = usePlay("check");
  const playDelete = usePlay("delete");

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

    toast.success('Task Set to Complete!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
    });

    playCheck();
  }

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
              <p style={props.isCompleted ? { textDecoration: "line-through" } : {}}>{props.content}</p>
              <Button variant="outline-danger" onClick={deleteTask} className='mt-2'>Delete Task</Button>
              <Button variant="outline-danger" onClick={setComplete} className='mt-2'>{props.isCompleted ? `Set Incomplete` : `Set Complete`}</Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </>
  )
}

export default ListTask