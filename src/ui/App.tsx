import './App.css';
import { Container } from 'react-bootstrap';
import { SelectionScene } from '../game/scene/SelectionScene';
import SelectionSceneUI from './scene/Selection';
import MainSceneUI from './scene/main';
import { MainScene } from '../game/scene/MainScene';
import EventDialog from './component/EventDialog';
import { useStore } from '../store';

function App() {
  const scene = useStore((state) => state.scene.val);
  const event = useStore((state) => state.events);

  const SceneComponent = (() => {
    if (scene instanceof SelectionScene)
      return <SelectionSceneUI scene={scene} />;
    if (scene instanceof MainScene) return <MainSceneUI />;
    return null;
  })();

  return (
    <>
      <Container fluid className="h-100">
        {SceneComponent}
      </Container>
      {event.val.map((e) => (
        <EventDialog key={e.id} event={e} onClose={() => event.remove(e)} />
      ))}
    </>
  );
}

export default App;
