import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';












export default function CustomDomains() {

  const user = useSelector(state => state.brandUser);
  const navigate = useNavigate();


  const fetchData = async () => {
    // try {

    //   const fetchBalance = await axios.post(baseUrl+"/brand/get-account-balance",
    //     {
    //       brand_id: user.brand_id,
    //     }
    //   );

    //   setBalance(fetchBalance.data.balance);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  useEffect(() => {

    if(!user.user_id){

      navigate("/login/brand");

    }

    else if(user.user_id){
      fetchData();
    }
  }, []);
    




  return (
    <>

{/* <Button startIcon={<KeyboardBackspaceIcon />} onClick={()=> { navigate("/creator/profile")}}>Back</Button> */}



<div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh", // Adjust the height as needed
    }}
  >
    <DirectionsRunIcon style={{ fontSize: '60px', marginBottom: '20px', color: '#5D12D2'}}/>
    <div> Coming Soon...</div>
  </div>

      </>
  );
}