import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://localhost:5000/formulaires";

const FormulaireComponent = () => {
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [formulaires, setFormulaires] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get userId from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId = null;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        userId = decodedToken?.sub;
      } catch (err) {
        setError("Erreur lors du décodage du token.");
        setLoading(false);
        return;
      }
    } else {
      setError("Token manquant. Veuillez vous connecter.");
      setLoading(false);
      return;
    }

    // Fetch user entreprise
    const fetchUserEntreprise = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
        const user = userResponse.data;
        if (!user.entreprise) {
          setError("Entreprise de l'utilisateur non trouvée.");
          setLoading(false);
          return;
        }
        setUserEntreprise(user.entreprise);
      } catch (err) {
        setError("Erreur lors de la récupération des données utilisateur.");
        setLoading(false);
      }
    };
    fetchUserEntreprise();
  }, []);

 

  const fetchFormulaires = async () => {
    try {
      setLoading(true);
      console.log("Entreprise utilisée pour le fetch :", userEntreprise); // <-- Ajout du log
      const response = await axios.get(`${API_BASE_URL}/entreprise/${userEntreprise}/formulaires`);
      console.log("Réponse du backend :", response.data); // <-- Ajout du log
      setFormulaires(response.data);
      setLoading(false);
    } catch (error) {
      setFormulaires([]);
      setLoading(false);
    }
  };
 // Fetch forms when entreprise is available
  useEffect(() => {
    if (userEntreprise) {
      fetchFormulaires();
    }
    // eslint-disable-next-line
  }, [userEntreprise]);
  const addField = () => {
    setFields([...fields, { nom: "", type: "text", required: false }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const createForm = async () => {
    try {
      if (!formTitle.trim()) {
        alert("Le titre du formulaire est requis!");
        return;
      }
      if (fields.length === 0) {
        alert("Ajoutez au moins un champ au formulaire!");
        return;
      }
      for (const field of fields) {
        if (!field.nom.trim()) {
          alert("Tous les champs doivent avoir un nom!");
          return;
        }
      }
      await axios.post(API_BASE_URL, {
        titre: formTitle,
        champs: fields,
        entreprise: userEntreprise
      });
      alert("Formulaire créé avec succès !");
      fetchFormulaires();
      setFormTitle("");
      setFields([]);
    } catch (error) {
      alert("Erreur lors de la création du formulaire. Veuillez réessayer.");
    }
  };

  const handleResponseChange = (champId, value) => {
    setResponses({ ...responses, [champId]: value });
  };

  const submitResponses = async () => {
    try {
      if (!selectedForm) {
        alert("Veuillez sélectionner un formulaire!");
        return;
      }
      const responseArray = selectedForm.champs.map(champ => ({
        formulaire: selectedForm._id,
        champ: champ._id,
        valeur: responses[champ._id] || ""
      }));
      await axios.post(`${API_BASE_URL}/repondre`, {
        formulaire: selectedForm._id,
        reponses: responseArray
      });
      alert("Réponses envoyées avec succès !");
      setResponses({});
      setSelectedForm(null);
    } catch (error) {
      alert("Erreur lors de l'envoi des réponses. Veuillez réessayer.");
    }
  };

  const renderFieldInput = (champ) => {
    switch (champ.type) {
      case "text":
        return (
          <input
            type="text"
            onChange={(e) => handleResponseChange(champ._id, e.target.value)}
            value={responses[champ._id] || ""}
            required={champ.required}
          />
        );
      case "number":
        return (
          <input
            type="number"
            onChange={(e) => handleResponseChange(champ._id, e.target.value)}
            value={responses[champ._id] || ""}
            required={champ.required}
          />
        );
      case "email":
        return (
          <input
            type="email"
            onChange={(e) => handleResponseChange(champ._id, e.target.value)}
            value={responses[champ._id] || ""}
            required={champ.required}
          />
        );
      case "textarea":
        return (
          <textarea
            onChange={(e) => handleResponseChange(champ._id, e.target.value)}
            value={responses[champ._id] || ""}
            required={champ.required}
          />
        );
      default:
        return (
          <input
            type="text"
            onChange={(e) => handleResponseChange(champ._id, e.target.value)}
            value={responses[champ._id] || ""}
            required={champ.required}
          />
        );
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="formulaire-container">
      <div className="create-form-section">
        <h2>Créer un formulaire</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Titre du formulaire"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button onClick={addField} className="btn btn-secondary">
          Ajouter un champ
        </button>
        {fields.map((field, index) => (
          <div key={index} className="field-group">
            <input
              type="text"
              placeholder="Nom du champ"
              value={field.nom}
              onChange={(e) => handleFieldChange(index, "nom", e.target.value)}
              className="form-control"
            />
            <select
              value={field.type}
              onChange={(e) => handleFieldChange(index, "type", e.target.value)}
              className="form-control"
            >
              <option value="text">Texte</option>
              <option value="number">Nombre</option>
              <option value="email">Email</option>
              <option value="textarea">Zone de texte</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => handleFieldChange(index, "required", e.target.checked)}
              />
              Obligatoire
            </label>
          </div>
        ))}
        <button onClick={createForm} className="btn btn-primary">
          Créer le formulaire
        </button>
      </div>
      <div className="fill-form-section">
        <h2>Remplir un formulaire</h2>
        {formulaires.length > 0 ? (
          <>
            <select
              onChange={(e) => setSelectedForm(formulaires.find(f => f._id === e.target.value))}
              className="form-control"
            >
              <option value="">Sélectionner un formulaire</option>
              {formulaires.map((form) => (
                <option key={form._id} value={form._id}>{form.titre}</option>
              ))}
            </select>
            {selectedForm && (
              <div className="selected-form">
                <h3>{selectedForm.titre}</h3>
                {selectedForm.champs.map((champ) => (
                  <div key={champ._id} className="form-group">
                    <label>{champ.nom}</label>
                    {renderFieldInput(champ)}
                  </div>
                ))}
                <button onClick={submitResponses} className="btn btn-success">
                  Envoyer les réponses
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-forms-message">
            Aucun formulaire ajouté
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaireComponent;