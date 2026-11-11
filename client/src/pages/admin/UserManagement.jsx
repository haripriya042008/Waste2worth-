import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { formatDate } from '../../utils/formatters';
import { Users, Search, Filter, Shield, AlertCircle, CheckCircle, Ban, Check } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers({
        role: roleFilter,
        status: statusFilter,
        search
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleStatusChange = async (userId, newStatus, userName) => {
    if (!window.confirm(`Set status of ${userName} to '${newStatus}'?`)) return;

    try {
      await userService.updateUserStatus(userId, newStatus);
      setActionMessage(`User status for ${userName} updated to ${newStatus}.`);
      setTimeout(() => setActionMessage(''), 4000);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          User Governance
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">User Management Directory</h1>
        <p className="text-xs text-slate-500">
          Review, filter, and moderate accounts across donors, charities, and administrators.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
          >
            <option value="all">All Roles</option>
            <option value="donor">Donors</option>
            <option value="charity">Charities</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Name & Organization</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      {u.name}
                      {u.donorCategory && (
                        <span className="text-[10px] text-slate-400 block font-normal">{u.donorCategory}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-6 text-slate-600">{u.phone}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.accountStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.accountStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      {u.role !== 'admin' && (
                        <div className="inline-flex space-x-1.5">
                          {u.accountStatus !== 'active' && (
                            <button
                              onClick={() => handleStatusChange(u._id, 'active', u.name)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px]"
                            >
                              Activate
                            </button>
                          )}
                          {u.accountStatus === 'active' && (
                            <button
                              onClick={() => handleStatusChange(u._id, 'suspended', u.name)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-[11px]"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
