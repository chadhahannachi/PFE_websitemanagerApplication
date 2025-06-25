import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Modal, TextField, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [redirectPath, setRedirectPath] = useState("");
  const [userName, setUserName] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("Rôle");

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.sub;
          const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserName(response.data.nom);
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        }
      }
    };
    fetchUserData();
  },);

  useEffect(() => {
    if (userRole === "superadminabshore") {
      setRedirectPath("/registration");
    } else if (userRole === "superadminentreprise") {
      setRedirectPath("/AddMemberByAdminEnt");
    }
  }, [userRole]);

  const token = localStorage.getItem("token");

  let userId = null;
  let decodedToken = null;

  if (token) {
    try {
      decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      // Use "sub" as the user ID instead of "id"
      userId = decodedToken?.sub;
      console.log("Extracted User ID:", userId);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  } else {
    console.error("Token is missing from localStorage.");
  }

  const fetchUsersByEntreprise = async () => {
    if (!token || !userId) {
      console.error("Token or User ID is missing");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Fetch the authenticated user's details
      const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      const user = response.data;
      console.log("Authenticated User:", user);

      if (!user.entreprise) {
        console.error("User's company (entreprise) is missing");
        setLoading(false);
        return;
      }

      // Fetch users of the same company
      const usersResponse = await axios.get(
        `http://localhost:5000/auth/entreprise/${user.entreprise}/users`,
        config
      );

      console.log("Fetched Users:", usersResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users only when token and userId are available
  useEffect(() => {
    if (token && userId) {
      fetchUsersByEntreprise();
    }
  }, [token, userId]);

  // Handle modal open and populate fields
  const handleOpen = (user) => {
    setSelectedUser(user);
    setUpdatedName(user.nom);
    setUpdatedEmail(user.email);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Handle user update
  const handleUpdate = async () => {
    try {
      await axios.patch(`http://localhost:5000/auth/${selectedUser._id}`, {
        nom: updatedName,
        email: updatedEmail,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the user in the state
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { ...user, nom: updatedName, email: updatedEmail } : user
      ));

      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle user delete
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the user from the state
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Table columns
  // const columns = [
  //   {
  //     field: "nom",
  //     headerName: "Name",
  //     flex: 1,
  //     cellClassName: "name-column--cell",
  //   },
  //   {
  //     field: "email",
  //     headerName: "Email",
  //     flex: 1,
  //   },
  //   {
  //     field: "role",
  //     headerName: "Role",
  //     flex: 1,
  //     renderCell: ({ row: { role } }) => {
  //       let bgColor;
  //       let Icon;

  //       switch (role) {
  //         case "SuperAdminABshore":
  //           bgColor = colors.greenAccent;
  //           Icon = AdminPanelSettingsOutlinedIcon;
  //           break;
  //         case "SuperAdminEntreprise":
  //           bgColor = colors.greenAccent;
  //           Icon = SecurityOutlinedIcon;
  //           break;
  //         case "Moderateur":
  //           bgColor = colors.greenAccent;
  //           Icon = LockOpenOutlinedIcon;
  //           break;
  //         default:
  //           bgColor = colors.greenAccent;
  //           Icon = null;
  //       }

  //       return (
  //         <Box
  //           width="60%"
  //           m="0 auto"
  //           p="5px"
  //           display="flex"
  //           justifyContent="center"
  //           alignItems="center"
  //           backgroundColor={bgColor}
  //           borderRadius="4px"
  //         >
  //           {Icon && <Icon />}
  //           <Typography color={colors.grey} sx={{ ml: "5px" }}>
  //             {role}
  //           </Typography>
  //         </Box>
  //       );
  //     },
  //   },
  //   {
  //     field: "actions",
  //     headerName: "Actions",
  //     flex: 1,
  //     renderCell: ({ row }) => (
  //       <Box display="flex" gap="10px">
  //         <EditIcon onClick={() => handleOpen(row)} style={{ cursor: "pointer" }} />
  //         <DeleteIcon onClick={() => handleDelete(row._id)} style={{ cursor: "pointer" }} />
  //       </Box>
  //     ),
  //   },
  // ];

  const columns = [
    {
      field: "nom",
      headerName: "Name", 
      flex: 1, 
      cellClassName: "name-column--cell", 
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,

      renderCell: ({ row: { role } }) => {
      let bgColor;
      let Icon;
    
        switch (role) {
          case "SuperAdminABshore":
            bgColor = colors.greenAccent[600];
            Icon = AdminPanelSettingsOutlinedIcon;
          break;
          case "SuperAdminEntreprise":
            bgColor = colors.greenAccent[700];
            Icon = SecurityOutlinedIcon;
          break;
          case "Moderateur":
            bgColor = colors.greenAccent[700];
            Icon = LockOpenOutlinedIcon;
          break;
          default:
            bgColor = colors.greenAccent[500];
            Icon = null;
        }
        
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor={bgColor}
            borderRadius="4px"
          >
            {Icon && <Icon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      
      }, 
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px">
          <EditIcon onClick={() => handleOpen(row)} style={{ cursor: "pointer" }} />
          <DeleteIcon onClick={() => handleDelete(row._id)} style={{ cursor: "pointer" }} />
        </Box>
      ),
    },
    
    ];

    
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />

      <Button onClick={() => navigate(redirectPath)} disabled={!redirectPath} variant="contained"
        color="warning">
        Add a new Team member
      </Button>

      {/* <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent,
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary,
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent,
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent} !important`,
          },
        }}
      > */}

<Box
  m="40px 0 0 0"
  height="75vh"
  sx={{
    "& .MuiDataGrid-root": {
      border: "none",
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "none",
    },
    "& .name-column--cell": {
      color: colors.greenAccent[300],
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: colors.blueAccent[700],
      borderBottom: "none",
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: colors.primary[400],
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
      backgroundColor: colors.blueAccent[700],
    },
    "& .MuiCheckbox-root": {
      color: `${colors.greenAccent[200]} !important`,
    },
    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
  }}
>



        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}

        />
      </Box>

      {/* Update User Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Update User
          </Typography>
          <TextField
            label="Name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Team;