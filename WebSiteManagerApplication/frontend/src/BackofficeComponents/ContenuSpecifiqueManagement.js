import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Checkbox, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const ContenuSpecifiquesManagement = () => {
    const [contenuspecifiques, setContenuSpecifiques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentKey, setCurrentKey] = useState("");
const [currentValue, setCurrentValue] = useState("");

    const [currentContenuSpecifique, setCurrentContenuSpecifique] = useState({
        id: null,
        titre: "",
        description: "",
        image: "",
        datePublication: "",
        isPublished: false,
        type: "",
        // variable: {},
        variables: [],  // Change "variable" en "variables" (tableau)

    });
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        fetchContenuSpecifiques();
    }, []);

    useEffect(() => {
        if (!currentContenuSpecifique.variables) {
          setCurrentContenuSpecifique((prev) => ({
            ...prev,
            variables: [],
          }));
        }
      }, [currentContenuSpecifique]);
      
    const fetchContenuSpecifiques = async () => {
        try {
            const response = await axios.get("http://localhost:5000/contenus/ContenuSpecifique");
            setContenuSpecifiques(response.data);
        } catch (error) {
            console.error("Error fetching contenuspecifiques", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (currentContenuSpecifique.id) {
                await axios.patch(`http://localhost:5000/contenus/ContenuSpecifique/${currentContenuSpecifique.id}`, currentContenuSpecifique);
            } else {
                await axios.post("http://localhost:5000/contenus/ContenuSpecifique", currentContenuSpecifique);
            }
            setOpen(false);
            fetchContenuSpecifiques();
        } catch (error) {
            console.error("Error saving contenuspecifique", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/contenus/ContenuSpecifique/${id}`);
            fetchContenuSpecifiques();
        } catch (error) {
            console.error("Error deleting contenuspecifique", error);
        }
    };

    const handleVariableChange = (key, value) => {
        setCurrentContenuSpecifique((prev) => ({
            ...prev,
            variables: [...prev.variables, { key, value }], // Ajouter une nouvelle variable
        }));
    };
    

    const columns = [
        { field: "titre", headerName: "Titre", flex: 2 },
        { field: "description", headerName: "Description", flex: 3 },
        { field: "image", headerName: "Image URL", flex: 2 },
        { field: "datePublication", headerName: "Date de Publication", flex: 2 },
        { field: "isPublished", headerName: "Publié", flex: 1, type: "boolean" },
        { field: "type", headerName: "Type", flex: 1 },
        { field: "variables", headerName: "Variable", flex: 2, valueGetter: (params) => JSON.stringify(params.row.variables) },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => { setCurrentContenuSpecifique(params.row); setOpen(true); }}>
                        <EditIcon style={{ cursor: "pointer" }} />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header title="CONTENUS PERSONNALISÉS" subtitle="Gérer les Contenus Personnalisés" />
            <Button variant="contained" color="warning" onClick={() => {
                setCurrentContenuSpecifique({ id: null, titre: "", description: "", image: "", datePublication: "", isPublished: false, type: "", variable: {} });
                setOpen(true);
            }}>
                Ajouter un Contenu Spécifique
            </Button>
            <Box m="15px 0 0 0" height="75vh"
            sx={{
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-cell": { borderBottom: "none" },
                "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
                "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
                "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
                "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
              }}>
                <DataGrid rows={contenuspecifiques} columns={columns} getRowId={(row) => row._id} loading={loading} components={{ Toolbar: GridToolbar }} pageSize={5} />
            </Box>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, boxShadow: 24, borderRadius: 2 }}>
                    <TextField fullWidth margin="dense" value={currentContenuSpecifique.titre} onChange={(e) => setCurrentContenuSpecifique({ ...currentContenuSpecifique, titre: e.target.value })} placeholder="Titre" />
                    <TextField fullWidth margin="dense" value={currentContenuSpecifique.description} onChange={(e) => setCurrentContenuSpecifique({ ...currentContenuSpecifique, description: e.target.value })} placeholder="Description" />
                    <TextField fullWidth margin="dense" value={currentContenuSpecifique.image} onChange={(e) => setCurrentContenuSpecifique({ ...currentContenuSpecifique, image: e.target.value })} placeholder="URL de l'image" />
                    <TextField fullWidth margin="dense" type="date" value={currentContenuSpecifique.datePublication} onChange={(e) => setCurrentContenuSpecifique({ ...currentContenuSpecifique, datePublication: e.target.value })} />
                    <TextField fullWidth margin="dense" value={currentContenuSpecifique.type} onChange={(e) => setCurrentContenuSpecifique({ ...currentContenuSpecifique, type: e.target.value })} placeholder="Type" />
                    {/* <Box>
                        <TextField fullWidth margin="dense" placeholder="Clé" onChange={(e) => handleVariableChange(e.target.value, currentContenuSpecifique.variable[e.target.value] || "")} />
                        <TextField fullWidth margin="dense" placeholder="Valeur" onChange={(e) => handleVariableChange(Object.keys(currentContenuSpecifique.variable)[0], e.target.value)} />
                    </Box> */}

{/* <Box>
    <TextField 
        fullWidth 
        margin="dense" 
        placeholder="Clé" 
        value={currentKey}
        onChange={(e) => setCurrentKey(e.target.value)}
    />
    <TextField 
        fullWidth 
        margin="dense" 
        placeholder="Valeur" 
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
    />
    <Button 
        variant="contained" 
        color="primary" 
        onClick={() => {
            handleVariableChange(currentKey, currentValue);
            setCurrentKey("");
            setCurrentValue("");
        }}
    >
        Ajouter Clé/Valeur
    </Button>
</Box> */}

<Box>
    <TextField 
        fullWidth 
        margin="dense" 
        placeholder="Clé" 
        value={currentKey}
        onChange={(e) => setCurrentKey(e.target.value)}
    />
    <TextField 
        fullWidth 
        margin="dense" 
        placeholder="Valeur" 
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
    />
    <Button 
        variant="contained" 
        color="primary" 
        onClick={() => {
            if (currentKey && currentValue) {
                handleVariableChange(currentKey, currentValue);
                setCurrentKey("");
                setCurrentValue("");
            }
        }}
    >
        Ajouter Clé/Valeur
    </Button>

    {/* Affichage des variables existantes */}
    <Box mt={2}>
    {currentContenuSpecifique?.variables?.map((variable, index) => (

            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <span>{variable.key}: {variable.value}</span>
                <IconButton color="secondary" onClick={() => {
                    setCurrentContenuSpecifique((prev) => ({
                        ...prev,
                        variables: prev.variables.filter((_, i) => i !== index), // Supprimer la variable
                    }));
                }}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        ))}
    </Box>
</Box>



                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
                        <Button onClick={handleSave} color="primary">{currentContenuSpecifique.id ? "Modifier" : "Créer"}</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default ContenuSpecifiquesManagement;
