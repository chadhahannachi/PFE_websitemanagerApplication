import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/auth/users");
        setUsers(res.data);
      } catch (err) {
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Fetch all companies
  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const res = await axios.get("http://localhost:5000/entreprises");
        setEntreprises(res.data);
      } catch (err) {
        setEntreprises([]);
      }
    };
    fetchEntreprises();
  }, []);

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.nom.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter
      ? (roleFilter === "superadmin"
          ? (user.role === "superadminabshore" || user.role === "superadminentreprise")
          : user.role === roleFilter)
      : true;
    const matchesCompany = companyFilter
      ? (user.entreprise === companyFilter)
      : true;
    return matchesSearch && matchesRole && matchesCompany;
  });

  return (
    <div className="card">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex flex-wrap align-items-center gap-3">
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
          <select
            className="form-select form-select-sm w-auto"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="superadminabshore">Super Admin ABshore</option>
            <option value="superadminentreprise">Super Admin Entreprise</option>
            <option value="moderateur">Moderateur</option>
          </select>
          <select
            className="form-select form-select-sm w-auto"
            value={companyFilter}
            onChange={e => setCompanyFilter(e.target.value)}
          >
            <option value="">All Companies</option>
            {entreprises.map(ent => (
              <option key={ent._id} value={ent._id}>{ent.nom}</option>
            ))}
          </select>
          <Link
            to="/AddUserPage"
            className="btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11"
          >
            <i className="ri-add-line" /> Add User
          </Link>
        </div>
      </div>
      <div className="card-body">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table bordered-table mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Entreprise</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.nom}</td>
                  <td>{user.email}</td>
                  <td>{entreprises.find(ent => ent._id === user.entreprise)?.nom || user.nomEntreprise || user.entreprise}</td>
                  <td>
                    {(user.role === 'superadminabshore' || user.role === 'superadminentreprise')
                      ? 'Super Admin'
                      : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </td>
                  <td>
                    <Link
                      to={`/UserDetail/${user._id}`}
                      className="w-32-px h-32-px me-8 bg-primary-light text-info-pressed rounded-circle d-inline-flex align-items-center justify-content-center"
                    >
                      <Icon icon="iconamoon:eye-light" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
          <span>Showing {filteredUsers.length} of {users.length} users</span>
        </div>
      </div>
    </div>
  );
};

export default UsersList; 