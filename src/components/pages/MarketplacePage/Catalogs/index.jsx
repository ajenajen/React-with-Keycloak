import { useState, useEffect } from 'react';
import axios from 'axios';

const timeout = (ms) => new Promise((r) => setTimeout(r, ms));

function Catalogs() {
  // const [data, setData] = useState('no data');
  // useEffect(() => {
  //   const fetchAllPackages = async () => {
  //     try {
  //       const reqOptions = {
  //         method: 'GET',
  //         mode: 'no-cors'
  //       };
  //       const response = await axios.request(
  //         'https://charts.bitnami.com/bitnami',
  //         { ...reqOptions }
  //       );

  //       console.log(response);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchAllPackages();
  //   console.log('data', data);
  // }, []);

  return <>Catalogs list</>;
}

export default Catalogs;
