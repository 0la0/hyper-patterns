import {
  MetronomeManager,
  MetronomeScheduler,
  TimeSchedule
} from 'metronome';

const metronome = new MetronomeManager();

document.addEventListener('CLOCK_START', () => metronome.start());
document.addEventListener('CLOCK_STOP', () => metronome.stop());

export default metronome;
export {
  MetronomeScheduler,
  TimeSchedule
};
