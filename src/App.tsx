import DesignPage from './components/DesignPage';
import { WamyDialog } from './components/WamyDialog';
import './components/design-polish.css';
import { ProjectExperience } from './components/ProjectExperience';
export default function App() { return <><DesignPage loaderMode="once per session" /><ProjectExperience /><WamyDialog /></>; }
