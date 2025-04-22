// import React, { createContext, useState } from 'react';


// export const Context = createContext({
//     color: '#000000',  // ערך ברירת מחדל
//     theFunc: () => {}  // פונקציה ברירת מחדל
// });

// export const ContextProvider = ({ children }) => {
//     const [color, setColor] = useState('#000000');

//     const theFunc = (newColor) => {
//         setColor(newColor);
//     };

//     return (
//         <Context.Provider value={{ color, theFunc }}>
//             {children}
//         </Context.Provider>
//     );
// };



// import React, { createContext, useState } from 'react';

// export const Context = createContext();

// // export const MyProvider = ({ children, userRole, userDeatails }) => {
//     export const MyProvider = ({ children, userDeatails }) => {
//     const [color, setColor] = useState('#ffffff');
//     const updateColor = (newColor) => setColor(newColor);

//     return (
//         <Context.Provider value={{ color, updateColor, userDeatails }}>
//             {children}
//         </Context.Provider>
//     );
// };





// import React, { createContext, useState } from 'react';

// export const Context = createContext({
//   color: '#ffffff',
//   theFunc: () => {},
// });

// export const MyProvider = ({ children, userDeatails }) => {
//   const [color, setColor] = useState('#ffffff');

//   const updateColor = (newColor) => setColor(newColor);

//   return (
//     <Context.Provider value={{ color, updateColor, userDeatails }}>
//       {children}
//     </Context.Provider>
//   );
// };


// import React, { createContext, useState } from "react";


// // color function
// export const color_context = createContext({
//   color: '#ffffff',
//   theFunc: () => {},
// });

// export const MyProvider = ({ children, userDeatails }) => {
//   const [color, setColor] = useState('#ffffff');

//   const updateColor = (newColor) => {
//     setColor(newColor);
//   };

//   return (
//     <color_context.Provider value={{ color, updateColor, userDeatails }}>
//       {children}
//     </color_context.Provider>
//   );
// };


import React, { createContext, useState } from "react";


// color function
export const ColorContext = createContext({
  color: '#ffffff',
  theFunc: () => {},
});

export const MyProvider = ({ children }) => {
  const [color, setColor] = useState('#ffffff');

  const updateColor = (newColor) => {
    setColor(newColor);
  };

  return (
    <ColorContext.Provider value={{ color, updateColor }}>
      {children}
    </ColorContext.Provider>
  );
};
