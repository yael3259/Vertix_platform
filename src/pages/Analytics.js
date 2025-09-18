

// // import { useEffect, useState } from "react";
// // import { motion } from "framer-motion";
// // import {
// //   get_overview_data,
// //   get_administrators,
// //   get_signups_last_six_months,
// // } from "../routes/AnalyticsAPI";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // import "../styles/Analytics.css";

// // // קומפוננטת Card פשוטה במקום shadcn/ui
// // const Card = ({ children }) => (
// //   <div className="bg-white shadow-lg rounded-2xl p-4">{children}</div>
// // );

// // export const Analytics = () => {
// //   const [overview, setOverview] = useState(null);
// //   const [admins, setAdmins] = useState([]);
// //   const [signups, setSignups] = useState([]);

// //   useEffect(() => {
// //     get_overview_data().then((res) => setOverview(res.data));
// //     get_administrators().then((res) => setAdmins(res.data.administrators));
// //     get_signups_last_six_months().then((res) => {
// //       const data = Object.entries(res.data).map(([month, count]) => ({
// //         month,
// //         count,
// //       }));
// //       setSignups(data);
// //     });
// //   }, []);

// //   if (!overview) return <div className="p-4">טוען נתונים...</div>;

// //   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// //   return (
// //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
// //       {/* כרטיס סיכום כללי */}
// //       <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
// //         <Card>
// //           <h2 className="text-xl font-bold mb-4">סקירה כללית</h2>
// //           <ResponsiveContainer width="100%" height={250}>
// //             <PieChart>
// //               <Pie
// //                 dataKey="value"
// //                 data={[
// //                   { name: "משתמשים", value: overview.users_count },
// //                   { name: "פוסטים", value: overview.posts_count },
// //                   { name: "הישגים", value: overview.achievements_count },
// //                   { name: "בוסטים", value: overview.boosts_count },
// //                 ]}
// //                 outerRadius={100}
// //                 fill="#8884d8"
// //                 label
// //                 isAnimationActive={true}
// //                 animationDuration={1500}
// //                 animationBegin={200}
// //               >
// //                 {[
// //                   overview.users_count,
// //                   overview.posts_count,
// //                   overview.achievements_count,
// //                   overview.boosts_count,
// //                 ].map((_, index) => (
// //                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                 ))}
// //               </Pie>
// //               <Tooltip />
// //             </PieChart>
// //           </ResponsiveContainer>
// //         </Card>
// //       </motion.div>

// //       {/* מנהלים */}
// //       <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
// //         <Card>
// //           <h2 className="text-xl font-bold mb-4">מנהלים ({admins.length})</h2>
// //           <div className="flex flex-wrap gap-4">
// //             {admins.map((admin, i) => (
// //               <div key={i} className="flex flex-col items-center">
// //                 <img
// //                   src={admin.profilePicture}
// //                   alt={admin.userName}
// //                   className="w-16 h-16 rounded-full shadow"
// //                 />
// //                 <p className="mt-2 text-sm">{admin.userName}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </Card>
// //       </motion.div>

// //       {/* משתמשים חדשים בחצי שנה אחרונה */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 30 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         className="md:col-span-2"
// //       >
// //         <Card>
// //           <h2 className="text-xl font-bold mb-4">הרשמות חדשות בחצי שנה</h2>
// //           <ResponsiveContainer width="100%" height={300}>
// //             <BarChart data={signups}>
// //               <XAxis dataKey="month" />
// //               <YAxis />
// //               <Tooltip />
// //               <Bar
// //                 dataKey="count"
// //                 fill="#82ca9d"
// //                 isAnimationActive={true}
// //                 animationDuration={1200}
// //                 animationBegin={300}
// //               />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </Card>
// //       </motion.div>
// //     </div>
// //   );
// // };


// import { useEffect, useState } from "react";
// import { get_overview_data,
//   //  get_administrators, get_signups_last_six_months 
//   } from "../routes/AnalyticsAPI"; // הקובץ שכתבת בו את הפונקציות



// export const Analytics = () => {
//   const [overview, setOverview] = useState(null);
//   // const [admins, setAdmins] = useState(null);
//   // const [signups, setSignups] = useState(null);

//   useEffect(() => {
//     get_overview_data().then(res => setOverview(res.data)).catch(err => console.error(err));
//     // get_administrators().then(res => setAdmins(res.data)).catch(err => console.error(err));
//     // get_signups_last_six_months().then(res => setSignups(res.data)).catch(err => console.error(err));
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Overview</h2>
//       <pre>{overview ? JSON.stringify(overview, null, 2) : "Loading..."}</pre>
// {/* 
//       <h2>Administrators</h2>
//       <pre>{admins ? JSON.stringify(admins, null, 2) : "Loading..."}</pre>

//       <h2>Signups (last 6 months)</h2>
//       <pre>{signups ? JSON.stringify(signups, null, 2) : "Loading..."}</pre> */}
//     </div>
//   );
// }



import axios from "axios";
import { useEffect, useState } from "react";

export const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("https://python-analytics.vercel.app/api/overview")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  if (!data) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}

export default Analytics;
