import { useState } from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { SelectionScene } from '../game/scene/SelectionScene';
import SelectionSceneUI from './scene/Selection';
import MainSceneUI from './scene/main';
import { MainScene } from '../game/scene/MainScene';
import EventDialog from './component/EventDialog';
import { VisibleEvent } from '../game/event/VisibleEvent';
import { useStore } from '..';

function App() {
  const [events, setEvents] = useState<VisibleEvent[]>([]);
  const scene = useStore((state) => state.scene.val);

  return (
    <>
      <Container fluid className="h-100">
        {scene instanceof SelectionScene ? (
          <SelectionSceneUI scene={scene} />
        ) : (
          scene instanceof MainScene && (
            <MainSceneUI
              scene={scene}
              onEvent={(e) => setEvents([...events, e])}
            />
          )
        )}
      </Container>

      {events.map((e) => (
        <EventDialog
          key={e.id}
          event={e}
          onClose={() => setEvents(events.filter((d) => d != e))}
        ></EventDialog>
      ))}
    </>
  );
}

export default App;
