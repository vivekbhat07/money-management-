import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../navbar/Navbar';
import { MdLocalGroceryStore } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { GiClothes } from "react-icons/gi";
import { GiExpense } from "react-icons/gi";
import { FaBowlFood } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { MdChair } from "react-icons/md";
import './Table.css';

function Table() {
  const [data, setData] = useState([]);
  const [user,setUser]=useState([]);
  const [dataid, setDataid] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Combine,setCombinedData]=useState(0);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // First API call
        const response = await axios.get('http://localhost:5000/api/getExpense', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setDataid(response.data.user.currentMonths|| []);
        setUser(response.data.user);
        

        // If dataid is not empty, make second API calls
        if (true) {
          const responses = await Promise.all(
            response.data.user.currentMonths.map((id) =>
              axios.get(`http://localhost:5000/api/data/${id}`, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                },
              })
            )
          );

          const fetchedData = responses.map((res) => res.data);
          setData(fetchedData);
          console.log("the real data",data)
        }
        // console.log('Data fetched successfully:', response.data);
      } catch (err) {
        setError(err.message || 'Something went wrong!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, []);

  useEffect(() => {
    setCombinedData({
      groceries: [user.groceries,<MdLocalGroceryStore/>],
      rent: [user.rent,<FaHouse/>],
      food: [user.food,<FaBowlFood/>],
      cloth: [user.cloth,<GiClothes/>],
      household: [user.houseHold,<MdChair/>],
      other: [user.other,<GiExpense/>]
    });
  }, [data]); // Recalculate whenever the category states change
  
  const handleDelete = async (index) => {
    try {
      const id=dataid[index];
      console.log(id);
      await axios.delete(`/api/delete/${id}`, {
        withCredentials: true, // If your backend requires cookies for authentication
      });
  
      // Update the frontend state after successful deletion
      const updatedData = data.filter((transaction) => transaction.id !== id);
      setData(updatedData); // Update the state with the new array
  
      console.log(`Transaction with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting the transaction:", error);
      alert("Failed to delete the transaction. Please try again.");
    }
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return (
    <div>
      <Navbar />
      <p>Error: {error}</p>
    </div>
  );
  
  return (
    <div>
      <Navbar />
      <h1 className='heading'>Table of Transactions</h1>

      <div className='table-container'>
        <table cellSpacing="20px" cellPadding="20px" border="1">
          <thead>
            <tr>
              <th>SrNo</th>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>

            </tr>
          </thead>
          <tbody>
            {data.map((transaction, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.Etype}</td>
                <td><MdDelete onClick={() => handleDelete(index)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div class="grid-container">
          {Object.entries(Combine).map(([key, value]) => (
  <div className="box" key={key}>
   <p>{value[1]}<b>{key}: {value[0]}</b></p> 
  </div>
))}


</div>

    </div>
  );
}

export default Table;
