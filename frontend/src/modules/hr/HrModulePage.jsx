import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { TopNavBar } from '../../components/TopNavBar.jsx';
import { apiRequest } from '../../services/api.js';

export const HrModulePage = () => {
  const { user, role, hasRole } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    full_name: '',
    user_id: '',
    email: '',
    password: '',
    role: 'STAFF',
    hr_level: 'NONE',
    designation: '',
    phone: '',
  });

  const canAddStaff = hasRole(['ADMIN', 'SENIOR_HR']);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/users');
      if (res.success) {
        setStaffList(res.users || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });
      setIsAddUserOpen(false);
      setNewUser({
        full_name: '',
        user_id: '',
        email: '',
        password: '',
        role: 'STAFF',
        hr_level: 'NONE',
        designation: '',
        phone: '',
      });
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to create user');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopNavBar currentModuleName="Admin, HR & Clients" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-xs">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
                  Admin, HR & Clients Module
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Role Hierarchy
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Testing role-based routing, Google-style app switcher, and User ID staff logins.
              </p>
            </div>
          </div>

          {canAddStaff && (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff Member (Issue User ID)</span>
            </button>
          )}
        </div>

        {/* Current User Role Status Box */}
        <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-indigo-700" />
            <span className="text-indigo-900 font-medium">
              You are signed in as <span className="font-bold">{user?.full_name}</span> (User ID: <span className="font-mono font-bold text-indigo-800">{user?.user_id}</span>) with role:{' '}
              <span className="font-bold uppercase font-mono bg-white px-2 py-0.5 rounded border border-indigo-200">
                {role}
              </span>
            </span>
          </div>
          <span className="text-[11px] text-indigo-600 font-mono">
            {canAddStaff ? '✓ Write / Manage Privileges' : '○ View-Only Mode'}
          </span>
        </div>

        {/* Role Hierarchy Matrix Comparison Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Hierarchical Roles & Permissions Matrix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Role Level</th>
                  <th className="py-2.5 px-3">Inventory & Items</th>
                  <th className="py-2.5 px-3">Purchases & Sales</th>
                  <th className="py-2.5 px-3">Staff & HR Management</th>
                  <th className="py-2.5 px-3">Shop Profile & Financials</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className={role === 'ADMIN' ? 'bg-amber-50/50 font-medium' : ''}>
                  <td className="py-3 px-3 font-bold text-amber-900 flex items-center gap-1">
                    <span>👑 Admin</span>
                    {role === 'ADMIN' && <span className="text-[10px] text-amber-700 bg-amber-100 px-1 rounded">(You)</span>}
                  </td>
                  <td className="py-3 px-3 text-emerald-700">Full Access (Create/Edit/Delete)</td>
                  <td className="py-3 px-3 text-emerald-700">Full Billing & Purchase</td>
                  <td className="py-3 px-3 text-emerald-700">Manage All Roles & Grades</td>
                  <td className="py-3 px-3 text-emerald-700">Full Shop Branding & Config</td>
                </tr>

                <tr className={role === 'SENIOR_HR' ? 'bg-indigo-50/50 font-medium' : ''}>
                  <td className="py-3 px-3 font-bold text-indigo-900 flex items-center gap-1">
                    <span>⭐ Senior HR</span>
                    {role === 'SENIOR_HR' && <span className="text-[10px] text-indigo-700 bg-indigo-100 px-1 rounded">(You)</span>}
                  </td>
                  <td className="py-3 px-3 text-slate-700">View & Create</td>
                  <td className="py-3 px-3 text-slate-700">Record Purchases / Sales</td>
                  <td className="py-3 px-3 text-emerald-700">Hire Staff & Manage Records</td>
                  <td className="py-3 px-3 text-slate-400">View Only (No Settings Edit)</td>
                </tr>

                <tr className={role === 'JUNIOR_HR' ? 'bg-blue-50/50 font-medium' : ''}>
                  <td className="py-3 px-3 font-bold text-blue-900 flex items-center gap-1">
                    <span>🔹 Junior HR</span>
                    {role === 'JUNIOR_HR' && <span className="text-[10px] text-blue-700 bg-blue-100 px-1 rounded">(You)</span>}
                  </td>
                  <td className="py-3 px-3 text-slate-700">View Only</td>
                  <td className="py-3 px-3 text-slate-400">Restricted</td>
                  <td className="py-3 px-3 text-slate-700">View Directory & Onboarding</td>
                  <td className="py-3 px-3 text-slate-400">Restricted</td>
                </tr>

                <tr className={role === 'STAFF' ? 'bg-slate-50/80 font-medium' : ''}>
                  <td className="py-3 px-3 font-bold text-slate-800 flex items-center gap-1">
                    <span>👤 Staff</span>
                    {role === 'STAFF' && <span className="text-[10px] text-slate-700 bg-slate-200 px-1 rounded">(You)</span>}
                  </td>
                  <td className="py-3 px-3 text-slate-700">View Vault Items</td>
                  <td className="py-3 px-3 text-emerald-700">Day-to-day Counter Sales</td>
                  <td className="py-3 px-3 text-slate-400">No HR Access</td>
                  <td className="py-3 px-3 text-slate-400">Restricted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Staff Roster */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Shop Staff Roster</h3>
            <span className="text-xs text-slate-400">{staffList.length} members enrolled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {staffList.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{st.full_name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        st.role === 'ADMIN'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : st.role === 'SENIOR_HR'
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                          : st.role === 'JUNIOR_HR'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {st.role}
                    </span>
                  </div>

                  <p className="text-[11px] text-amber-700 font-mono font-semibold mt-1">
                    Login User ID: {st.user_id}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{st.designation || 'Staff Associate'}</p>
                  {st.email && <p className="text-[11px] text-slate-400 font-mono">{st.email}</p>}
                </div>

                <div className="text-right text-[10px] text-slate-400">
                  <span>HR: {st.hr_level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Staff Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add Staff Member (Issue User ID)</h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Unique User ID * (Staff uses this to log in)
                </label>
                <input
                  type="text"
                  required
                  value={newUser.user_id}
                  onChange={(e) => setNewUser({ ...newUser, user_id: e.target.value })}
                  placeholder="e.g. rahul_sales"
                  className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl font-mono text-amber-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="rahul@shop.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {role === 'ADMIN' && <option value="ADMIN">Admin</option>}
                    <option value="SENIOR_HR">Senior HR</option>
                    <option value="JUNIOR_HR">Junior HR</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HR Level</label>
                  <select
                    value={newUser.hr_level}
                    onChange={(e) => setNewUser({ ...newUser, hr_level: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="NONE">None</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="SENIOR">Senior</option>
                    <option value="DIRECTOR">Director</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={newUser.designation}
                  onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
                  placeholder="e.g. Senior Jewellery Consultant"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Create Staff User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
