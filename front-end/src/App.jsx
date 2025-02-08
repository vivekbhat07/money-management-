import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from '../src/componets/home/Home'
import Show from './componets/main/Show';
import Login from './componets/auth/Login';
import Add from './componets/add/Add';
import Table from './componets/table/Table';
import SignUp from './componets/auth/Signin';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/table" element={<Table />} />
        <Route path="/add" element={<Add />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignUp />} />
        <Route path="/main" element={<Show/>} />
      </Routes>
    </Router>
  );
}

export default App;
