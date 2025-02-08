import Navbar from "../../navbar/Navbar";
import React, { useState,useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";




const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Show = () => {

    const [dataNew, setDataNew] = useState(null);
    const [data, setData] = useState([]); // State to store fetched and processed data
    const[user, setUser]=useState([]);
    const [error, setError] = useState(null); // State to store errors
    const [loading, setLoading] = useState(true); // State for loading status
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/getExpense", {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          });
          setUser(response.data.user);
  
          if (response.data.user) {
            let total = 0;
            const processedData = [];
  
            // Process data into the desired format
            for (let i = 0; i < 31; i++) {
              total += response.data.user.dailyExpenses[i]; // Accumulate total
              processedData.push({
                name: "day" + (i + 1),
                amount: response.data.user.dailyExpenses[i],
                average: (total / (i + 1)).toFixed(2), // Calculate average
              });
            }
  
            setData(processedData); // Update the processed data into state
          }
        } catch (err) {
          setError(err.message || "Something went wrong!"); // Handle errors
        } finally {
          setLoading(false); // Turn off loading state
        }
      };
  
      fetchData(); // Invoke the fetch function
    }, []);
    
const data1 = [
  { name: "Rent", value:user.rent },
  { name: "houseHold", value: user.houseHold },
  { name: "cloth", value: user.cloth },
  { name: "food", value: user.food },
  { name: "groceries", value: user.groceries },
  { name: "other", value: user.other },

];

  return (
    <>
      <Navbar />
      <div className="show-container">
        <h1>Present Month</h1>
        <select className="select-month">
          <option value="">present month</option>
          <option value="">previous month</option>
        </select>
        <div className="charts">
          {/* Line Chart */}
          <div className="chart-container">
            <h2>Expense vs Average</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Average"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="chart-container">
            <h2>Category Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data1}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data1.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Show;
