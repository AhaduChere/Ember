import playIcon from '../assets/Play_Button.svg?url';
import pauseIcon from '../assets/Pause_Button.svg?url';
import skipNextIcon from '../assets/Skip_Next.svg?url';
import skipPreviousIcon from '../assets/Skip_Previous.svg?url';
import notLoopIcon from '../assets/not_Looping.svg?url';
import loopIcon from '../assets/Looping.svg?url';
import loopSingleIcon from '../assets/Looping_single.svg?url';
import shuffleOffIcon from '../assets/not_Shuffling.svg?url';
import shuffleOnIcon from '../assets/Shuffling.svg?url';

const icons = [playIcon, pauseIcon, skipNextIcon, skipPreviousIcon, notLoopIcon, loopIcon, loopSingleIcon, shuffleOffIcon, shuffleOnIcon];

icons.forEach((src) => {
  const img = new Image();
  img.src = src;
});

export { playIcon, pauseIcon, skipNextIcon, skipPreviousIcon, notLoopIcon, loopIcon, loopSingleIcon, shuffleOffIcon, shuffleOnIcon };
