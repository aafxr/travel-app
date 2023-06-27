import Expenses from './module/Expenses'
import './App.css';

function App() {

  return (
    <div className="App">
      <Expenses
          user_id={Date.now().toString()}
          primary_entity_id={Date.now().toString()}
          primaryEntityType={'travel'}
      />
    </div>
  );
}

export default App;
