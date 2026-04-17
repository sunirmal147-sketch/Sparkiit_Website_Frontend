"use client";
import { API_BASE_URL } from "@/lib/api-config";

import React, { useState, useEffect, useCallback } from "react";

const API_BASE = API_BASE_URL + "/api/admin";

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    allowedSections: string[];
    reportingTo?: string;
    createdAt: string;
}

const AVAILABLE_SECTIONS = [
    { key: "DASHBOARD", label: "Dashboard" },
    { key: "STUDENT_USERS_MANAGEMENT", label: "Student Users Management" },
    { key: "MANAGE_PROJECTS", label: "Manage Projects" },
    { key: "CERTIFICATE_BUILDER", label: "Certificate Builder" },
    { key: "CERTIFICATE_MANAGEMENT", label: "Certificate Management" },
    { key: "BADGES", label: "Badges" },
    { key: "MANAGE_ORDERS", label: "Manage Orders" },
    { key: "MANAGE_COURSES", label: "Manage Courses" },
    { key: "MANAGE_BLOGS", label: "Manage Blogs" },
    { key: "MANAGE_SERVICES", label: "Manage Services" },
    { key: "SECTIONS", label: "Sections" },
    { key: "BRANDS", label: "Brands" },
    { key: "MANAGE_MENTORS", label: "Manage Mentors" },
    { key: "MANAGE_EVENTS", label: "Manage Events" },
    { key: "FOOTER_SETTINGS", label: "Footer Settings" },
    { key: "MENU_BUILDER", label: "Menu Builder" },
    { key: "PAGE_BUILDER", label: "Page Builder" },
    { key: "SOCIAL_LINKS", label: "Social Links" },
    { key: "FAQS", label: "FAQs" },
    { key: "SETTINGS", label: "Settings" },
    { key: "MANAGE_TEAM", label: "Team Management (Manage Team)" },
    { key: "MY_PERFORMANCE", label: "Team Management (My Performance)" },
    { key: "MANAGE_COUPONS", label: "Manage Coupons" },
    { key: "WITHDRAW_PAYMENTS", label: "Withdraw Payments" },
    { key: "LOCATIONS", label: "Locations" },
    { key: "CMS_USER", label: "CMS User (Admin Management)" },
    { key: "ATTENDANCE_LOGS", label: "Attendance Logs" },
];

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEADER', 'MANAGER', 'BDE', 'BDA', 'USER'];

const ROLE_COLORS: Record<string, string> = {
    SUPER_ADMIN: '#00875a',
    ADMIN: '#818cf8',
    TEAM_LEADER: '#f59e0b',
    MANAGER: '#fb923c',
    HR: '#e879f9',
    BDE: '#22d3ee',
    BDA: '#86efac',
    USER: 'rgba(255,255,255,0.3)',
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [form, setForm] = useState({ 
        username: "", 
        email: "", 
        password: "", 
        role: "ADMIN",
        allowedSections: [] as string[],
        reportingTo: ""
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const fetchUsers = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/users`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { if (d.data) setUsers(d.data); })
            .catch(() => { });
            
        fetch(`${API_BASE}/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { if (d.data) setCurrentUser(d.data); })
            .catch(() => { });
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleSave = async () => {
        setSaving(true);
        setError("");
        const token = localStorage.getItem("adminToken");
        try {
            const url = editingUserId 
                ? `${API_BASE}/users/${editingUserId}/role` 
                : `${API_BASE}/register`;
            
            const method = editingUserId ? "PUT" : "POST";
            
            const payload: any = { ...form };
            if (editingUserId) {
                delete payload.password;
                delete payload.username;
                delete payload.email;
            }
            // Send empty string as null for reportingTo
            if (!payload.reportingTo) payload.reportingTo = null;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setModalOpen(false);
                setForm({ username: "", email: "", password: "", role: "ADMIN", allowedSections: [], reportingTo: "" });
                setEditingUserId(null);
                fetchUsers();
            } else {
                setError(data.message || "Failed to save user");
            }
        } catch { setError("Server error"); }
        setSaving(false);
    };

    const handleEdit = (user: User) => {
        setForm({
            username: user.username,
            email: user.email,
            password: "",
            role: user.role,
            allowedSections: user.allowedSections || [],
            reportingTo: user.reportingTo || ""
        });
        setEditingUserId(user._id);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this admin?")) return;
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchUsers();
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        color: "#fff",
        fontSize: 14,
        outline: "none",
        marginBottom: 16
    };

    // Build lookup for reporting-to display
    const userMap = Object.fromEntries(users.map(u => [u._id, u.username]));

    return (
        <div style={{ paddingBottom: 80 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>User Management</h2>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4, fontWeight: 500 }}>Manage CMS users, roles, permissions & team assignments</p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ ...inputStyle, width: 200, marginBottom: 0, fontSize: 13 }}
                    />
                    {currentUser && (
                        <button
                            onClick={() => {
                                setEditingUserId(null);
                                setForm({ username: "", email: "", password: "", role: "ADMIN", allowedSections: [], reportingTo: "" });
                                setModalOpen(true);
                            }}
                            style={{ padding: "10px 24px", borderRadius: 10, background: "#00875a", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}
                        >
                            + Create User
                        </button>
                    )}
                </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            {["Username", "Email", "Role", "Reporting To", "Sections", "Created", "Actions"].map((h) => (
                                <th key={h} style={{ padding: "14px 20px", fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", textAlign: "left", fontWeight: 600, letterSpacing: "0.08em" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 && (
                            <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>No users found</td></tr>
                        )}
                        {filteredUsers.map((u) => (
                            <tr key={u._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                                <td style={{ padding: "14px 20px", color: "#fff", fontWeight: 600, fontSize: 14 }}>{u.username}</td>
                                <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{u.email}</td>
                                <td style={{ padding: "14px 20px" }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: `${ROLE_COLORS[u.role] || '#888'}22`, color: ROLE_COLORS[u.role] || '#888', border: `1px solid ${ROLE_COLORS[u.role] || '#888'}33` }}>
                                        {u.role.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td style={{ padding: "14px 20px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                                    {u.reportingTo ? (userMap[u.reportingTo] || <span style={{ color: "rgba(255,100,100,0.6)", fontSize: 11 }}>Unknown</span>) : <span style={{ color: "rgba(255,255,255,0.15)" }}>—</span>}
                                </td>
                                <td style={{ padding: "14px 20px" }}>
                                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 6 }}>
                                        {u.allowedSections?.length || 0} sections
                                    </span>
                                </td>
                                <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: "14px 20px" }}>
                                    {currentUser && u.role !== "SUPER_ADMIN" && (currentUser.role === "SUPER_ADMIN" || ROLES.indexOf(currentUser.role) <= ROLES.indexOf(u.role)) && (
                                        <div style={{ display: "flex", gap: 10 }}>
                                            <button onClick={() => handleEdit(u)} style={{ color: "#00875a", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Edit</button>
                                            <button onClick={() => handleDelete(u._id)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }} onClick={() => setModalOpen(false)}>
                    <div style={{ background: "#141414", borderRadius: 24, padding: 32, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(255,255,255,0.08)" }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: 20, color: "#fff", marginBottom: 6, fontWeight: 800 }}>{editingUserId ? "Edit User" : "Create New User"}</h2>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 28 }}>{editingUserId ? "Update role, team assignment and permissions." : "Create a new CMS admin user."}</p>
                        
                        {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 16, padding: "10px 14px", background: "rgba(248,113,113,0.1)", borderRadius: 8, border: "1px solid rgba(248,113,113,0.2)" }}>{error}</p>}
                        
                        {!editingUserId && (
                            <>
                                <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Username</label>
                                <input style={inputStyle} placeholder="Enter username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                                <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</label>
                                <input style={inputStyle} placeholder="Enter email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</label>
                                <input style={inputStyle} type="password" placeholder="Enter password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            </>
                        )}
                        {editingUserId && (
                            <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(0,135,90,0.08)", borderRadius: 10, border: "1px solid rgba(0,135,90,0.2)" }}>
                                <p style={{ color: "#00875a", fontSize: 13, fontWeight: 700 }}>{form.username}</p>
                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{form.email}</p>
                            </div>
                        )}

                        <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Role</label>
                        <select style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            {ROLES.filter(r => currentUser?.role === "SUPER_ADMIN" || (ROLES.indexOf(currentUser?.role || "USER") <= ROLES.indexOf(r) && r !== "SUPER_ADMIN")).map(role => (
                                <option key={role} value={role} style={{ background: "#141414", color: "#fff" }}>{role.replace(/_/g, ' ')}</option>
                            ))}
                        </select>

                        <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Reporting To (Team Lead / Manager)
                        </label>
                        <select 
                            style={inputStyle} 
                            value={form.reportingTo} 
                            onChange={(e) => setForm({ ...form, reportingTo: e.target.value })}
                        >
                            <option value="" style={{ background: "#141414", color: "rgba(255,255,255,0.4)" }}>— No Team Lead —</option>
                            {users.filter(u => u._id !== editingUserId && ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEADER', 'MANAGER'].includes(u.role)).map(u => (
                                <option key={u._id} value={u._id} style={{ background: "#141414", color: "#fff" }}>{u.username} ({u.role.replace(/_/g, ' ')})</option>
                            ))}
                        </select>

                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, marginTop: 4 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                <h3 style={{ color: "#fff", fontSize: 14, margin: 0, fontWeight: 700 }}>Section Permissions</h3>
                                {currentUser?.role === "SUPER_ADMIN" && (
                                    <button 
                                        onClick={() => {
                                            if (form.allowedSections.length === AVAILABLE_SECTIONS.length) {
                                                setForm({ ...form, allowedSections: [] });
                                            } else {
                                                setForm({ ...form, allowedSections: AVAILABLE_SECTIONS.map(s => s.key) });
                                            }
                                        }}
                                        style={{ background: "none", border: "none", color: "#00875a", fontSize: 12, cursor: "pointer", fontWeight: 700 }}
                                    >
                                        {form.allowedSections.length === AVAILABLE_SECTIONS.length ? "Deselect All" : "Select All"}
                                    </button>
                                )}
                            </div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                {AVAILABLE_SECTIONS.map((section) => {
                                    if (currentUser?.role !== "SUPER_ADMIN" && !currentUser?.allowedSections?.includes(section.key)) {
                                        return null;
                                    }
                                    const isChecked = form.allowedSections.includes(section.key);
                                    return (
                                        <label key={section.key} style={{ display: "flex", alignItems: "center", gap: 8, color: isChecked ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", padding: "6px 8px", borderRadius: 6, background: isChecked ? "rgba(0,135,90,0.08)" : "transparent", transition: "all 0.15s" }}>
                                            <input 
                                                type="checkbox" 
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setForm({ ...form, allowedSections: [...form.allowedSections, section.key] });
                                                    } else {
                                                        setForm({ ...form, allowedSections: form.allowedSections.filter(k => k !== section.key) });
                                                    }
                                                }}
                                                style={{ accentColor: "#00875a", width: 14, height: 14, flexShrink: 0 }}
                                            />
                                            {section.label}
                                        </label>
                                    )
                                })}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
                            <button onClick={() => setModalOpen(false)} style={{ padding: "11px 24px", borderRadius: 10, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontWeight: 600, border: "none", cursor: "pointer", fontSize: 13 }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving} style={{ padding: "11px 28px", borderRadius: 10, background: "#00875a", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 13, opacity: saving ? 0.6 : 1 }}>{saving ? "Saving..." : "Save User"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
