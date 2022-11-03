import useSound from 'use-sound';
import success from '../assets/success.mp3';
import deleteSound from '../assets/delete.mp3';
import linethrough from '../assets/linethrough.mp3';

function usePlay(sound) {
    let setSound;
    if (sound === "success") setSound = success;
    if (sound === "check") setSound = linethrough;
    if (sound === "delete") setSound = deleteSound;
    

    const [playSound] = useSound(setSound);

    return playSound;
}

export default usePlay