import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Team = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("Rôle");
  const [redirectPath, setRedirectPath] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  // Ajouter deux états pour la recherche et le filtre rôle
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.sub;
          const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserName(response.data.nom);
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userRole === "superadminabshore") {
      setRedirectPath("/registration");
    } else if (userRole === "superadminentreprise") {
      setRedirectPath("/AddMemberByAdminEnt");
    }
  }, [userRole]);

  useEffect(() => {
    const fetchUsersByEntreprise = async () => {
  const token = localStorage.getItem("token");
      if (!token) {
      setLoading(false);
      return;
    }
      let userId = null;
    try {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.sub;
      } catch (error) {
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
        const user = response.data;
        if (!user.entreprise) {
          setLoading(false);
          return;
        }
      const usersResponse = await axios.get(
        `http://localhost:5000/auth/entreprise/${user.entreprise}/users`,
        config
      );
      setUsers(usersResponse.data);
    } catch (error) {
        setLoading(false);
    } finally {
      setLoading(false);
    }
  };
      fetchUsersByEntreprise();
  }, []);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setUpdatedName(user.nom);
    setUpdatedEmail(user.email);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleUpdate = async () => {
    try {
      await axios.patch(`http://localhost:5000/auth/${selectedUser._id}`, {
        nom: updatedName,
        email: updatedEmail,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { ...user, nom: updatedName, email: updatedEmail } : user
      ));
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
    
  if (loading) {
    return <span>Loading...</span>;
  }

  // Remplacer le mapping sur users par un mapping sur users filtrés
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.nom.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    let matchesRole = true;
    if (roleFilter === 'superadmin') {
      matchesRole = user.role === 'superadminabshore' || user.role === 'superadminentreprise';
    } else if (roleFilter) {
      matchesRole = user.role === roleFilter;
    }
    return matchesSearch && matchesRole;
  });

  return (
    <div className="card">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span>Show</span>
            <select className="form-select form-select-sm w-auto" defaultValue="Select Number">
              <option value="Select Number" disabled>Select Number</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          <div className="icon-field">
            <input
              type="text"
              className="form-control form-control-sm w-auto"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="icon">
              <Icon icon="ion:search-outline" />
            </span>
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <select className="form-select form-select-sm w-auto" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">Select Role</option>
            <option value="superadmin">Super Admin</option>
            <option value="moderateur">Moderateur</option>
          </select>
          {/* <Link
            to={redirectPath}
            className={`btn btn-sm btn-primary-600 ${!redirectPath ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!redirectPath}
          >
            <i className="ri-add-line" /> Add Team Member
          </Link> */}
          <Link
            to='/AddMember'
            className="btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11"
            disabled={!redirectPath}
          >
            <i className="ri-add-line" /> Add Team Member
          </Link>

          
        </div>
      </div>
      <div className="card-body">
        <table className="table bordered-table mb-0">
          <thead>
            <tr>
              <th scope="col">
                <div className="form-check style-check d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="checkAll"
                  />
                  <label className="form-check-label" htmlFor="checkAll">
                    S.L
                  </label>
                </div>
              </th>
              {/* <th scope="col">ID</th> */}
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td>
                  <div className="form-check style-check d-flex align-items-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue=""
                      id={`check${index + 1}`}
                    />
                    <label className="form-check-label" htmlFor={`check${index + 1}`}>
                      {String(index + 1).padStart(2, '0')}
                    </label>
                  </div>
                </td>
                {/* <td>
                  <Link to="#" className="text-primary-600">
                    #{user._id.slice(-6)}
                  </Link>
                </td> */}
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={`assets/images/user-list/user-list${(index % 10) + 1}.png`}
                      alt=""
                      className="flex-shrink-0 me-12 radius-8"
                    />
                    <h6 className="text-md mb-0 fw-medium flex-grow-1">
                      {user.nom}
                    </h6>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={
                    (user.role === 'superadminabshore' || user.role === 'superadminentreprise')
                      ? 'bg-primary-light text-info-pressed px-24 py-4 rounded-pill fw-medium text-sm'
                      : user.role === 'moderateur'
                      ? 'bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm'
                      : 'bg-secondary-light text-black px-24 py-4 rounded-pill fw-medium text-sm'
                  }>
                    {(user.role === 'superadminabshore' || user.role === 'superadminentreprise') ? 'Super Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>


                <td>
                  <Link
                    to={`/UserDetail/${user._id}`}
                    className="w-32-px h-32-px me-8 bg-primary-light text-info-pressed rounded-circle d-inline-flex align-items-center justify-content-center"
                  >
                    <Icon icon="iconamoon:eye-light" />
                  </Link>
                  {/* <Link
                    to="#"
                    onClick={() => handleOpen(user)}
                    className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                  >
                    <Icon icon="lucide:edit" />
                  </Link> */}
                  <Link
                    to="#"
                    onClick={() => handleDelete(user._id)}
                    className="w-32-px h-32-px me-8 bg-neutral-300 text-neutral-500 rounded-circle d-inline-flex align-items-center justify-content-center"
                  >
                    <Icon icon="mingcute:delete-2-line" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
          <span>Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries</span>
          <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
            <li className="page-item">
              <Link
                className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
                to="#"
              >
                <Icon icon="ep:d-arrow-left" className="text-xl" />
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link bg-primary-600 text-white fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px"
                to="#"
              >
                1
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px"
                to="#"
              >
                2
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px"
                to="#"
              >
                3
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
                to="#"
              >
                <Icon icon="ep:d-arrow-right" className="text-xl" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Update User</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
                className="w-full border rounded px-3 py-2"
          />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
          />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
            Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;