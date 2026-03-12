"use client";

import React, { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:5000/api/admin";

interface User {
    _id: string;
    username: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN";
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ username: "", email: "", password: "", role: "ADMIN" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchUsers = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/users`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { if (d.data) setUsers(d.data); })
            .catch(() => { });
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleCreate = async () => {
        setSaving(true);
        setError("");
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                setModalOpen(false);
                setForm({ username: "", email: "", password: "", role: "ADMIN" });
                fetchUsers();
            } else {
                setError(data.message || "Failed to create user");
            }
        } catch { setError("Server error"); }
        setSaving(false);
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

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>Admin Management</h2>
                <button
                    onClick={() => setModalOpen(true)}
                    style={{
                        padding: "10px 24px",
                        borderRadius: 10,
                        background: "#a8e03e",
                        color: "#050505",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Create Admin
                </button>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            {["Username", "Email", "Role", "Created", "Actions"].map((h) => (
                                <th key={h} style={{ padding: "16px 20px", fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                <td style={{ padding: "16px 20px", color: "#fff", fontWeight: 500 }}>{u.username}</td>
                                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.6)" }}>{u.email}</td>
                                <td style={{ padding: "16px 20px" }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: u.role === "SUPER_ADMIN" ? "rgba(168,224,62,0.1)" : "rgba(129,140,248,0.1)", color: u.role === "SUPER_ADMIN" ? "#a8e03e" : "#818cf8" }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: "16px 20px" }}>
                                    {u.role !== "SUPER_ADMIN" && (
                                        <button onClick={() => handleDelete(u._id)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setModalOpen(false)}>
                    <div style={{ background: "#141414", borderRadius: 24, padding: 32, width: 400 }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: 20, color: "#fff", marginBottom: 24 }}>Create New Admin</h2>
                        {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 16 }}>{error}</p>}
                        <input style={inputStyle} placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                        <input style={inputStyle} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        <input style={inputStyle} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        <select style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            <option value="ADMIN">Admin</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                        <div style={{ display: "flex", gap: 12, marginTop: 10, justifyContent: "flex-end" }}>
                            <button onClick={handleCreate} disabled={saving} style={{ padding: "12px 24px", borderRadius: 12, background: "#a8e03e", color: "#050505", fontWeight: 700, border: "none", cursor: "pointer" }}>{saving ? "Creating..." : "Create"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
